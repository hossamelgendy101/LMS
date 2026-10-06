# Deployment Guide

## Docker Deployment (Recommended)

### Prerequisites
- Docker 24+
- Docker Compose 2+

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd lms-platform
```

2. **Create environment file**
```bash
cp .env.example .env
# Edit .env with production values
```

3. **Build and start**
```bash
docker-compose up -d --build
```

4. **Run migrations and seed**
```bash
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

5. **Verify**
```bash
docker-compose ps
docker-compose logs -f app
```

### Production Environment Variables

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:postgres@db:5432/lms_platform?schema=public
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
EMAIL_FROM=noreply@yourdomain.com
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=465
EMAIL_USER=resend
EMAIL_PASSWORD=<your-resend-api-key>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Manual Deployment

### Server Requirements
- Ubuntu 22.04 LTS or similar
- Node.js 20 LTS
- PostgreSQL 16
- Nginx
- PM2 (process manager)

### Steps

1. **Install dependencies**
```bash
sudo apt update
sudo apt install -y nodejs npm postgresql nginx
```

2. **Setup database**
```bash
sudo -u postgres psql -c "CREATE DATABASE lms_platform;"
sudo -u postgres psql -c "CREATE USER lms_user WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE lms_platform TO lms_user;"
```

3. **Deploy application**
```bash
git clone <repository-url>
cd lms-platform
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
```

4. **Setup PM2**
```bash
npm install -g pm2
pm2 start npm --name "lms-platform" -- start
pm2 save
pm2 startup
```

5. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **Enable SSL with Certbot**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| DIRECT_URL | Yes | Direct database URL for migrations |
| JWT_SECRET | Yes | Secret for JWT signing |
| JWT_REFRESH_SECRET | Yes | Secret for refresh tokens |
| NEXT_PUBLIC_APP_URL | Yes | Public app URL |
| EMAIL_HOST | Yes | SMTP server host |
| EMAIL_PORT | Yes | SMTP server port |
| EMAIL_USER | Yes | SMTP username |
| EMAIL_PASSWORD | Yes | SMTP password |
| STRIPE_SECRET_KEY | No | Stripe secret key |
| STRIPE_PUBLISHABLE_KEY | No | Stripe publishable key |
| STRIPE_WEBHOOK_SECRET | No | Stripe webhook secret |
| REDIS_URL | No | Redis connection URL |

## Backup Strategy

### Database Backup
```bash
# Automated daily backup
0 2 * * * pg_dump -U postgres lms_platform > /backups/lms_$(date +\%Y\%m\%d).sql
```

### File Backup
```bash
# Backup uploads directory
rsync -avz /var/www/lms-platform/public/uploads/ /backups/uploads/
```

## Monitoring

- Use PM2 for process monitoring
- Configure log rotation
- Set up alerts for high CPU/memory usage
- Monitor database connections and query performance
