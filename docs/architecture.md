# Architecture Document

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js v22.18.0
- **Framework**: Express.js v4.21.2
- **Database**: MongoDB Atlas with Mongoose ODM v8.9.5
- **Authentication**: JWT (JSON Web Tokens) v9.0.2
- **Password Hashing**: bcryptjs v2.4.3
- **Environment Management**: dotenv v16.4.7

### Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic (register, login, getMe)
│   │   └── salesController.js    # Sales CRUD and query operations
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema with password hashing
│   │   └── Sales.js              # Sales transaction schema (26 fields)
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   └── salesRoutes.js        # Sales API endpoints
│   ├── utils/
│   │   └── importData.js         # CSV data import utility
│   └── index.js                  # Express server entry point
├── .env                          # Environment variables (not committed)
├── .env.example                  # Environment template
├── .gitignore
├── package.json
└── README.md
```

### Module Responsibilities

#### 1. **config/db.js**
- Establishes MongoDB connection using Mongoose
- Handles connection errors and retry logic
- Logs connection status for debugging

#### 2. **controllers/authController.js**
- **register**: Creates new user with hashed password, returns JWT token
- **login**: Validates credentials, returns JWT token
- **getMe**: Returns current authenticated user details

#### 3. **controllers/salesController.js**
- **getSales**: Main query handler with comprehensive functionality:
  - Search across customerName and phoneNumber using regex
  - Filter by region, gender, ageRange, category, tags, paymentMethod, dateRange
  - Sort by date, quantity, or customerName (ascending/descending)
  - Paginate results with configurable limit (default: 10)
  - Returns total count for pagination calculations

#### 4. **middleware/auth.js**
- Protects routes requiring authentication
- Verifies JWT token from Authorization header
- Attaches user object to request for downstream use
- Returns 401 for invalid/missing tokens

#### 5. **models/User.js**
- Schema: name, email (unique), password (hashed)
- Pre-save hook for bcrypt password hashing (10 salt rounds)
- Method: matchPassword for credential verification
- Excludes password from JSON responses

#### 6. **models/Sales.js**
- **26 Fields**: transactionId, date, customerName, customerEmail, customerPhone, customerAddress, customerCity, customerState, customerCountry, customerZip, region, productName, productCategory, quantity, unitPrice, totalAmount, discount, tax, shippingCost, shippingType, paymentMethod, tags (Array), gender, age, returnStatus, warrantyStatus
- **Indexes**: 
  - Text index on customerName and phoneNumber for search
  - Single field indexes on commonly queried fields (date, region, category)
- **Timestamps**: Automatic createdAt and updatedAt

#### 7. **routes/**
- **authRoutes.js**: 
  - POST /register (public)
  - POST /login (public)
  - GET /me (protected)
- **salesRoutes.js**:
  - GET / (protected) - Main query endpoint with all features

#### 8. **index.js**
- Express server initialization
- Middleware setup: CORS, JSON parsing, URL encoding
- Route mounting: /api/auth, /api/sales
- Global error handler
- Database connection and server start

### API Design Patterns

#### Query Parameters for GET /api/sales
- **Search**: `?search=john` - Searches customerName and phoneNumber
- **Filters**: 
  - `?region=North,South` - Multiple regions
  - `?gender=Male,Female` - Multiple genders
  - `?category=Electronics` - Product categories
  - `?paymentMethod=Credit Card` - Payment methods
  - `?tags=Premium` - Tags (array matching)
  - `?minAge=18&maxAge=65` - Age range
  - `?startDate=2024-01-01&endDate=2024-12-31` - Date range
  - `?minTotal=100&maxTotal=1000` - Total amount range
- **Sorting**: `?sortBy=date&order=desc` - Field and direction
- **Pagination**: `?page=1&limit=10` - Page number and page size

#### Response Format
```json
{
  "success": true,
  "count": 10,
  "total": 1000,
  "page": 1,
  "totalPages": 100,
  "data": [...]
}
```

### Security Implementation

1. **Password Security**: bcrypt hashing with 10 salt rounds
2. **JWT Authentication**: 7-day expiration, signed with secret key
3. **Protected Routes**: Middleware validates token before access
4. **CORS Configuration**: Configured for specific frontend origin
5. **Input Validation**: Mongoose schema validation
6. **Error Handling**: Consistent error responses, no sensitive data exposure

---

## Frontend Architecture

### Technology Stack
- **Framework**: React 19.0.0
- **Build Tool**: Vite 6.2.3
- **Styling**: Tailwind CSS 4.0.14 with PostCSS
- **Routing**: React Router DOM 7.6.3
- **HTTP Client**: Axios 1.7.9
- **Icons**: Lucide React 0.468.0
- **State Management**: React Context API + Hooks

### Frontend Structure

```
frontend/
├── public/
│   └── truestate-logo.svg        # Application logo
├── src/
│   ├── components/
│   │   ├── FilterPanel.jsx       # Multi-select filter UI
│   │   ├── Pagination.jsx        # Pagination controls
│   │   ├── SalesTable.jsx        # Data table with sorting
│   │   ├── SearchBar.jsx         # Real-time search input
│   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   └── SummaryCards.jsx      # Statistics cards
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication state management
│   ├── pages/
│   │   ├── Dashboard.jsx         # Main application page
│   │   ├── Login.jsx             # Login form
│   │   └── Register.jsx          # Registration form
│   ├── services/
│   │   ├── api.js                # Axios instance with interceptors
│   │   ├── authService.js        # Auth API calls
│   │   └── salesService.js       # Sales API calls
│   ├── App.jsx                   # Route configuration
│   ├── index.css                 # Global styles and Tailwind imports
│   └── main.jsx                  # React app entry point
├── .env                          # Environment variables (not committed)
├── .env.example                  # Environment template
├── eslint.config.js              # ESLint configuration
├── index.html                    # HTML entry point
├── postcss.config.js             # PostCSS with Tailwind plugin
├── vite.config.js                # Vite configuration
├── vercel.json                   # Vercel deployment config
├── .gitignore
├── package.json
└── README.md
```

### Module Responsibilities

#### 1. **App.jsx**
- Route configuration using React Router
- Protected route wrapper for authenticated pages
- Navigation between Login, Register, and Dashboard

#### 2. **context/AuthContext.jsx**
- Global authentication state management
- Provides: user object, loading state, login/logout/register functions
- Token storage in localStorage
- Axios interceptor setup for automatic token inclusion
- User session restoration on app load

#### 3. **pages/Dashboard.jsx**
- **Main Application Container**: Orchestrates all dashboard features
- **State Management**:
  - Sales data array
  - Search query (debounced 300ms)
  - Filter state (region, gender, age, category, tags, payment, dateRange)
  - Sort state (sortBy, order)
  - Pagination state (currentPage, totalPages, totalRecords)
  - Loading and error states
- **Effects**:
  - Fetches sales data on mount and when dependencies change
  - Preserves filter/search/sort state during pagination
- **Child Components**: SearchBar, FilterPanel, SummaryCards, SalesTable, Pagination

#### 4. **pages/Login.jsx & Register.jsx**
- Form handling with controlled inputs
- Client-side validation
- Error message display
- Navigation after successful auth
- Calls AuthContext methods for authentication

#### 5. **components/SearchBar.jsx**
- Controlled input component
- Debounced search (300ms delay)
- Clear button functionality
- Triggers parent callback on search change

#### 6. **components/FilterPanel.jsx**
- **Seven Filter Types**:
  - Region: Checkbox group (North, South, East, West)
  - Gender: Checkbox group (Male, Female, Other)
  - Age Range: Number inputs (min/max)
  - Category: Checkbox group (Electronics, Clothing, Food, etc.)
  - Tags: Checkbox group (Premium, Sale, New, Bestseller)
  - Payment Method: Checkbox group (Credit Card, Debit Card, Cash, UPI)
  - Date Range: Date inputs (start/end)
- **State Management**: Local state with callback to parent
- **UI Features**: Collapsible sections, clear all button, apply button

#### 7. **components/SalesTable.jsx**
- Responsive table layout
- Sortable columns (click to sort)
- Sort direction indicators
- Date and currency formatting
- Loading and empty states
- Row highlighting on hover

#### 8. **components/Pagination.jsx**
- Previous/Next buttons
- Page number buttons (with ellipsis for large datasets)
- Current page highlighting
- Disabled state for first/last pages
- Total records and page information display

#### 9. **components/SummaryCards.jsx**
- Statistics display: Total Sales, Total Revenue, Average Order Value
- Real-time calculation based on current filtered data
- Currency and number formatting
- Icon-based visual design

#### 10. **components/Sidebar.jsx**
- Navigation menu
- User information display
- Logout functionality
- Active route highlighting

#### 11. **services/api.js**
- Axios instance with base URL configuration
- Request interceptor: Adds JWT token to Authorization header
- Response interceptor: Handles 401 errors (logout on auth failure)
- Centralized error handling

#### 12. **services/authService.js**
- API calls: register, login, getCurrentUser
- Token management (save/remove from localStorage)
- Returns user data and token

#### 13. **services/salesService.js**
- API call: getSales with query parameters
- Constructs URL with search, filter, sort, pagination params
- Returns formatted response with data and pagination info

### State Management Flow

```
1. User Action (e.g., search input)
   ↓
2. Component State Update (e.g., searchQuery)
   ↓
3. useEffect Trigger (dependency change)
   ↓
4. API Service Call (salesService.getSales)
   ↓
5. Axios Request (with auth token)
   ↓
6. Backend Processing
   ↓
7. Response Handling
   ↓
8. Component State Update (salesData, pagination)
   ↓
9. UI Re-render
```

### Styling Architecture

- **Tailwind CSS v4**: Utility-first CSS framework
- **PostCSS**: Build-time CSS processing
- **Global Styles**: Custom scrollbar, animations, transitions
- **Responsive Design**: Mobile-first breakpoints
- **Color Scheme**: Professional blue/gray palette
- **Components**: Reusable utility classes for consistency

---

## Data Flow

### Authentication Flow

```
Registration:
Client (Register.jsx) 
  → authService.register(name, email, password)
  → POST /api/auth/register
  → authController.register
  → User.create (with hashed password)
  → JWT token generation
  → Response: { token, user }
  → AuthContext.register
  → localStorage.setItem('token')
  → Navigate to Dashboard

Login:
Client (Login.jsx)
  → authService.login(email, password)
  → POST /api/auth/login
  → authController.login
  → User.findOne + password comparison
  → JWT token generation
  → Response: { token, user }
  → AuthContext.login
  → localStorage.setItem('token')
  → Navigate to Dashboard

Session Restoration:
App Load
  → AuthContext useEffect
  → Check localStorage for token
  → authService.getCurrentUser
  → GET /api/auth/me (with token header)
  → auth middleware verification
  → authController.getMe
  → Response: { user }
  → AuthContext.setUser
```

### Sales Data Query Flow

```
User Interaction (Search/Filter/Sort/Paginate):
Dashboard.jsx
  → State Update (search, filters, sort, page)
  → useEffect Trigger
  → salesService.getSales(params)
  → GET /api/sales?search=...&region=...&sortBy=...&page=...
  → auth middleware (verify token)
  → salesController.getSales
  → Build MongoDB Query:
      - Search: { $or: [{ customerName: regex }, { phoneNumber: regex }] }
      - Filters: { region: { $in: [...] }, gender: { $in: [...] }, ... }
      - Sort: { [sortBy]: order }
      - Pagination: skip((page-1)*limit).limit(limit)
  → Sales.find(query).sort().skip().limit()
  → Sales.countDocuments(query) [for total]
  → Response: { success, count, total, page, totalPages, data }
  → Dashboard.jsx setState
  → Re-render Components:
      - SummaryCards (calculate stats)
      - SalesTable (display data)
      - Pagination (update controls)
```

### Error Handling Flow

```
API Error:
Backend Error
  → Express error handler
  → { success: false, message: error.message }
  → HTTP status code

Client Receives Error:
Axios interceptor
  → If 401: AuthContext.logout + redirect to login
  → If other: Component error state
  → Display error message to user
```

---

## Folder Structure

### Project Root

```
Retail-Sales-Management-System/
├── backend/                      # Node.js/Express backend
├── frontend/                     # React frontend
├── docs/                         # Documentation
│   └── architecture.md           # This file
├── .editorconfig                 # Code style configuration
├── .gitignore                    # Git exclusions
└── README.md                     # Project overview and setup
```

### Backend Details

```
backend/
├── src/
│   ├── config/                   # Configuration files
│   │   └── db.js                 # Database connection
│   ├── controllers/              # Request handlers
│   │   ├── authController.js     # Auth business logic
│   │   └── salesController.js    # Sales business logic
│   ├── middleware/               # Express middleware
│   │   └── auth.js               # JWT verification
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js               # User model
│   │   └── Sales.js              # Sales model
│   ├── routes/                   # API routes
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── salesRoutes.js        # Sales endpoints
│   ├── utils/                    # Utility functions
│   │   └── importData.js         # Data import script
│   └── index.js                  # App entry point
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .gitignore                    # Backend-specific exclusions
├── package.json                  # Dependencies and scripts
└── README.md                     # Backend documentation
```

### Frontend Details

```
frontend/
├── public/                       # Static assets
│   └── truestate-logo.svg        # Logo
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── FilterPanel.jsx       # Filter interface
│   │   ├── Pagination.jsx        # Page navigation
│   │   ├── SalesTable.jsx        # Data table
│   │   ├── SearchBar.jsx         # Search input
│   │   ├── Sidebar.jsx           # Side navigation
│   │   └── SummaryCards.jsx      # Stats display
│   ├── context/                  # React Context providers
│   │   └── AuthContext.jsx       # Auth state management
│   ├── pages/                    # Page components (routes)
│   │   ├── Dashboard.jsx         # Main app page
│   │   ├── Login.jsx             # Login page
│   │   └── Register.jsx          # Registration page
│   ├── services/                 # API integration
│   │   ├── api.js                # Axios configuration
│   │   ├── authService.js        # Auth API calls
│   │   └── salesService.js       # Sales API calls
│   ├── App.jsx                   # Route definitions
│   ├── index.css                 # Global styles
│   └── main.jsx                  # App entry point
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── eslint.config.js              # Linting rules
├── index.html                    # HTML template
├── postcss.config.js             # PostCSS configuration
├── vite.config.js                # Vite build configuration
├── vercel.json                   # Deployment configuration
├── .gitignore                    # Frontend-specific exclusions
├── package.json                  # Dependencies and scripts
└── README.md                     # Frontend documentation
```

---

## Key Design Decisions

### 1. **MERN Stack Choice**
- **MongoDB**: Flexible schema for diverse sales data, excellent query performance with indexes
- **Express**: Lightweight, unopinionated framework ideal for RESTful APIs
- **React**: Component-based architecture perfect for interactive dashboards
- **Node.js**: JavaScript throughout the stack, efficient I/O for real-time operations

### 2. **Authentication Strategy**
- **JWT**: Stateless authentication, scales horizontally, mobile-friendly
- **localStorage**: Simple client-side storage, persists across sessions
- **7-day expiration**: Balance between security and user convenience

### 3. **State Management**
- **Context API**: Sufficient for this application size, no extra dependencies
- **Local State**: Component-specific state for better performance
- **No Redux**: Overkill for current requirements, can add later if needed

### 4. **Database Indexing**
- **Text indexes**: Enable fast full-text search on customer fields
- **Single field indexes**: Optimize common filter queries
- **Trade-off**: Slightly slower writes for much faster reads (acceptable for read-heavy app)

### 5. **API Design**
- **RESTful**: Standard HTTP methods, intuitive resource naming
- **Query parameters**: Flexible filtering without POST body on GET requests
- **Consistent responses**: Same structure for success/error aids error handling

### 6. **Frontend Architecture**
- **Vite**: Extremely fast dev server and optimized builds
- **Tailwind CSS v4**: Utility-first approach speeds development, minimal bundle size
- **Component composition**: Small, focused components for reusability and testing

### 7. **Security Measures**
- **Password hashing**: bcrypt with 10 rounds balances security and performance
- **JWT signing**: Secret key ensures token integrity
- **CORS**: Restricts API access to authorized origins
- **Auth middleware**: Centralized protection for all sensitive routes

---

## Performance Optimizations

### Backend
1. **Database Indexes**: Fast queries on commonly filtered fields
2. **Pagination**: Limits data transfer and processing
3. **Mongoose Lean**: Returns plain JavaScript objects for faster responses
4. **Connection Pooling**: MongoDB maintains connection pool for efficiency

### Frontend
1. **Debounced Search**: Reduces API calls (300ms delay)
2. **Vite HMR**: Instant updates during development
3. **Code Splitting**: React Router enables route-based splitting
4. **Tailwind Purging**: Removes unused CSS in production
5. **Memoization**: React.memo on expensive components (can be added)

### Network
1. **Axios Interceptors**: Automatic token handling reduces code duplication
2. **Error Handling**: Centralized error responses reduce payload size
3. **Compression**: Can be added with Express compression middleware

---

## Scalability Considerations

### Current Scale (1000 records)
- **Performance**: Excellent, sub-second query times
- **Memory**: Low footprint, efficient data structures

### Future Scale (100,000+ records)
- **Database**: MongoDB Atlas auto-scaling handles growth
- **Indexes**: Already in place for major query paths
- **Pagination**: Essential for large datasets, already implemented
- **Caching**: Can add Redis for frequently accessed data
- **Load Balancing**: Can deploy multiple backend instances behind load balancer

### Horizontal Scaling
- **Stateless API**: JWT enables easy horizontal scaling
- **Database**: MongoDB replica sets for read scaling
- **Frontend**: Static files on CDN (Vercel handles this)

---

## Testing Strategy (Future Implementation)

### Backend Testing
- **Unit Tests**: Jest for individual functions
- **Integration Tests**: Supertest for API endpoints
- **Database Tests**: MongoDB Memory Server for isolated testing

### Frontend Testing
- **Unit Tests**: Vitest for component logic
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright or Cypress for user flows

---

## Deployment Architecture

### Current Setup
- **Frontend**: Vercel (automatic deployments from Git)
- **Backend**: Render (free tier with auto-sleep)
- **Database**: MongoDB Atlas (512MB free tier)

### Production Recommendations
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: AWS EC2, DigitalOcean, or Heroku
- **Database**: MongoDB Atlas (dedicated cluster)
- **Monitoring**: Sentry for error tracking, LogRocket for session replay
- **CI/CD**: GitHub Actions for automated testing and deployment

---

## Maintenance and Monitoring

### Current Capabilities
- **Logging**: Console logs for development
- **Error Handling**: Centralized error responses

### Production Additions
- **Logging**: Winston or Pino for structured logs
- **Monitoring**: PM2 for process management, Prometheus for metrics
- **Alerts**: PagerDuty or similar for critical issues
- **Backups**: MongoDB Atlas automated backups
- **Security Scanning**: npm audit, Snyk for vulnerabilities

---

## Future Enhancements

### Short Term
1. Data export (CSV, PDF)
2. Advanced analytics dashboard
3. Bulk operations
4. User roles and permissions

### Long Term
1. Real-time updates (WebSockets)
2. Machine learning for sales predictions
3. Mobile application (React Native)
4. Multi-tenant support
5. Internationalization (i18n)

---

This architecture document provides a comprehensive overview of the Retail Sales Management System, detailing both backend and frontend implementations, data flow patterns, folder structures, and module responsibilities. The system is designed for scalability, maintainability, and excellent user experience.
