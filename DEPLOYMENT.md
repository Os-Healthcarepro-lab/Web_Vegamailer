# Vegamailer Deployment Guide for Hostinger

## Prerequisites

### Required Hostinger Plan
- **VPS Hosting** or **Cloud Hosting** (Shared hosting won't work due to Node.js and PocketBase requirements)
- Minimum: 2GB RAM, 2 CPU cores
- SSH access enabled

### System Requirements
- Node.js 20.19.1 (set via Hostinger Node.js Selector or nvm)
- PM2 or similar process manager (recommended)
- Git (for deployment)

---

## Deployment Steps

### 1. Connect to Your Hostinger VPS via SSH

```bash
ssh root@your-vps-ip
```

### 2. Install Node.js 20.19.1

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js 20.19.1
nvm install 20.19.1
nvm use 20.19.1
nvm alias default 20.19.1
```

### 3. Install PM2 (Process Manager)

```bash
npm install -g pm2
```

### 4. Clone Your Repository

```bash
cd /home
git clone <your-repository-url> vegamailer
cd vegamailer
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Build the Frontend

```bash
npm run build
```

This creates production files in `dist/apps/web`

### 7. Configure Environment Variables

Edit the API environment file:

```bash
nano apps/api/.env
```

Update these values:
```env
PORT=3001
CORS_ORIGIN=https://yourdomain.com
NODE_ENV=production
RESEND_API_KEY=your_actual_resend_api_key
```

### 8. Set Up PocketBase

Make PocketBase executable:

```bash
chmod +x apps/pocketbase/pocketbase
```

### 9. Configure Nginx for Frontend

Create Nginx config:

```bash
nano /etc/nginx/sites-available/vegamailer
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /home/vegamailer/dist/apps/web;
        try_files $uri $uri/ /index.html;
        
        # Caching for static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # PocketBase Admin (optional - secure this!)
    location /pb/ {
        proxy_pass http://127.0.0.1:8090/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/vegamailer /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 10. Start Services with PM2

Create PM2 ecosystem file:

```bash
nano ecosystem.config.js
```

Add this content:

```javascript
module.exports = {
  apps: [
    {
      name: 'vegamailer-api',
      cwd: '/home/vegamailer/apps/api',
      script: 'src/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    },
    {
      name: 'vegamailer-pocketbase',
      cwd: '/home/vegamailer/apps/pocketbase',
      script: './pocketbase',
      args: 'serve --http=127.0.0.1:8090',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M'
    }
  ]
};
```

Start the services:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 11. Set Up SSL Certificate (HTTPS)

```bash
# Install Certbot
apt-get update
apt-get install certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Post-Deployment

### Check Service Status

```bash
pm2 status
pm2 logs vegamailer-api
pm2 logs vegamailer-pocketbase
```

### Monitor Logs

```bash
pm2 logs
```

### Restart Services

```bash
pm2 restart all
```

### Update Deployment

```bash
cd /home/vegamailer
git pull
npm install
npm run build
pm2 restart all
```

---

## Firewall Configuration

If UFW is enabled:

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

---

## Security Checklist

- [ ] Change default SSH port
- [ ] Disable root SSH login
- [ ] Set up fail2ban
- [ ] Restrict PocketBase admin access (IP whitelist or separate subdomain with auth)
- [ ] Use strong API keys
- [ ] Enable CORS only for your domain
- [ ] Regular backups of `apps/pocketbase/pb_data`
- [ ] Keep Node.js and system packages updated

---

## Backup Script

Create a backup script:

```bash
nano backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/backups/vegamailer"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup PocketBase data
tar -czf $BACKUP_DIR/pb_data_$DATE.tar.gz /home/vegamailer/apps/pocketbase/pb_data

# Keep only last 7 days
find $BACKUP_DIR -name "pb_data_*.tar.gz" -mtime +7 -delete

echo "Backup completed: pb_data_$DATE.tar.gz"
```

Make it executable and add to cron:

```bash
chmod +x backup.sh
crontab -e
```

Add daily backup at 2 AM:
```
0 2 * * * /home/vegamailer/backup.sh
```

---

## Troubleshooting

### Services not starting?
```bash
pm2 logs
journalctl -xe
```

### Port already in use?
```bash
lsof -i :3001
lsof -i :8090
```

### Nginx errors?
```bash
nginx -t
tail -f /var/log/nginx/error.log
```

---

## Performance Optimization

1. **Enable Nginx Gzip Compression** (already in config)
2. **Use CDN** for static assets (Cloudflare)
3. **Database Optimization**: Regular PocketBase backups and cleanup
4. **Monitor Resources**: `htop`, `pm2 monit`

---

## Support

For issues, check:
- PM2 logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- Application logs in your API

---

**Deployment Complete! 🚀**

Your app should now be live at:
- Frontend: https://yourdomain.com
- API: https://yourdomain.com/api
- PocketBase Admin: https://yourdomain.com/pb/_/ (secure this!)
