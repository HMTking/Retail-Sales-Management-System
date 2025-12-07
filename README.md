# Retail Sales Management System

## Overview

A full-stack MERN application for managing retail sales data with advanced search, filtering, sorting, and pagination capabilities. The system provides real-time data analysis with an intuitive dashboard interface for tracking sales transactions. Built with MongoDB for scalable data storage, Express.js for robust API endpoints, React for dynamic user interfaces, and Node.js for server-side processing.

## Tech Stack

### Frontend
- React 19 with Vite
- Tailwind CSS for styling
- Axios for API communication
- React Router DOM for routing
- Lucide React for icons

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- csv-parser for data import

## Search Implementation Summary

Full-text search implemented using MongoDB text indexes on `customerName` and `phoneNumber` fields. The search is case-insensitive and uses regex pattern matching with the `$or` operator to search across multiple fields simultaneously. Real-time search triggers API calls as the user types (debounced at 300ms), providing instant feedback. The backend controller constructs dynamic MongoDB queries using `$regex` with the `i` flag for case-insensitive matching, ensuring efficient retrieval even with large datasets.

## Filter Implementation Summary

Multi-select filters support independent and combined filtering on seven different criteria:

- **Customer Region** (multi-select checkbox) - Uses `$in` operator
- **Gender** (multi-select checkbox) - Uses `$in` operator
- **Age Range** (min-max numeric input) - Uses `$gte` and `$lte` operators
- **Product Category** (multi-select checkbox) - Uses `$in` operator
- **Tags** (multi-select checkbox) - Uses `$in` operator for array fields
- **Payment Method** (multi-select checkbox) - Uses `$in` operator
- **Date Range** (start-end date picker) - Uses `$gte` and `$lte` operators

Filters are implemented using MongoDB's `$in` operator for array matching and range operators (`$gte`, `$lte`) for numeric/date ranges. All filter states are preserved during pagination and sorting operations through React state management. The backend dynamically constructs query objects based on provided filter parameters, allowing filters to work independently or in combination.

## Sorting Implementation Summary

Sorting supports six options across three primary fields with ascending/descending capabilities:

- **Date** (Newest First / Oldest First) - Default: Newest First
- **Quantity** (High to Low / Low to High)
- **Customer Name** (A-Z / Z-A)

Implemented using MongoDB's `sort()` method with dynamic field and order parameters. The frontend sends `sortBy` (field name) and `order` (asc/desc) query parameters to the backend. Default sorting is by date in descending order (newest first). Sorting is preserved across filter changes and pagination, ensuring consistent data presentation throughout user interactions.

## Pagination Implementation Summary

Pagination displays 10 records per page with full navigation controls:

- **Page Navigation**: Previous, Next, and direct page number buttons
- **State Preservation**: Current page maintained during search, filter, and sort operations
- **Efficient Querying**: Uses MongoDB's `skip()` and `limit()` methods
- **Total Count**: Displays total records and page information

Backend calculates pagination using `skip` (page - 1) * limit and `limit` parameters. The API returns both paginated data and total count for accurate page calculation. Frontend manages page state using React hooks and updates the URL query parameters for bookmarkable results. Navigation controls disable appropriately when on first/last pages.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas account (or local MongoDB instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. (Optional) Import sample data:
```bash
node src/utils/importData.js
```

5. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend application will run on `http://localhost:5173`

### Access the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Register a new account or login with existing credentials
3. Access the dashboard to view and manage sales data

### API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/sales` - Get sales data with search, filter, sort, and pagination (protected)
