# Nginx Server Configuration

Server-level nginx configuration for EverSaid staging and production.

## Architecture

```
Internet → Cloudflare → Server Nginx (host) → Docker containers
                              │
                              ├── staging.eversaid.ai → localhost:4000/9001
                              └── eversaid.ai → localhost:3000/8001
```

## Files

- `eversaid-server.conf` - Nginx config for the host server (not Docker)

## Installation

```bash
# Copy to nginx sites
sudo cp eversaid-server.conf /etc/nginx/sites-available/eversaid.conf

# Enable site
sudo ln -s /etc/nginx/sites-available/eversaid.conf /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t && sudo systemctl reload nginx
```

## SSL Certificate Setup (one-time)

### 1. Create Cloudflare Origin Certificate

1. Cloudflare Dashboard → Your Domain → SSL/TLS → Origin Server
2. Click "Create Certificate"
3. Settings:
   - Private key type: RSA (2048)
   - Hostnames: `*.eversaid.ai, eversaid.ai`
   - Validity: 15 years
4. Copy the certificate and private key

### 2. Install on server

```bash
# Create directory
sudo mkdir -p /etc/ssl/cloudflare
sudo chmod 700 /etc/ssl/cloudflare

# Create certificate file
sudo nano /etc/ssl/cloudflare/cert.pem
# Paste the certificate, save

# Create private key file
sudo nano /etc/ssl/cloudflare/key.pem
# Paste the private key, save

# Set permissions
sudo chmod 644 /etc/ssl/cloudflare/cert.pem
sudo chmod 600 /etc/ssl/cloudflare/key.pem
```

### 3. Configure Cloudflare

1. SSL/TLS → Overview → Set mode to **Full (strict)**
2. DNS → Add A record for `staging.eversaid.ai` pointing to server IP

### 4. Configure Cloudflare Access (staging protection)

1. Zero Trust → Access → Applications
2. Add application: `staging.eversaid.ai`
3. Add policy: Allow specific emails

## Firewall

Allow inbound:
- TCP 80 (HTTP redirect)
- TCP 443 (HTTPS)