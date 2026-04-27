# Vercel Deployment - Quick Start

## 🚀 Quick Deploy Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Deploy to Vercel

#### Via Vercel Dashboard (Easiest)
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables:
   - `DATABASE_URL` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret
   - `ENCRYPTION_KEY` - Your encryption key
5. Click Deploy!

#### Via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. Set Environment Variables in Vercel

Go to your project settings → Environment Variables and add:

```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/hotel-management
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-32-character-secret-key
```

### 4. Update MongoDB Access

In MongoDB Atlas:
- Network Access → Add IP: `0.0.0.0/0` (Allow all)
- Or add Vercel's specific IP ranges

## 📝 What Changed for Vercel?

✅ Created `/api/index.ts` - Serverless function entry point
✅ Added `vercel.json` - Vercel configuration
✅ Added `.vercelignore` - Files to exclude from deployment
✅ Updated `package.json` - Added `vercel-build` script
✅ Updated `tsconfig.json` - Include api folder
✅ Updated Prisma schema - Added binary targets for Vercel
✅ Added Express adapter - Required for Vercel serverless

## 🔄 Local Development

Your local development remains unchanged:

```bash
npm run start:dev  # Still uses Fastify
```

## 🌐 After Deployment

Your API will be available at:
```
https://your-project.vercel.app
```

Swagger docs:
```
https://your-project.vercel.app/api
```

## ⚠️ Important Notes

1. **First request may be slow** - Serverless cold start
2. **Free tier limits**: 10s function timeout
3. **Database connections**: Use connection pooling for better performance
4. **CORS**: Already configured to allow all origins

## 📚 Documentation

- Full guide: See `DEPLOYMENT.md`
- [Vercel Docs](https://vercel.com/docs)
- [NestJS Docs](https://docs.nestjs.com)

## 🐛 Troubleshooting

**Build fails?**
- Check build logs in Vercel dashboard
- Run `npm run vercel-build` locally first

**Database connection error?**
- Verify `DATABASE_URL` in Vercel environment variables
- Check MongoDB Atlas network access

**API not responding?**
- Check function logs in Vercel dashboard
- Verify all environment variables are set

---

Need help? Check the detailed `DEPLOYMENT.md` guide!
