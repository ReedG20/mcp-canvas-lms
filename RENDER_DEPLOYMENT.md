# Render Deployment Guide

This guide will help you deploy Canvas MCP Server to Render for use with Poke.com or other SSE-based MCP clients.

## Prerequisites

1. A Render account (sign up at [render.com](https://render.com))
2. Canvas LMS API token
3. Your Canvas domain (e.g., `school.instructure.com`)
4. Git repository with this code (forked or cloned)

## Quick Deploy

### Option 1: One-Click Deploy

Click the button below to deploy directly to Render:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Option 2: Manual Deployment

#### Step 1: Create New Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select this repository

#### Step 2: Configure Service

Fill in the following settings:

- **Name**: `canvas-mcp-server` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty (unless in monorepo)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node build/index.js`
- **Plan**: Free (or paid for better performance)

#### Step 3: Set Environment Variables

Click **"Advanced"** and add these environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `CANVAS_API_TOKEN` | Your Canvas API token | Required |
| `CANVAS_DOMAIN` | `school.instructure.com` | Required |
| `MCP_API_KEY` | Generate random key | Recommended for security |
| `NODE_ENV` | `production` | Optional |
| `LOG_LEVEL` | `info` | Optional |

**Generating MCP_API_KEY:**
```bash
# Use any of these methods:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
openssl rand -hex 32
```

#### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (2-5 minutes)
3. Note your service URL: `https://your-app.onrender.com`

#### Step 5: Verify Deployment

Test the health endpoint:
```bash
curl https://your-app.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "canvas": {
    "status": "ok",
    "timestamp": "2025-01-15T12:00:00Z",
    "user": { "id": 12345, "name": "Your Name" }
  },
  "timestamp": "2025-01-15T12:00:00Z",
  "connections": 0
}
```

## Connect to Poke.com

### Step 1: Get Your SSE URL

Your SSE endpoint URL will be:
```
https://your-app.onrender.com/sse
```

### Step 2: Configure in Poke.com

1. Open Poke.com app
2. Go to Settings → Integrations
3. Click **"New Integration"**
4. Select **"Model Context Protocol"**
5. Fill in:
   - **Name**: Canvas LMS
   - **Server URL**: `https://your-app.onrender.com/sse`
   - **API Key**: Your `MCP_API_KEY` (if set)
6. Click **"Add Integration"**

### Step 3: Test the Integration

Send a test message via Poke.com:
```
"List my Canvas courses"
"What assignments do I have due this week?"
"Show me my current grades"
```

## Monitoring & Maintenance

### Health Checks

Render automatically monitors your `/health` endpoint. If it fails:
1. Check Render logs in dashboard
2. Verify Canvas API token is valid
3. Ensure Canvas domain is correct

### View Logs

```bash
# Via Render Dashboard
Dashboard → Your Service → Logs

# Or use Render CLI
render logs -f canvas-mcp-server
```

### Update Deployment

Push changes to your git branch:
```bash
git add .
git commit -m "Update server"
git push origin main
```

Render will automatically redeploy.

## Troubleshooting

### Service Won't Start

**Symptoms**: Build succeeds but service fails to start

**Solutions**:
1. Check environment variables are set correctly
2. Verify Canvas API token has not expired
3. Check logs for specific error messages

### Health Check Failing

**Symptoms**: Service marked as unhealthy in Render

**Solutions**:
1. Test health endpoint manually: `curl https://your-app.onrender.com/health`
2. Check Canvas API connectivity
3. Verify token permissions (needs read access at minimum)

### SSE Connection Fails

**Symptoms**: Poke.com can't connect or connections drop immediately

**Solutions**:
1. Verify API key matches in both Render and Poke.com
2. Check CORS settings (should allow all origins)
3. Test SSE endpoint: `curl https://your-app.onrender.com/sse`
4. Check Render logs for authentication errors

### Rate Limiting

**Symptoms**: Intermittent failures or timeouts

**Solutions**:
1. Increase `CANVAS_MAX_RETRIES` to 5
2. Increase `CANVAS_RETRY_DELAY` to 2000ms
3. Consider upgrading Render plan for better resources

## Advanced Configuration

### Custom Domain

1. Go to Render Dashboard → Your Service → Settings
2. Scroll to **"Custom Domain"**
3. Add your domain (e.g., `canvas-mcp.yourdomain.com`)
4. Update DNS records as instructed
5. Update Poke.com with new URL

### Scaling

For high traffic:
1. Upgrade to paid Render plan
2. Consider multiple instances
3. Use Render's auto-scaling features

### Environment-Specific Configs

Create separate Render services for different environments:
- Development: `canvas-mcp-dev`
- Staging: `canvas-mcp-staging`
- Production: `canvas-mcp-prod`

Each with their own Canvas credentials.

## Security Best Practices

1. **Always use MCP_API_KEY in production**
2. **Rotate API keys regularly** (both Canvas and MCP)
3. **Use HTTPS only** (default on Render)
4. **Monitor access logs** for suspicious activity
5. **Set up alerts** in Render for failed health checks

## Cost Optimization

### Free Tier (Good for personal use)
- 750 hours/month free
- Sleeps after 15 minutes of inactivity
- Wakes on first request (30-60 second delay)

### Paid Plans (Recommended for production)
- Starts at $7/month
- No sleep
- Better performance
- Custom domains included

## Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Canvas MCP Issues**: [GitHub Issues](https://github.com/DMontgomery40/mcp-canvas-lms/issues)
- **Poke.com Support**: Contact Poke.com directly

## Next Steps

- [Configure additional Canvas permissions](../README.md#getting-canvas-api-token)
- [Explore available Canvas tools](../README.md#-available-tools-50-tools)
- [Set up monitoring and alerts](https://render.com/docs/monitoring-metrics)

