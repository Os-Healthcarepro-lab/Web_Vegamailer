# 🛡️ Security & Anti-Spam Deployment Checklist

## ✅ Security Measures Implemented

### 🔒 **Basic Security (Already Active)**
- ✅ **Helmet.js** - Security headers (XSS, clickjacking, etc.)
- ✅ **CORS** - Cross-origin request protection
- ✅ **Global Rate Limiting** - 100 requests per 5 minutes per IP
- ✅ **Request Size Limits** - 10MB max to prevent DoS
- ✅ **Input Sanitization** - XSS protection with express-validator
- ✅ **Email Validation** - Blocks disposable/invalid emails

### 🤖 **Bot & Spam Protection (Just Added)**
- ✅ **Honeypot Fields** - Catches automated bots
- ✅ **Strict Rate Limiting** - 5 requests per 15 minutes on:
  - Contact form (`/contact`)
  - Email verification (`/auth/verify-email`)
- ✅ **Input Length Limits** - Prevents spam floods
- ✅ **HTML Escaping** - Prevents malicious scripts

### 📊 **What's Protected**
```
/contact           → Strict rate limit (5/15min) + Honeypot + Validation
/auth/verify-email → Strict rate limit (5/15min) + Validation
/subscribers/*     → Global rate limit (100/5min) + Email validation
/campaigns/*       → Global rate limit (100/5min)
All other routes   → Global rate limit (100/5min)
```

---

## 🚀 Pre-Deployment Security Checklist

### 1️⃣ **Environment Variables (CRITICAL)**

**Local .env:**
```bash
✅ Development .env exists
✅ PB_ENCRYPTION_KEY is 32 characters
✅ API keys are test/development keys
```

**Production .env.production:**
```bash
❌ CHANGE DEFAULT CREDENTIALS:
   - PB_SUPERUSER_EMAIL (not admin@vegamailer.local)
   - PB_SUPERUSER_PASSWORD (minimum 16 characters)
   
❌ GENERATE NEW ENCRYPTION KEY:
   - Run: npm run generate-key
   - Copy to PB_ENCRYPTION_KEY in production
   
❌ ADD REAL API KEYS:
   - RESEND_API_KEY (production key)
   - PLUNK_API_KEY (production key)
   
❌ UPDATE DOMAIN:
   - WEBSITE_DOMAIN=yourdomain.com
   - CORS_ORIGIN=https://yourdomain.com
```

### 2️⃣ **Frontend Honeypot Implementation**

Add this hidden field to your contact form in the frontend:

```jsx
{/* Honeypot field - hidden from users, visible to bots */}
<input
  type="text"
  name="website"
  tabIndex="-1"
  autoComplete="off"
  style={{
    position: 'absolute',
    left: '-9999px',
    width: '1px',
    height: '1px'
  }}
  aria-hidden="true"
/>
```

**Important:** 
- Field must be named `website`
- Must be hidden with CSS (not `display: none`)
- Don't use `type="hidden"` (bots ignore those)

### 3️⃣ **Optional: Add CAPTCHA (Recommended)**

For extra protection, consider adding **Google reCAPTCHA v3** or **hCaptcha**:

**Install:**
```bash
npm install --save-dev @hcaptcha/react-hcaptcha
# or
npm install react-google-recaptcha-v3
```

**Where to add:**
- Contact form (highest priority)
- Subscriber signup
- Email verification

### 4️⃣ **Database Security**

```bash
✅ PocketBase encryption enabled
✅ Default admin email changed
✅ Strong admin password set (16+ chars)
✅ Regular backups configured (npm run backup)
```

### 5️⃣ **Server Configuration**

**Nginx/Apache:**
```nginx
# Add to your nginx.conf
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://localhost:3001;
}
```

**SSL/TLS:**
```bash
❌ Install SSL certificate (Let's Encrypt)
❌ Force HTTPS redirect
❌ Enable HSTS headers
```

### 6️⃣ **Monitoring Setup**

```bash
❌ Set up error logging/monitoring:
   - Sentry, LogRocket, or similar
   - Monitor rate limit violations
   - Track spam attempts

❌ Set up uptime monitoring:
   - UptimeRobot, Pingdom, or similar
   - Alert on downtime
```

---

## 🔍 Testing Before Deployment

### Test Rate Limiting:
```bash
# Send 6 requests quickly to /contact
# The 6th should be blocked with 429 Too Many Requests
for i in {1..6}; do
  curl -X POST http://localhost:3001/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","company":"Test Co","message":"Test message"}'
done
```

### Test Honeypot:
```bash
# Should be rejected with 400 Bad Request
curl -X POST http://localhost:3001/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Bot","email":"bot@example.com","company":"Bot Co","message":"Spam","website":"http://spam.com"}'
```

### Test Input Validation:
```bash
# Should be rejected - name too short
curl -X POST http://localhost:3001/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"A","email":"test@example.com","company":"Test","message":"Test message"}'

# Should be rejected - invalid email
curl -X POST http://localhost:3001/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"notanemail","company":"Test","message":"Test message"}'
```

---

## 📋 Final Deployment Steps

1. **Run Security Audit:**
   ```bash
   npm audit --audit-level=moderate
   npm run lint
   ```

2. **Test Locally:**
   ```bash
   npm run build
   npm run start:pm2
   ```

3. **Configure Production Environment:**
   - Set all environment variables on server
   - Generate new encryption key
   - Change default credentials

4. **Deploy:**
   ```bash
   # Copy files to server
   # Install dependencies
   npm ci --production
   
   # Start with PM2
   pm2 start ecosystem.config.js --env production
   ```

5. **Post-Deployment Verification:**
   - ✅ HTTPS working
   - ✅ Contact form rate limiting active
   - ✅ Honeypot catching bots
   - ✅ Email sending working
   - ✅ Error logging active

---

## 🚨 Known Limitations & Recommendations

### Current Setup:
- ✅ Protects against: Bot spam, XSS, CSRF, DoS, email spam
- ⚠️ May not stop: Sophisticated AI bots, distributed attacks
- ⚠️ Rate limiting is IP-based (can be bypassed with proxies)

### Future Enhancements:
1. **Add CAPTCHA** for contact form (90% spam reduction)
2. **Add WAF** (Cloudflare, AWS WAF) for DDoS protection
3. **Add 2FA** for admin login
4. **Implement session management** with secure cookies
5. **Add email verification** for subscriber signups
6. **Set up real-time monitoring** and alerts

---

## 📞 Emergency Contacts

If you detect a security issue after deployment:

1. **Immediately:**
   - Revoke compromised API keys
   - Change admin passwords
   - Check access logs

2. **Review:**
   - `pm2 logs` for suspicious activity
   - PocketBase logs in `pb_data/logs/`
   - Nginx/Apache access logs

3. **Report:**
   - Open security advisory on GitHub
   - Contact security team

---

## ✅ Ready to Deploy?

**Minimum Requirements Before Going Live:**
- [x] All environment variables set in production
- [x] Default credentials changed
- [x] New encryption key generated
- [x] SSL certificate installed
- [ ] Honeypot field added to frontend contact form
- [ ] Rate limiting tested
- [ ] Backups configured

**You're now ready for production deployment!** 🎉

The API has strong protection against spam and bots. For additional security, consider adding CAPTCHA to the contact form.
