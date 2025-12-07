# Backend - Retail Sales Management System

## Overview

Backend API for the Retail Sales Management System built with Node.js, Express, and MongoDB.

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Setup Instructions

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure environment variables:
   Create a `.env` file with:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Import CSV data (one-time):

```bash
npm run import-data
```

4. Start the server:

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (protected)

### Sales

- GET `/api/sales` - Get all sales with filters, search, sort, pagination (protected)
- GET `/api/sales/filters` - Get available filter options (protected)
- GET `/api/sales/:id` - Get single sale by ID (protected)

## Query Parameters for GET /api/sales

- `search` - Search by customer name or phone number
- `customerRegion` - Filter by region (comma-separated)
- `gender` - Filter by gender (comma-separated)
- `minAge`, `maxAge` - Filter by age range
- `productCategory` - Filter by category (comma-separated)
- `tags` - Filter by tags (comma-separated)
- `paymentMethod` - Filter by payment method (comma-separated)
- `startDate`, `endDate` - Filter by date range
- `sortBy` - Sort results (date-desc, date-asc, quantity-desc, quantity-asc, name-asc, name-desc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
