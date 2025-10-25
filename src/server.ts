// src/server.ts

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CanvasClient } from './client.js';

interface SSEConnection {
  sessionId: string;
  transport: SSEServerTransport;
  server: Server;
}

export class SSEMCPServer {
  private app: express.Application;
  private connections: Map<string, SSEConnection> = new Map();
  private port: number;
  private apiKey: string | undefined;
  private canvasToken: string;
  private canvasDomain: string;

  constructor(
    port: number,
    canvasToken: string,
    canvasDomain: string,
    apiKey?: string
  ) {
    this.app = express();
    this.port = port;
    this.apiKey = apiKey;
    this.canvasToken = canvasToken;
    this.canvasDomain = canvasDomain;

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // CORS configuration
    this.app.use(cors({
      origin: '*', // Allow all origins for Poke.com and other integrations
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Accept'],
      credentials: true
    }));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.error(`[SSE Server] ${req.method} ${req.path}`);
      next();
    });
  }

  private authenticateRequest(req: Request, res: Response, next: NextFunction): void {
    if (!this.apiKey) {
      // No API key configured, allow all requests
      return next();
    }

    const authHeader = req.headers.authorization;
    const providedKey = authHeader?.replace('Bearer ', '');

    if (providedKey === this.apiKey) {
      next();
    } else {
      console.error('[SSE Server] Authentication failed');
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', async (req: Request, res: Response) => {
      try {
        const client = new CanvasClient(this.canvasToken, this.canvasDomain);
        const health = await client.healthCheck();
        res.json({
          status: 'ok',
          canvas: health,
          timestamp: new Date().toISOString(),
          connections: this.connections.size
        });
      } catch (error) {
        console.error('[SSE Server] Health check failed:', error);
        res.status(503).json({
          status: 'error',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error)
        });
      }
    });

    // Root endpoint
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        name: 'Canvas MCP Server',
        version: '2.3.0',
        transport: 'SSE',
        endpoints: {
          health: '/health',
          sse: '/sse',
          messages: '/messages'
        },
        documentation: 'https://github.com/DMontgomery40/mcp-canvas-lms'
      });
    });

    // SSE endpoint - Server-Sent Events connection
    this.app.get('/sse', this.authenticateRequest.bind(this), async (req: Request, res: Response) => {
      console.error('[SSE Server] New SSE connection request');

      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

      // Generate session ID
      const sessionId = Math.random().toString(36).substring(7);

      try {
        // Create SSE transport
        const transport = new SSEServerTransport('/messages', res);
        
        // Import the MCP server setup from index
        const { createMCPServer } = await import('./index.js');
        const server = createMCPServer(this.canvasToken, this.canvasDomain);

        // Store connection
        this.connections.set(sessionId, { sessionId, transport, server });
        console.error(`[SSE Server] Connection established: ${sessionId}`);

        // Connect server to transport
        await server.connect(transport);

        // Handle client disconnect
        req.on('close', () => {
          console.error(`[SSE Server] Connection closed: ${sessionId}`);
          this.connections.delete(sessionId);
          server.close();
        });

      } catch (error) {
        console.error('[SSE Server] Error establishing SSE connection:', error);
        if (!res.headersSent) {
          res.status(500).json({
            error: 'Failed to establish SSE connection',
            details: error instanceof Error ? error.message : String(error)
          });
        }
      }
    });

    // Messages endpoint - POST endpoint for incoming messages
    this.app.post('/messages', this.authenticateRequest.bind(this), async (req: Request, res: Response) => {
      console.error('[SSE Server] Received message:', JSON.stringify(req.body));

      try {
        // The SSE transport handles message routing internally
        // This endpoint is used by the SSE transport to receive messages
        res.status(200).json({ success: true });
      } catch (error) {
        console.error('[SSE Server] Error handling message:', error);
        res.status(500).json({
          error: 'Failed to process message',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    });

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: 'Not Found',
        path: req.path,
        availableEndpoints: ['/', '/health', '/sse', '/messages']
      });
    });

    // Error handler
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('[SSE Server] Error:', err);
      res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
      });
    });
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, '0.0.0.0', () => {
        console.error(`[SSE Server] Listening on http://0.0.0.0:${this.port}`);
        console.error(`[SSE Server] SSE endpoint: http://0.0.0.0:${this.port}/sse`);
        console.error(`[SSE Server] Health check: http://0.0.0.0:${this.port}/health`);
        if (this.apiKey) {
          console.error('[SSE Server] API key authentication enabled');
        }
        resolve();
      });
    });
  }

  getApp(): express.Application {
    return this.app;
  }
}

