# SnapTrip

Live Link :- https://snaptrip-1.onrender.com

A comprehensive travel and accommodation booking platform.

## Features

- User authentication and profile management
- Accommodation listing creation and management
- Category-based browsing and search
- Review and rating system
- Contact forms and feedback collection
- Newsletter subscription
- RESTful API for integration

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/snaptrip.git
   cd snaptrip
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration:**
   - Create a `.env` file in the root directory
   - Add the following environment variables:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/snaptrip
     SESSION_SECRET=your-secret-key-here
     CLOUDINARY_CLOUD_NAME=your-cloudinary-name
     CLOUDINARY_KEY=your-cloudinary-key
     CLOUDINARY_SECRET=your-cloudinary-secret
     ```

4. **Database Setup:**
   - Ensure MongoDB is running locally or update the connection string
   - Run database initialization (optional):
     ```bash
     node init/index.js
     ```

5. **Start the application:**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

## Configuration

### Cloud Storage
The application uses Cloudinary for image uploads. Configure your Cloudinary credentials in the `.env` file as shown above.

### File Uploads
- Uploads are stored in the `uploads/` directory by default
- Configure multer settings in `multerDiskConfig.js`
- Maximum file size: 5MB (configurable)

### Session Management
- Uses express-session for session management
- Session secret should be a strong, unique string
- Sessions are stored in memory by default (consider using Redis for production)

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

#### Register User
```
POST /api/users/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "securepassword123"
}
```

#### Login User
```
POST /api/users/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "securepassword123"
}
```

#### Logout User
```
POST /api/users/logout
```

### Listings

#### Get All Listings
```
GET /api/listings
```

#### Get Single Listing
```
GET /api/listings/:id
```

#### Create Listing
```
POST /api/listings
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form fields:
- title: String
- description: String
- price: Number
- location: String
- images: File[]
```

#### Update Listing
```
PUT /api/listings/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 150
}
```

#### Delete Listing
```
DELETE /api/listings/:id
Authorization: Bearer <token>
```

### Categories

#### Get All Categories
```
GET /api/categories
```

#### Get Category by ID
```
GET /api/categories/:id
```

#### Create Category
```
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Beachfront",
  "description": "Properties near the beach"
}
```

### Reviews

#### Get Reviews for Listing
```
GET /api/listings/:id/reviews
```

#### Create Review
```
POST /api/listings/:id/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great place to stay!"
}
```

#### Delete Review
```
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

### Response Examples

#### Successful Response
```json
{
  "success": true,
  "data": {
    "id": "60d5ec9f8b3a8b2a3c4e8b3a",
    "title": "Cozy Beach House",
    "price": 120,
    "location": "Miami, FL"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Listing not found",
  "status": 404
}
```

### Authentication
All API requests that require authentication must include the Authorization header with a valid JWT token:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## API Usage Examples

### Using cURL

**Get all listings:**
```bash
curl -X GET http://localhost:3000/api/listings
```

**Create a listing:**
```bash
curl -X POST http://localhost:3000/api/listings \
  -H "Authorization: Bearer <token>" \
  -F "title=Beautiful Apartment" \
  -F "description=Spacious 2-bedroom apartment" \
  -F "price=100" \
  -F "location=New York" \
  -F "images=@/path/to/image.jpg"
```

### Using JavaScript (Fetch API)

**Login and get token:**
```javascript
const login = async () => {
  const response = await fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'testuser',
      password: 'securepassword123'
    })
  });
  
  const data = await response.json();
  return data.token;
};
```

**Get all listings:**
```javascript
const getListings = async (token) => {
  const response = await fetch('http://localhost:3000/api/listings', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};
```

## API Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Project Structure

```
.
├── controllers/          # Route controllers
├── models/               # MongoDB models
├── routes/               # Express routes
├── views/                # EJS templates
├── public/               # Static assets
├── uploads/              # User uploads
├── init/                 # Database initialization
├── utils/                # Utility functions
├── middleware.js         # Custom middleware
└── app.js                # Main application file
```

## Technologies

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** Passport.js, JWT
- **Templates:** EJS
- **File Uploads:** Multer
- **Cloud Storage:** Cloudinary
- **Styling:** CSS, JavaScript
- **API:** RESTful architecture

## Development

- **Linting:** ESLint (configure in package.json)
- **Testing:** Add your preferred testing framework
- **Debugging:** Use VSCode debug configuration
- **API Testing:** Postman, Insomnia, or cURL

## Deployment

For production deployment:
1. Set `NODE_ENV=production` in environment variables
2. Configure proper session storage (Redis recommended)
3. Set up proper security headers
4. Configure HTTPS
5. Set up process management (PM2 recommended)
6. Configure API rate limiting
7. Set up proper logging and monitoring

## Contributing

Contributions are welcome! Please follow these guidelines:
- Fork the repository
- Create a feature branch
- Submit a pull request
- Follow existing code style
- Write tests for new features
- Update documentation as needed
