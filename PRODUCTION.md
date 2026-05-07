# 🚀 Production Deployment Guide

This guide will help you deploy Vegamailer to production.

## 📋 Quick Start

### Option 1: Automated Pre-Deployment Test (Recommended)
```powershell
npm run pre-deploy
```
This will test your build, check for issues, and verify everything is ready.

### Option 2: Generate Secure Encryption Key
```powershell
npm run generate-key
```
This creates a cryptographically secure 32-character key for production.

## 🔧 Pre-Deployment Setup

### 1. Update Environment Configuration

Copy the production template:
```powershell
# Windows
Copy-Item apps\api\.env.production apps\api\.env

# Linux/Mac
cp apps/api/.env.production apps/api/.env
```

Edit `apps/api/.env` and update these values:
```env
CORS_ORIGIN=https://yourdomain.com           # Your actual domain
WEBSITE_DOMAIN=yourdomain.com                # Without https://
PB_SUPERUSER_EMAIL=admin@yourdomain.com      # Your admin email
PB_SUPERUSER_PASSWORD=YourSecurePassword123! # Strong password
PLUNK_API_KEY=your_actual_plunk_key          # From Plunk dashboard
RESEND_API_KEY=your_actual_resend_key        # From Resend dashboard
```

### 2. Generate Production Encryption Key

**Important:** Use a different key than development!

```powershell
# Windows
npm run generate-key

# Linux/Mac
openssl rand -hex 16
```

Save this key securely - you'll need it to start PocketBase.

### 3. Run Pre-Deployment Tests

```powershell
npm run pre-deploy
```

This checks:
- ✅ Node.js version
- ✅ Dependencies installed
- ✅ Environment configured
- ✅ Code quality (linter)
- ✅ Frontend builds successfully
- ✅ No security vulnerabilities
- ✅ PocketBase executable exists

## 🌐 Deployment Methods

### Method 1: VPS/Cloud Server (DigitalOcean, Linode, etc.)

#### Step 1: Prepare Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20.19.1
nvm use 20.19.1

# Install PM2
npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

#### Step 2: Clone and Setup
```bash
# Clone repository
git clone https://github.com/Os-Healthcarepro-lab/Web_Vegamailer.git
cd Web_Vegamailer

# Install dependencies
npm ci --production

# Configure environment
cp apps/api/.env.production apps/api/.env
nano apps/api/.env  # Edit with your values
```

#### Step 3: Set Environment Variables
```bash
# Generate and set encryption key
export PB_ENCRYPTION_KEY="your-32-character-key-here"
export PB_SUPERUSER_EMAIL="admin@yourdomain.com"
export PB_SUPERUSER_PASSWORD="your-secure-password"

# Make permanent (add to ~/.bashrc or use systemd)
echo 'export PB_ENCRYPTION_KEY="your-key"' >> ~/.bashrc
echo 'export PB_SUPERUSER_EMAIL="admin@yourdomain.com"' >> ~/.bashrc
echo 'export PB_SUPERUSER_PASSWORD="your-password"' >> ~/.bashrc
```

#### Step 4: Build and Deploy
```bash
# Build frontend
npm run build

# Make PocketBase executable
chmod +x apps/pocketbase/pocketbase

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the command it outputs
```

#### Step 5: Configure Nginx
```bash
# Copy and edit nginx config
sudo cp nginx.conf /etc/nginx/sites-available/vegamailer
sudo nano /etc/nginx/sites-available/vegamailer

# Update these lines with your domain:
# - server_name yourdomain.com www.yourdomain.com;

# Enable site
sudo ln -s /etc/nginx/sites-available/vegamailer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 6: Enable SSL
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Method 2: Hostinger VPS

See [QUICKSTART.md](QUICKSTART.md) for Hostinger-specific deployment steps.

### Method 3: Docker (Coming Soon)

Docker deployment will be added in a future update.

## ✅ Post-Deployment Verification

### Check Services
```bash
# PM2 status
pm2 status

# View logs
pm2 logs

# Check specific service
pm2 logs vegamailer-api
pm2 logs vegamailer-pocketbase
```

### Test Endpoints
```bash
# API health check
curl http://localhost:3001

# PocketBase health
curl http://localhost:8090/api/health

# Frontend (through Nginx)
curl https://yourdomain.com
```

### Test in Browser
1. Visit https://yourdomain.com
2. Try to register/login
3. Create a test campaign
4. Send a test email
5. Check analytics

## 🔒 Security Checklist

- [ ] Changed default admin credentials
- [ ] Generated unique encryption key (not dev key)
- [ ] CORS configured for production domain
- [ ] HTTPS/SSL enabled
- [ ] Firewall configured (only 80, 443, 22 open)
- [ ] Strong passwords used
- [ ] API keys secured
- [ ] Database backups configured
- [ ] Error logging configured
- [ ] Rate limiting enabled

## 💾 Backup Configuration

### Automated Backups with Cron
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/your-user/Web_Vegamailer/backup.sh
```

### Manual Backup
```bash
# Create backup directory
mkdir -p backups

# Backup database
cp -r apps/pocketbase/pb_data backups/pb_data_$(date +%Y%m%d_%H%M%S)

# Or use the backup script
./backup.sh
```

## 📊 Monitoring

### PM2 Monitoring
```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs

# Check resource usage
pm2 list
```

### Setup PM2 Plus (Optional)
```bash
# Register at pm2.io
pm2 link <secret_key> <public_key>
```

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Stop services
pm2 stop all

# Pull latest changes
git pull origin main

# Install new dependencies
npm ci --production

# Build frontend
npm run build

# Restart services
pm2 restart all
```

### Database Maintenance
```bash
# Backup before maintenance
./backup.sh

# Check database size
du -sh apps/pocketbase/pb_data

# Vacuum database (if needed)
# This is done automatically by PocketBase
```

## 🆘 Troubleshooting

### Services Won't Start
```bash
# Check PM2 logs
pm2 logs

# Check environment variables
echo $PB_ENCRYPTION_KEY | wc -c  # Should be 33

# Restart with fresh logs
pm2 delete all
pm2 start ecosystem.config.js
```

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :3001
sudo lsof -i :8090

# Kill process
sudo kill -9 <PID>
```

### Database Connection Issues
```bash
# Check PocketBase is running
pm2 logs vegamailer-pocketbase

# Verify encryption key length
echo -n "$PB_ENCRYPTION_KEY" | wc -c  # Must be exactly 32

# Check PocketBase health
curl http://localhost:8090/api/health
```

### Nginx Issues
```bash
# Test config
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

### SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

## 📈 Performance Optimization

### Enable Gzip in Nginx
Already configured in `nginx.conf`:
- Gzip compression enabled
- Static file caching configured
- Client body size limit set

### PM2 Cluster Mode (Optional)
For high traffic:
```javascript
// In ecosystem.config.js
instances: 'max',  // Use all CPU cores
exec_mode: 'cluster'
```

### Database Optimization
PocketBase handles this automatically, but you can:
- Regular backups and cleanup
- Monitor database size
- Archive old analytics data

## 📚 Additional Resources

- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Complete checklist
- [SECURITY.md](SECURITY.md) - Security best practices
- [README.md](README.md) - General documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick Hostinger deployment

## 🎯 Production vs Development

| Feature | Development | Production |
|---------|------------|------------|
| Node ENV | development | production |
| CORS Origin | localhost:3000 | yourdomain.com |
| HTTPS | No | Yes (required) |
| Encryption Key | Simple test key | Secure random key |
| API Keys | Optional/test | Real keys |
| Logging | Console | File + monitoring |
| Build | Dev server | Optimized build |
| Database | Local test data | Production data |

## ✨ Success!

If you've followed all steps, your Vegamailer instance should be:
- ✅ Running on your domain with HTTPS
- ✅ Secured with firewall and SSL
- ✅ Monitored with PM2
- ✅ Backed up automatically
- ✅ Ready for production use

Access your application:
- **Frontend**: https://yourdomain.com
- **Admin Panel**: https://yourdomain.com/hcgi/platform/_/
- **API**: https://yourdomain.com/api

**Default Login**: Use the credentials you set in `.env`

---

**Need Help?** Check our [troubleshooting section](#-troubleshooting) or open an issue on GitHub.
