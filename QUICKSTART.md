# 🚀 Hostinger Deployment Quick Start

## What You Need

- ✅ Hostinger VPS or Cloud Hosting (NOT shared hosting)
- ✅ Domain name pointed to your server IP
- ✅ SSH access credentials

---

## Deployment in 10 Commands

### On Your Local Machine

```bash
# 1. Build the frontend
npm run deploy

# 2. Commit your code (if using Git)
git add .
git commit -m "Ready for production"
git push origin main
```

### On Your Hostinger VPS (via SSH)

```bash
# 3. Install Node.js 20.19.1
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20.19.1
nvm use 20.19.1

# 4. Install PM2
npm install -g pm2

# 5. Clone your code
cd /home
git clone <your-repo-url> vegamailer
cd vegamailer

# 6. Install dependencies
npm install

# 7. Build
npm run build

# 8. Configure environment
nano apps/api/.env
# Update CORS_ORIGIN to your domain and add your API keys

# 9. Set up Nginx
cp nginx.conf /etc/nginx/sites-available/vegamailer
# Edit the file to replace "yourdomain.com" with your actual domain
nano /etc/nginx/sites-available/vegamailer
ln -s /etc/nginx/sites-available/vegamailer /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# 10. Start services
chmod +x apps/pocketbase/pocketbase
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Enable HTTPS (Bonus Step)

```bash
apt-get install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Check If It's Working

```bash
# Check services status
pm2 status

# View logs
pm2 logs

# Check if frontend is built
ls -la dist/apps/web

# Test API endpoint
curl http://localhost:3001

# Test PocketBase
curl http://localhost:8090/_/
```

---

## Common Issues

### "Port already in use"
```bash
# Find what's using the port
lsof -i :3001
# Kill it
kill -9 <PID>
```

### "Permission denied" for PocketBase
```bash
chmod +x apps/pocketbase/pocketbase
```

### Nginx not working
```bash
nginx -t
tail -f /var/log/nginx/error.log
```

### Services crash on startup
```bash
pm2 logs --err
```

---

## Post-Deployment

### Update your app later
```bash
cd /home/vegamailer
git pull
npm install
npm run build
pm2 restart all
```

### Monitor performance
```bash
pm2 monit
htop
```

### Check disk space
```bash
df -h
```

---

## 🎯 Your App Should Be Live At:

- **Frontend**: https://yourdomain.com
- **API**: https://yourdomain.com/api
- **PocketBase Admin**: https://yourdomain.com/pb/_/

---

## Need More Details?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide.

---

**🎉 That's it! Your Vegamailer is now live on Hostinger!**
