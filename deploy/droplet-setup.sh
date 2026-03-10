#!/usr/bin/env bash
set -euo pipefail

# Snaplify Droplet Setup Script
# Usage: bash droplet-setup.sh
# Requires: Ubuntu 22.04+, root access

SNAPLIFY_USER="snaplify"
APP_DIR="/opt/snaplify"

# Preflight checks
if [[ $EUID -ne 0 ]]; then
  echo "ERROR: This script must be run as root" >&2
  exit 1
fi

if [[ ! -f /etc/os-release ]]; then
  echo "ERROR: Cannot detect OS. Ubuntu 22.04+ required." >&2
  exit 1
fi

echo "==> Installing Docker..."
apt-get update -qq
apt-get install -y -qq ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -qq
apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "==> Installing Certbot..."
apt-get install -y -qq certbot python3-certbot-nginx

echo "==> Installing Nginx..."
apt-get install -y -qq nginx

echo "==> Creating system user..."
id -u "$SNAPLIFY_USER" &>/dev/null || useradd --system --create-home --shell /usr/sbin/nologin "$SNAPLIFY_USER"
usermod -aG docker "$SNAPLIFY_USER"

echo "==> Setting up application directory..."
mkdir -p "$APP_DIR"
chown "$SNAPLIFY_USER":"$SNAPLIFY_USER" "$APP_DIR"

echo "==> Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "==> Creating systemd service..."
cat > /etc/systemd/system/snaplify.service << 'UNIT'
[Unit]
Description=Snaplify Application
After=docker.service
Requires=docker.service

[Service]
Type=forking
User=snaplify
WorkingDirectory=/opt/snaplify
ExecStart=/usr/bin/docker compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.prod.yml down

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable snaplify.service

echo "==> Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Copy docker-compose.prod.yml and .env to $APP_DIR"
echo "  2. Copy nginx.conf to /etc/nginx/sites-available/snaplify"
echo "  3. ln -s /etc/nginx/sites-available/snaplify /etc/nginx/sites-enabled/"
echo "  4. certbot --nginx -d your-domain.com"
echo "  5. systemctl start snaplify"
