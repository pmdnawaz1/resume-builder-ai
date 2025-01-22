# Resume Builder App

A modern, AI-powered resume builder application built with Next.js, MongoDB, and Tailwind CSS.

## Features

- Dynamic form-based resume creation
- Upload and parse existing resumes (PDF/Word)
- AI-powered resume enhancements using Gemini AI
- Save and manage multiple resumes
- PDF download functionality
- Multiple resume templates
- Responsive design with Tailwind CSS
- User authentication with NextAuth.js

## Prerequisites

- Node.js 18.x or later
- MongoDB running locally or a MongoDB Atlas account
- Google Cloud Platform account (for Gemini AI)
- Google OAuth credentials (for authentication)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd resume-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables in `.env`:
     - `MONGODB_URI`: Your MongoDB connection string
     - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
     - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
     - `NEXTAUTH_SECRET`: Generate a random string for session encryption
     - `GEMINI_API_KEY`: Your Google Gemini AI API key

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - React components
- `/lib` - Utility functions and database connection
- `/public` - Static assets
- `/styles` - Global styles and Tailwind CSS configuration

## API Routes

- `POST /api/resumes` - Create a new resume
- `GET /api/resumes` - Get all resumes for the current user
- `PUT /api/resumes/:id` - Update a resume
- `DELETE /api/resumes/:id` - Delete a resume

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
