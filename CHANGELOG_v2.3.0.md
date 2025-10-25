# Changelog

All notable changes to the Canvas MCP Server project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2025-01-15

### Added
- **SSE Transport Support**: Full Server-Sent Events transport implementation for cloud deployment
- **Poke.com Integration**: Native support for Poke.com AI assistant integration via text messages
- **Express HTTP Server**: New Express-based server with REST API endpoints
- **Health Check Endpoint**: `/health` endpoint for monitoring Canvas API connectivity
- **API Key Authentication**: Optional Bearer token authentication for securing MCP endpoints
- **Render Deployment**: Full support for Render cloud platform with `render.yaml` configuration
- **Multiple Connections**: Support for concurrent SSE connections with session management
- **CORS Support**: Cross-origin resource sharing for web-based clients

### Changed
- Replaced stdio transport with HTTP/SSE transport as primary mode
- Updated Docker health check to use HTTP endpoint instead of node evaluation
- Enhanced README with Poke.com and Render deployment guides
- Updated all version references to 2.3.0

### Technical
- New dependencies: `express`, `cors`, and their TypeScript types
- New `src/server.ts` module for Express server and SSE handling
- Refactored `src/index.ts` to export `createMCPServer` function
- Updated Dockerfile with `wget` for HTTP health checks
- Added comprehensive environment variable documentation

### Documentation
- Added API endpoints documentation section
- Added environment variables reference
- Added Poke.com integration guide
- Added Render deployment guide with step-by-step instructions
- Added troubleshooting tips for SSE/Render deployment

## [2.2.3] - 2025-01-10

### Fixed
- Course creation "page not found" error (missing `account_id` parameter)

## [2.2.0] - 2025-01-05

### Added
- Account Management: Complete account-level administration tools
- Reports & Analytics: Generate and access Canvas account reports
- User Management: Create and manage users at the account level
- Multi-Account Support: Handle account hierarchies and sub-accounts
- API Compliance: All endpoints now follow proper Canvas API patterns

### New Tools
- `canvas_get_account` - Get account details
- `canvas_list_account_courses` - List courses in an account
- `canvas_list_account_users` - List users in an account
- `canvas_create_user` - Create new users in accounts
- `canvas_list_sub_accounts` - List sub-accounts
- `canvas_get_account_reports` - List available reports
- `canvas_create_account_report` - Generate account reports

## [2.1.0] - 2024-12-20

### Added
- Comprehensive student functionality
- Quiz support
- Module tracking
- Rubrics
- Conversations
- Calendar events
- File management

## [2.0.0] - 2024-12-15

### Added
- Initial release with 50+ Canvas LMS tools
- Course management
- Assignment management
- Submissions and grading
- Discussion forums
- Announcements
- User profiles
- Grade tracking

### Technical
- Full TypeScript implementation
- Automatic pagination
- Retry logic with exponential backoff
- Comprehensive error handling
- Docker support

