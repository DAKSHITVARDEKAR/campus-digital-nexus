
# College System Backend API

This is the backend API for the Automated Paperless Transparent College System, providing RESTful endpoints for various features including authentication, elections, facility booking, applications, and more.

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database (or use Prisma with another supported database)
- npm or yarn

### Installation

1. Install dependencies
```
npm install
```

2. Set up environment variables
Create a `.env` file with the following variables:
```
DATABASE_URL="postgresql://username:password@localhost:5432/college_system"
JWT_SECRET="your-secret-key"
PORT=5000
NODE_ENV=development
```

3. Initialize the database
```
npx prisma migrate dev --name init
```

4. Start the development server
```
npm run dev
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user and get JWT token
- `GET /api/auth/profile` - Get current user profile

### Election System

- `GET /api/elections` - Get all elections
- `GET /api/elections/:id` - Get a specific election
- `POST /api/elections` - Create a new election (Admin only)
- `PUT /api/elections/:id` - Update an election
- `DELETE /api/elections/:id` - Delete an election (Admin only)

- `GET /api/elections/:electionId/candidates` - Get candidates for an election
- `POST /api/candidates` - Submit a candidate application
- `PATCH /api/candidates/:id/approve` - Approve a candidate (Admin/Faculty)
- `PATCH /api/candidates/:id/reject` - Reject a candidate (Admin/Faculty)

- `POST /api/votes` - Cast a vote
- `GET /api/elections/:electionId/results` - Get election results
- `GET /api/elections/:electionId/has-voted` - Check if current user has voted

## Role-Based Access Control

The API implements strict RBAC with the following roles:

- **Student**: Can view public information, submit applications, vote in elections
- **Faculty**: Can review and approve/reject candidate applications, view more detailed information
- **Admin**: Full access to create, manage, and delete resources

## Accessibility Support

The API is designed with accessibility in mind:

- Clear, descriptive error messages
- Human-readable status descriptions for screen readers
- Consistent data structures for frontend rendering
- Support for image alt text and descriptions
- Date formatting options for better understanding

## File Upload

The system supports file uploads for:
- Candidate profile images
- (More features to be implemented)

Files are stored securely with appropriate validation and access controls.
