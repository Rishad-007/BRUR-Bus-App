# Deployment Guide for BRUR Bus Schedule App

## Deploying to Render

### Step 1: Prepare Your Repository
1. Push your code to a GitHub repository
2. Make sure all files are committed and pushed

### Step 2: Connect to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" and select "Static Site"
3. Connect your GitHub account and select your repository

### Step 3: Configure Build Settings
- **Name**: `brur-bus-schedule` (or your preferred name)
- **Branch**: `main` (or your default branch)
- **Build Command**: `pnpm install && pnpm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18 (or higher)

### Step 4: Deploy
1. Click "Create Static Site"
2. Render will automatically build and deploy your app
3. Your app will be available at `https://your-app-name.onrender.com`

### Step 5: Custom Domain (Optional)
1. Go to your site settings in Render
2. Add your custom domain in the "Custom Domains" section
3. Follow the DNS configuration instructions

## Environment Variables
No environment variables are required for this static site.

## Build Optimization
The app is already optimized for production with:
- Minified CSS and JavaScript
- Optimized images and assets
- Gzip compression enabled
- Mobile-first responsive design

## Monitoring
- Render provides basic analytics and monitoring
- Check the "Logs" tab for any build or runtime issues
- Monitor performance through Render's dashboard

## Updates
To update your deployed app:
1. Make changes to your code
2. Commit and push to your repository
3. Render will automatically rebuild and redeploy

## Troubleshooting
- If build fails, check the build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify the build command and publish directory are correct
- Check that all file paths are correct (case-sensitive)
