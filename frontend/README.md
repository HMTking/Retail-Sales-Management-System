# Frontend - Retail Sales Management System

## Overview

Frontend application for the Retail Sales Management System built with React, Vite, and Tailwind CSS.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React (icons)

## Setup Instructions

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Configure environment variables:
   Create a `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

For production (Vercel):

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

3. Start development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Features

### Authentication

- User registration
- User login
- Protected routes
- JWT token management

### Dashboard

- Real-time search (Customer Name, Phone Number)
- Multi-select filters (Region, Gender, Category, Tags, Payment Method)
- Age range filter
- Date range filter
- Sorting (Date, Quantity, Customer Name)
- Pagination (10 items per page)
- Summary cards (Total Units Sold, Total Amount, Total Discount)
- Responsive design

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `VITE_API_URL`
4. Deploy

The `vercel.json` configuration handles SPA routing.
