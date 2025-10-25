# Quick Start Guide - Canvas MCP Server v2.3.0

## For Poke.com Users (Recommended)

### 1. Deploy to Render (5 minutes)

```bash
# Fork or clone this repo
git clone https://github.com/DMontgomery40/mcp-canvas-lms.git
cd mcp-canvas-lms
```

### 2. Create Render Service

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - Build: `npm install && npm run build`
   - Start: `node build/index.js`
   - Add environment variables:
     - `CANVAS_API_TOKEN`: Get from Canvas → Account → Settings → New Access Token
     - `CANVAS_DOMAIN`: Your school's Canvas domain (e.g., `school.instructure.com`)
     - `MCP_API_KEY`: Generate with `openssl rand -hex 32`

### 3. Connect to Poke.com

1. Open Poke.com app
2. Settings → Integrations → New Integration
3. Enter:
   - Server URL: `https://your-app.onrender.com/sse`
   - API Key: Your `MCP_API_KEY`
4. Save and test: "List my Canvas courses"

## For Local Development

### 1. Install & Build

```bash
git clone https://github.com/DMontgomery40/mcp-canvas-lms.git
cd mcp-canvas-lms
npm install
npm run build
```

### 2. Configure Environment

Create `.env` file:
```env
CANVAS_API_TOKEN=your_canvas_token
CANVAS_DOMAIN=school.instructure.com
PORT=3000
MCP_API_KEY=optional_but_recommended
LOG_LEVEL=info
```

### 3. Start Server

```bash
npm start
```

Server will start at `http://localhost:3000`

### 4. Test Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Server info
curl http://localhost:3000/

# SSE endpoint (requires SSE client)
curl http://localhost:3000/sse
```

## For Docker Users

```bash
# Build image
docker build -t canvas-mcp:latest .

# Run container
docker run -d \
  --name canvas-mcp \
  -p 3000:3000 \
  -e CANVAS_API_TOKEN="your_token" \
  -e CANVAS_DOMAIN="school.instructure.com" \
  -e MCP_API_KEY="your_api_key" \
  canvas-mcp:latest

# Check logs
docker logs -f canvas-mcp

# Check health
curl http://localhost:3000/health
```

## Testing Canvas Integration

Once deployed, test these commands via Poke.com or your MCP client:

```
"List my Canvas courses"
"What assignments do I have due this week?"
"Show me my current grades in Biology"
"Mark module item 123 as complete in course 456"
"Submit my essay for English 101 Assignment 5"
"Create a new course called Advanced Physics"
"List all users in account 1"
```

## Troubleshooting

### Server Won't Start
- Check environment variables are set
- Verify Canvas token hasn't expired
- Check Canvas domain is correct (no `https://`)

### Can't Connect from Poke.com
- Verify MCP_API_KEY matches
- Check server URL ends with `/sse`
- Test health endpoint first

### Canvas API Errors
- Verify token has correct permissions
- Check domain format (no protocol, no trailing slash)
- Test token directly with Canvas API

## Next Steps

- [Full Render Deployment Guide](RENDER_DEPLOYMENT.md)
- [Complete Documentation](README.md)
- [API Endpoint Reference](README.md#-api-endpoints-sse-transport)
- [Changelog](CHANGELOG_v2.3.0.md)
- [Implementation Details](SSE_IMPLEMENTATION_SUMMARY.md)

## Support

- GitHub Issues: [Report bugs or request features](https://github.com/DMontgomery40/mcp-canvas-lms/issues)
- Documentation: [Full README](README.md)
- Render Support: [render.com/docs](https://render.com/docs)

## Quick Commands Reference

```bash
# Development
npm install          # Install dependencies
npm run build        # Build TypeScript
npm start            # Start server
npm run dev:watch    # Development with hot reload

# Testing
npm test            # Run tests
npm run lint        # Check code quality
npm run type-check  # TypeScript validation

# Docker
npm run docker:build      # Build Docker image
npm run docker:run        # Run container
npm run docker:compose:up # Start with docker-compose

# Deployment
git push origin main      # Auto-deploy on Render
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CANVAS_API_TOKEN` | Yes | - | Canvas API access token |
| `CANVAS_DOMAIN` | Yes | - | Canvas domain (e.g., school.instructure.com) |
| `PORT` | No | 3000 | Server port |
| `MCP_API_KEY` | No | - | API key for securing endpoints |
| `NODE_ENV` | No | development | Environment mode |
| `LOG_LEVEL` | No | info | Logging verbosity |
| `CANVAS_MAX_RETRIES` | No | 3 | API retry attempts |
| `CANVAS_RETRY_DELAY` | No | 1000 | Retry delay (ms) |
| `CANVAS_TIMEOUT` | No | 30000 | Request timeout (ms) |

Happy coding! 🎓🚀

