# 🚀 Vegamailer - Email Marketing Platform

A complete email marketing platform built with React, Node.js, and PocketBase.

## 📋 Features

- 📧 Email campaign management
- 👥 Subscriber management
- 📊 Campaign analytics
- 🎨 Email template builder
- 🔗 Custom sender domains
- 📈 Real-time tracking
- 🔒 Secure authentication
- 💼 Multi-business support

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Radix UI** - Component library
- **React Hook Form** - Form handling
- **TanStack Query** - Data fetching

### Backend
- **Node.js + Express** - API server
- **PocketBase** - Database and authentication
- **Plunk/Resend** - Email delivery services

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** v20.19.1 or higher ([Download](https://nodejs.org/))
- **npm** v10 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

## 🚀 Quick Start (Windows)

### 1. Clone the Repository

```powershell
git clone https://github.com/Os-Healthcarepro-lab/Web_Vegamailer.git
cd Web_Vegamailer
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and configure it:

```powershell
Copy-Item apps\api\.env.example apps\api\.env
```

Edit `apps\api\.env` and update the values (optional API keys for development).

### 4. Start Development Server

Run the included PowerShell script:

```powershell
.\dev.ps1
```

Or manually:

```powershell
$env:PB_ENCRYPTION_KEY = "12345678901234567890123456789012"
$env:PB_SUPERUSER_EMAIL = "admin@vegamailer.local"
$env:PB_SUPERUSER_PASSWORD = "admin123456"
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **PocketBase Admin**: http://localhost:8090/_/

**Default Admin Credentials:**
- Email: `admin@vegamailer.local`
- Password: `admin123456`

## 🚀 Quick Start (Linux/Mac)

### 1. Clone and Install

```bash
git clone https://github.com/Os-Healthcarepro-lab/Web_Vegamailer.git
cd Web_Vegamailer
npm install
```

### 2. Configure Environment

```bash
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your preferred editor
```

### 3. Start Development

```bash
export PB_ENCRYPTION_KEY="12345678901234567890123456789012"
export PB_SUPERUSER_EMAIL="admin@vegamailer.local"
export PB_SUPERUSER_PASSWORD="admin123456"
npm run dev
```

## 📁 Project Structure

```
Web.Vegamailer/
├── apps/
│   ├── api/                 # Express API server
│   │   └── src/
│   │       ├── routes/      # API routes
│   │       ├── middleware/  # Express middleware
│   │       └── utils/       # Utility functions
│   ├── pocketbase/          # PocketBase backend
│   │   ├── pb_hooks/        # Database hooks
│   │   ├── pb_migrations/   # Database migrations
│   │   └── pocketbase.exe   # PocketBase executable
│   └── web/                 # React frontend
│       └── src/
│           ├── components/  # React components
│           ├── pages/       # Page components
│           ├── contexts/    # React contexts
│           └── hooks/       # Custom hooks
├── .gitignore
├── package.json
├── README.md
└── dev.ps1                  # Development startup script
```

## 🔧 Available Scripts

### Development
```powershell
npm run dev              # Start all services (web + api + pocketbase)
```

### Production Build
```powershell
npm run build            # Build frontend for production
npm run deploy           # Build and prepare for deployment
```

### Production Start
```powershell
npm start                # Start API and PocketBase (production)
npm run start:pm2        # Start with PM2 process manager
```

### Other Commands
```powershell
npm run lint             # Run ESLint on all apps
npm run logs:pm2         # View PM2 logs
npm run stop:pm2         # Stop PM2 processes
npm run restart:pm2      # Restart PM2 processes
```

## 🔐 Environment Variables

### API Server (`apps/api/.env`)

```env
# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# PocketBase Configuration
WEBSITE_DOMAIN=localhost:8090
PB_SUPERUSER_EMAIL=admin@vegamailer.local
PB_SUPERUSER_PASSWORD=admin123456

# Email Service API Keys (Optional for development)
PLUNK_API_KEY=your_plunk_api_key_here
RESEND_API_KEY=your_resend_api_key_here
```

### PocketBase Environment Variables

Set these in your terminal before running:

- `PB_ENCRYPTION_KEY` - Database encryption key (must be exactly 32 characters)
- `PB_SUPERUSER_EMAIL` - Admin email for PocketBase
- `PB_SUPERUSER_PASSWORD` - Admin password for PocketBase

## 📧 Email Service Setup (Optional)

To send actual emails, you'll need API keys from:

1. **Plunk** - Get your API key from [https://app.useplunk.com/settings/project](https://app.useplunk.com/settings/project)
2. **Resend** - Get your API key from [https://resend.com/api-keys](https://resend.com/api-keys)

Add these to your `apps/api/.env` file.

## 🚀 Production Deployment

Ready to deploy to production?

**Quick Commands:**
```powershell
# Test if ready for deployment
npm run pre-deploy

# Generate secure encryption key
npm run generate-key

# Build for production
npm run build
```

**Deployment Guides:**
- **[PRODUCTION.md](PRODUCTION.md)** - Complete production deployment guide
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist
- **[QUICKSTART.md](QUICKSTART.md)** - Quick Hostinger VPS deployment
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed deployment instructions

**Key Steps:**
1. Update `apps/api/.env.production` with your domain and credentials
2. Generate a secure 32-character encryption key
3. Build the frontend: `npm run build`
4. Deploy to your server (VPS, cloud, or hosting)
5. Configure Nginx and SSL certificates
6. Start services with PM2

See [PRODUCTION.md](PRODUCTION.md) for detailed instructions.

## 🐛 Troubleshooting

### Port Already in Use

```powershell
# Find process using port 3000, 3001, or 8090
netstat -ano | findstr :3000
# Kill the process
taskkill /PID <PID> /F
```

### PocketBase Connection Issues

Make sure PocketBase is running and the `WEBSITE_DOMAIN` in `.env` is correct:
- Development: `localhost:8090`
- Production: Your actual domain

### Module Not Found Errors

```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Database Reset

If you need to reset the database:

```powershell
Remove-Item -Recurse -Force apps\pocketbase\pb_data\data.db*
# Restart the development server
.\dev.ps1
```

## 📝 Development Tips

1. **Hot Reload**: All services support hot reload in development mode
2. **Code Linting**: Run `npm run lint` before committing
3. **Database Migrations**: Located in `apps/pocketbase/pb_migrations/`
4. **API Routes**: All routes are in `apps/api/src/routes/`
5. **Frontend Components**: Reusable components in `apps/web/src/components/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Check [QUICKSTART.md](QUICKSTART.md) for deployment help
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for production setup

## 🔄 Version

Current version: 0.0.0 (Development)

---

**Made with ❤️ by Os-Healthcarepro-lab**
