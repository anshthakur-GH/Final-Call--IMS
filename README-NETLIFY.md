# Deploying Inventory Management System to Netlify

## Important Notes

This application is a full-stack Node.js application with MySQL database. Netlify primarily supports static sites and serverless functions, not traditional server applications with databases.

## Deployment Options

1. **Static Frontend with Serverless Functions**:
   - The current setup includes a basic static frontend
   - API functionality is partially implemented through Netlify Functions
   - Database connectivity will require additional configuration

2. **Database Configuration**:
   - The application currently uses a local MySQL database
   - For production deployment, you'll need to use a cloud database service like:
     - Amazon RDS
     - PlanetScale
     - Railway
     - Supabase

3. **Environment Variables**:
   - You'll need to configure the following environment variables in Netlify:
     - DB_HOST
     - DB_USER
     - DB_PASSWORD
     - DB_DATABASE
     - SESSION_SECRET

## Deployment Steps

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `public`
3. Add the required environment variables
4. Deploy your site

## Alternative Deployment Options

For a full-stack Node.js application with MySQL, consider:
- Render
- Railway
- Heroku
- DigitalOcean App Platform

These platforms better support server-side applications with databases.
