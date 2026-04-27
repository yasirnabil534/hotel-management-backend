# Vercel Branch Configuration

## Branch Setup

This project uses a dedicated `vercel-deploy` branch for production deployments on Vercel.

### Branch Structure
```
main/developer  ← Development branch (default)
    ↓
vercel-deploy  ← Production branch (deployed to Vercel)
```

## How to Configure in Vercel

### During Initial Setup
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository
3. Before deploying, click "Configure Project"
4. Under "Git" settings, set:
   - **Production Branch**: `vercel-deploy`
5. Add environment variables
6. Deploy

### For Existing Projects
1. Go to your project dashboard in Vercel
2. Navigate to **Settings** → **Git**
3. Under "Production Branch", change from `main` to `vercel-deploy`
4. Save changes
5. Next push to `vercel-deploy` will trigger a production deployment

## Deployment Workflow

### Option 1: Direct Updates to vercel-deploy
```bash
# Switch to vercel-deploy branch
git checkout vercel-deploy

# Make your changes or merge from developer
git merge developer

# Push to trigger deployment
git push origin vercel-deploy
```

### Option 2: Automated via Pull Request
1. Create a PR from `developer` to `vercel-deploy`
2. Review changes
3. Merge PR
4. Vercel automatically deploys

### Option 3: Manual Deploy via CLI
```bash
# Switch to branch
git checkout vercel-deploy

# Deploy
vercel --prod
```

## Preview Deployments

Vercel creates preview deployments for all branches:
- Push to any branch → Preview deployment
- Push to `vercel-deploy` → Production deployment

## Branch Protection (Recommended)

Consider adding branch protection rules on GitHub:
1. Go to Repository Settings → Branches
2. Add rule for `vercel-deploy`
3. Enable:
   - Require pull request reviews
   - Require status checks (tests) to pass
   - Prevent force pushes

## Continuous Deployment

With this setup, your workflow becomes:
1. Develop on `developer` or feature branches
2. Test locally
3. Merge to `vercel-deploy` when ready for production
4. Vercel automatically deploys

## Rollback

To rollback a deployment:
1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "Promote to Production"

Or via git:
```bash
git checkout vercel-deploy
git reset --hard <commit-hash>
git push --force origin vercel-deploy
```

## Environment-Specific Variables

You can set different environment variables for:
- **Production** (vercel-deploy branch)
- **Preview** (other branches)
- **Development** (local)

Configure in: Vercel Dashboard → Settings → Environment Variables

---

For more details, see:
- `VERCEL_DEPLOY.md` - Quick start guide
- `DEPLOYMENT.md` - Comprehensive deployment guide
