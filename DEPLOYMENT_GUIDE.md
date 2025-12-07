# Deployment Configuration Guide

## Deployment URLs

- **Frontend (Vercel)**: https://retail-sales-management-system-seven.vercel.app/
- **Backend (Render)**: https://retail-sales-management-system-2.onrender.com

## Configuration Changes Made

### Backend Configuration

#### 1. Updated `.env` file

- Changed `NODE_ENV` to `production`
- Updated `FRONTEND_URL` to Vercel deployment URL
- MongoDB connection remains the same

#### 2. Enhanced CORS Configuration (`src/index.js`)

- Added support for multiple origins (local + production)
- Allows both local development and production frontend URLs
- Configured proper CORS headers for cross-origin requests
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Credentials enabled for authentication

### Frontend Configuration

#### 1. Updated `.env` file

- Changed `VITE_API_URL` to point to Render backend

#### 2. Created `.env.production`

- Production-specific environment variables
- Points to Render backend URL

#### 3. Created `.env.local`

- Local development environment variables
- Points to localhost backend

## Vercel Deployment Steps

### Frontend (Already configured)

1. **Push code to GitHub**

   ```bash
   git add .
   git commit -m "Update deployment configuration"
   git push origin main
   ```

2. **Vercel will auto-deploy** from your GitHub repository

3. **Set Environment Variables in Vercel Dashboard**:

   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://retail-sales-management-system-2.onrender.com/api`

4. **Redeploy** after adding environment variables

## Render Deployment Steps

### Backend

1. **Push code to GitHub**

   ```bash
   git add .
   git commit -m "Update deployment configuration"
   git push origin main
   ```

2. **Set Environment Variables in Render Dashboard**:

   - `NODE_ENV` = `production`
   - `PORT` = `5000` (or leave empty, Render assigns automatically)
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = Your secret key (generate a strong one)
   - `JWT_EXPIRE` = `7d`
   - `FRONTEND_URL` = `https://retail-sales-management-system-seven.vercel.app`

3. **Build Command**: `npm install`
4. **Start Command**: `npm start`

## Testing Connectivity

### Test Backend Health

```bash
curl https://retail-sales-management-system-2.onrender.com/api/health
```

Expected Response:

```json
{
  "success": true,
  "message": "Server is running"
}
```

### Test Frontend

Visit: https://retail-sales-management-system-seven.vercel.app/

## CORS Configuration

The backend now accepts requests from:

- `http://localhost:5173` (local development)
- `https://retail-sales-management-system-seven.vercel.app` (production)
- Any URL set in `FRONTEND_URL` environment variable

## Local Development

To run locally with development settings:

1. **Create `.env.local` in frontend** (already created):

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

2. **Update backend `.env` for local dev**:

   ```env
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start servers**:

   ```bash
   # Backend
   cd backend && npm run dev

   # Frontend
   cd frontend && npm run dev
   ```

## Troubleshooting

### CORS Issues

- Ensure `FRONTEND_URL` in backend `.env` matches your Vercel URL exactly
- Check browser console for specific CORS errors
- Verify Render backend is running and accessible

### API Connection Issues

- Verify `VITE_API_URL` in frontend environment variables
- Check Render backend logs for errors
- Ensure MongoDB connection string is correct

### Authentication Issues

- Verify JWT_SECRET is set on Render
- Check that credentials are enabled in CORS configuration
- Ensure cookies/localStorage are not blocked

## Post-Deployment Checklist

- [ ] Backend deployed on Render with correct environment variables
- [ ] Frontend deployed on Vercel with correct environment variables
- [ ] Backend health endpoint responding
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] API calls from frontend to backend succeed
- [ ] MongoDB connection is stable
- [ ] CORS is properly configured

## Current Status

✅ **Local servers running with production configuration**

- Backend: http://localhost:5000 (Production mode)
- Frontend: http://localhost:5173 (Using production API URL)
- MongoDB: Connected successfully

✅ **Configuration files updated**

- Backend CORS supports both local and production URLs
- Frontend configured to use Render backend
- Environment files created for different environments

## Next Steps

1. Commit and push changes to GitHub
2. Verify Render backend redeploys automatically
3. Verify Vercel frontend redeploys automatically
4. Test the live application end-to-end
5. Monitor logs on both platforms for any issues
