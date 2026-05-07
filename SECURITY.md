# Security Policy

## 🔒 Reporting a Vulnerability

We take the security of Vegamailer seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do Not** Open a Public Issue

Please do not open a public GitHub issue for security vulnerabilities.

### 2. Report Privately

Send details to the maintainers via:
- Create a private security advisory on GitHub
- Or email the details with "SECURITY" in the subject line

### 3. Include Details

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## 🛡️ Security Best Practices

### For Development

1. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` for templates
   - Keep API keys secure

2. **Dependencies**
   - Regularly update dependencies
   - Run `npm audit` periodically
   - Review security advisories

3. **Authentication**
   - Change default credentials
   - Use strong passwords
   - Enable 2FA when available

### For Production

1. **Encryption**
   - Use a strong 32-character encryption key
   - Never reuse development keys in production
   - Store keys securely (environment variables, secrets manager)

2. **Database**
   - Regular backups
   - Restrict database access
   - Use encryption at rest

3. **API Keys**
   - Rotate keys regularly
   - Use separate keys for dev/staging/prod
   - Monitor API usage

4. **Network Security**
   - Use HTTPS/SSL certificates
   - Configure CORS properly
   - Implement rate limiting
   - Use firewall rules

5. **Updates**
   - Keep Node.js updated
   - Update PocketBase regularly
   - Apply security patches promptly

## 🔍 Known Security Considerations

### Default Credentials

The default development credentials are:
- Email: `admin@vegamailer.local`
- Password: `admin123456`

**⚠️ Change these immediately in production!**

### PocketBase Encryption

PocketBase requires a 32-character encryption key:
- Development: Can use simple key
- Production: Must use cryptographically secure random key

Generate a secure key:
```powershell
# PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### CORS Configuration

Update `CORS_ORIGIN` in production to your actual domain:
```env
# Development
CORS_ORIGIN=http://localhost:3000

# Production
CORS_ORIGIN=https://yourdomain.com
```

### Rate Limiting

The API includes rate limiting. Configure in `apps/api/src/middleware/global-rate-limit.js`

## 📋 Security Checklist for Production

Before deploying:

- [ ] Changed default admin credentials
- [ ] Generated secure encryption key (32 chars)
- [ ] Configured CORS for production domain
- [ ] Set up HTTPS/SSL certificates
- [ ] Configured firewall rules
- [ ] Set up database backups
- [ ] Reviewed and secured API keys
- [ ] Enabled rate limiting
- [ ] Updated all dependencies
- [ ] Removed debug/console logs
- [ ] Set `NODE_ENV=production`
- [ ] Configured monitoring/logging
- [ ] Set up error tracking

## 🔄 Update Policy

We aim to:
- Address critical vulnerabilities within 24-48 hours
- Release security patches as needed
- Keep dependencies up to date
- Notify users of security updates

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [PocketBase Security](https://pocketbase.io/docs/)

## ✅ Responsible Disclosure

We appreciate responsible disclosure and will:
- Acknowledge your report within 48 hours
- Keep you updated on the fix progress
- Credit you (if desired) once the issue is resolved
- Work with you to understand and address the issue

Thank you for helping keep Vegamailer secure! 🙏
