# Eldermate Backend

This is the backend API for the Eldermate application, providing endpoints for user authentication and mood tracking functionality.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/eldermate
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=90d
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- **POST /api/users/signup** - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user" // Optional: default is "user"
  }
  ```

- **POST /api/users/login** - Login a user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **GET /api/users/me** - Get current user profile (requires authentication)

### Mood Tracking

- **POST /api/moods** - Create a new mood entry (requires authentication)
  ```json
  {
    "mood": "Happy", // Must be one of: Happy, Okay, Sad, Worried
    "notes": "Had a great day today!"
  }
  ```

- **GET /api/moods** - Get all mood entries for the current user (requires authentication)

- **GET /api/moods/:id** - Get a specific mood entry (requires authentication)

- **PATCH /api/moods/:id** - Update a mood entry (requires authentication)
  ```json
  {
    "mood": "Okay",
    "notes": "Updated notes"
  }
  ```

- **DELETE /api/moods/:id** - Delete a mood entry (requires authentication)

- **GET /api/moods/stats** - Get mood statistics (requires authentication)

- **GET /api/moods/trends** - Get mood trends (requires authentication)
  - Optional query parameter: `days` (default: 30)

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

## Error Handling

The API returns appropriate status codes and error messages in the following format:

```json
{
  "status": "fail",
  "message": "Error message"
}
```

## Models

### User

- name: String (required)
- email: String (required, unique)
- password: String (required, min length: 8)
- role: String (enum: ['user', 'caregiver', 'admin'], default: 'user')

### Mood

- user: ObjectId (reference to User)
- mood: String (enum: ['Happy', 'Okay', 'Sad', 'Worried'])
- notes: String
- aiResponse: String
- date: Date (default: current date/time)