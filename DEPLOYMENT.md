# Deployment Guide for Vercel

## Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Your MongoDB Atlas database accessible from anywhere (or Vercel IPs)
- Git repository (GitHub, GitLab, or Bitbucket)

## Setup Steps

### 1. Install Vercel CLI (Optional but recommended)
```bash
npm install -g vercel
```

### 2. Install Express dependency
```bash
npm install express
```

### 3. Configure Environment Variables on Vercel

You need to add these environment variables in your Vercel project settings:

- `DATABASE_URL` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret key
- `ENCRYPTION_KEY` - Your encryption key
- `PORT` - Set to 3000 (optional, as Vercel manages this)

**To add environment variables:**
1. Go to your project in Vercel Dashboard
2. Click on "Settings"
3. Click on "Environment Variables"
4. Add each variable for Production, Preview, and Development

### 4. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended for first deployment)
1. Go to https://vercel.com/new
2. Import your Git repository
3. **Important**: Configure the production branch
   - After importing, go to Settings → Git
   - Change Production Branch to `vercel-deploy`
4. Vercel will automatically detect the configuration
5. Add your environment variables
6. Click "Deploy"

#### Option B: Deploy via CLI
```bash
# Login to Vercel
vercel login

# Switch to vercel-deploy branch
git checkout vercel-deploy

# Deploy to production
vercel --prod
```

### 5. Configure MongoDB Access

Make sure your MongoDB Atlas allows connections from Vercel:
1. Go to MongoDB Atlas Dashboard
2. Navigate to "Network Access"
3. Add IP Address: `0.0.0.0/0` (Allow from anywhere) or add Vercel's IP ranges

## Project Structure

```
.
├── api/
│   └── index.ts          # Vercel serverless function entry point
├── src/
│   └── main.ts           # Original NestJS entry point (for local dev)
├── vercel.json           # Vercel configuration
└── .vercelignore         # Files to ignore during deployment
```

## Important Notes

1. **Local Development**: Continue using `npm run start:dev` for local development with Fastify
2. **Production**: Vercel deployment uses Express adapter for serverless compatibility
3. **Cold Starts**: First request after inactivity may be slower (serverless nature)
4. **Function Timeout**: Free tier has 10s execution limit, Pro has 60s
5. **Database Connection Pooling**: Consider using Prisma Data Proxy or MongoDB Atlas connection pooling for better performance

## Testing Your Deployment

After deployment, test your API:
```bash
# Replace YOUR_DEPLOYMENT_URL with your actual Vercel URL
curl https://YOUR_DEPLOYMENT_URL.vercel.app/api

# Check Swagger docs
open https://YOUR_DEPLOYMENT_URL.vercel.app/api
```

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `dependencies` not `devDependencies`
- Run `npm run vercel-build` locally to test

### Database Connection Errors
- Verify DATABASE_URL is correct in Vercel environment variables
- Check MongoDB Atlas network access settings
- Ensure connection string includes database name

### Function Timeout
- Optimize database queries
- Consider upgrading to Vercel Pro for longer timeout
- Review slow endpoints and optimize them

## Performance Optimization

1. **Enable Prisma Binary Targets** (already configured)
2. **Use Connection Pooling**: Consider Prisma Accelerate or PgBouncer equivalent for MongoDB
3. **Implement Caching**: Use Redis or Vercel KV for frequently accessed data
4. **Monitor Performance**: Use Vercel Analytics and Speed Insights

## Cost Considerations

**Vercel Free Tier Includes:**
- 100 GB bandwidth per month
- Serverless function executions
- Automatic HTTPS
- Preview deployments

**Upgrade to Pro if you need:**
- Higher bandwidth
- Longer function execution time
- More team members
- Priority support

## Next Steps

1. Set up custom domain in Vercel Dashboard
2. Configure CI/CD for automatic deployments
3. Set up monitoring and logging
4. Implement rate limiting for API endpoints
5. Add Vercel Analytics for insights

---

For more information, visit:
- [Vercel Documentation](https://vercel.com/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
