import crypto from 'crypto';

export function generateDNSRecords(domain, businessId) {
  // Generate a unique selector for DKIM
  const selector = `plunk_${Date.now()}`;
  
  // Generate a random DKIM private key (simplified - in production use proper key generation)
  const dkimPrivateKey = crypto.randomBytes(32).toString('base64');
  const dkimPublicKey = crypto.randomBytes(32).toString('base64');

  // SPF Record
  const spfRecord = `v=spf1 include:plunk.io ~all`;

  // DKIM Record (public key part)
  const dkimRecord = `${selector}._domainkey.${domain} IN TXT "v=DKIM1; k=rsa; p=${dkimPublicKey}"`;

  // CNAME Record for tracking
  const cnameRecord = `track.${domain} IN CNAME plunk.io`;

  return {
    spfRecord,
    dkimRecord,
    cnameRecord,
    selector,
    dkimPrivateKey, // Store this securely in production
  };
}