# Production Deployment Checklist

Use this checklist to ensure your Vegamailer deployment is production-ready.

## 📋 Pre-Deployment

### Environment Configuration
- [ ] Copy `apps/api/.env.production` to `apps/api/.env`
- [ ] Update `CORS_ORIGIN` with your actual domain
- [ ] Update `WEBSITE_DOMAIN` with your actual domain
- [ ] Change `PB_SUPERUSER_EMAIL` to your admin email
- [ ] Change `PB_SUPERUSER_PASSWORD` to a strong password
- [ ] Add your `PLUNK_API_KEY` for email sending
- [ ] Add your `RESEND_API_KEY` for email sending

### PocketBase Environment Variables
Generate a secure 32-character encryption key:
```powershell
# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

```bash
# Linux/Mac
openssl rand -hex 16
```

Then set:
- [ ] `PB_ENCRYPTION_KEY` (exactly 32 characters)
- [ ] `PB_SUPERUSER_EMAIL` (your admin email)
- [ ] `PB_SUPERUSER_PASSWORD` (strong password)

### Security
- [ ] Generated strong encryption key (NOT the dev key)
- [ ] Changed default admin credentials
- [ ] Reviewed CORS settings
- [ ] Enabled HTTPS/SSL
- [ ] Configured firewall rules
- [ ] Set up environment variable security

### Code Quality
- [ ] Run linter: `npm run lint`
- [ ] Fix all lint errors and warnings
- [ ] Remove all console.log statements
- [ ] Remove debug code
- [ ] Test all features locally

### Build
- [ ] Build frontend: `npm run build`
- [ ] Verify build output in `dist/apps/web/`
- [ ] Test production build locally

## 🚀 Deployment Steps

### For VPS/Server Deployment

1. **Prepare Server**
   - [ ] Install Node.js v20.19.1 or higher
   - [ ] Install PM2: `npm install -g pm2`
   - [ ] Install Nginx (optional, for reverse proxy)
   - [ ] Configure firewall (allow ports 80, 443)

2. **Deploy Code**
   ```bash
   # On server
   git clone https://github.com/Os-Healthcarepro-lab/Web_Vegamailer.git
   cd Web_Vegamailer
   npm install
   ```

3. **Configure Environment**
   ```bash
   # Copy and edit .env file
   cp apps/api/.env.production apps/api/.env
   nano apps/api/.env
   
   # Set PocketBase environment variables
   export PB_ENCRYPTION_KEY="your-32-char-key-here"
   export PB_SUPERUSER_EMAIL="admin@yourdomain.com"
   export PB_SUPERUSER_PASSWORD="your-secure-password"
   ```

4. **Build Frontend**
   ```bash
   npm run build
   ```

5. **Make PocketBase Executable**
   ```bash
   chmod +x apps/pocketbase/pocketbase
   ```

6. **Start Services with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx** (Optional but recommended)
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/vegamailer
   sudo nano /etc/nginx/sites-available/vegamailer
   # Update domain names
   sudo ln -s /etc/nginx/sites-available/vegamailer /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

8. **Enable SSL/HTTPS**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

### For Hostinger VPS

Follow the detailed steps in [QUICKSTART.md](QUICKSTART.md)

## ✅ Post-Deployment Verification

### Service Health
- [ ] Check PM2 status: `pm2 status`
- [ ] View logs: `pm2 logs`
- [ ] Check API: `curl http://localhost:3001`
- [ ] Check PocketBase: `curl http://localhost:8090/api/health`
- [ ] Access frontend: Visit your domain

### Security Checks
- [ ] HTTPS is working
- [ ] Firewall is configured
- [ ] Only necessary ports are open
- [ ] Admin credentials work
- [ ] CORS is properly configured

### Functionality Tests
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads
- [ ] Campaign creation works
- [ ] Email sending works
- [ ] Analytics tracking works

## 🔄 Ongoing Maintenance

### Regular Tasks
- [ ] Set up automated backups: `crontab -e`
  ```bash
  # Daily backup at 2 AM
  0 2 * * * /path/to/backup-script.sh
  ```
- [ ] Monitor logs: `pm2 logs`
- [ ] Update dependencies: `npm audit` and `npm update`
- [ ] Monitor server resources
- [ ] Review security advisories

### Backup Strategy
- [ ] Database backups (daily)
- [ ] File backups (weekly)
- [ ] Off-site backup storage
- [ ] Test restore procedure

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error tracking
- [ ] Set up performance monitoring
- [ ] Configure alerts for downtime

## 📝 Environment Variables Reference

### Production .env File
```env
# API Configuration
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# PocketBase
WEBSITE_DOMAIN=yourdomain.com
PB_SUPERUSER_EMAIL=admin@yourdomain.com
PB_SUPERUSER_PASSWORD=strong-password-here

# Email Services
PLUNK_API_KEY=your_plunk_key
RESEND_API_KEY=your_resend_key
```

### System Environment Variables
```bash
export PB_ENCRYPTION_KEY="your-32-character-encryption-key"
export PB_SUPERUSER_EMAIL="admin@yourdomain.com"
export PB_SUPERUSER_PASSWORD="strong-password-here"
```

## 🆘 Troubleshooting

### Services Won't Start
```bash
# Check PM2 logs
pm2 logs

# Restart services
pm2 restart all

# Check ports
netstat -tulpn | grep -E '3001|8090'
```

### Database Issues
```bash
# Check PocketBase logs
pm2 logs vegamailer-pocketbase

# Verify encryption key
echo $PB_ENCRYPTION_KEY | wc -c  # Should be 33 (32 + newline)
```

### Build Errors
```bash
# Clear and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## 📚 Additional Resources

- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide
- [QUICKSTART.md](QUICKSTART.md) - Quick Hostinger deployment
- [SECURITY.md](SECURITY.md) - Security best practices
- [README.md](README.md) - General documentation

---

**Status**: Ready for deployment once all checkboxes are completed!
