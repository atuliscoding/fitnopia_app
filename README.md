# Fitnopia - Personalized Fitness Web Application

A modern, adaptive fitness application built with Next.js, TypeScript, and PostgreSQL.

## Features

- 🔐 Secure authentication with Google OAuth and email/password
- 💪 Personalized workout plans based on user preferences
- 📊 Progress tracking and analytics
- 🎥 Exercise video demonstrations
- 📱 Responsive design and offline support
- ⚡ Real-time workout interface

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript and App Router
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: Zustand
- **Styling**: Tailwind CSS + Headless UI
- **Media Delivery**: Cloudflare CDN
- **Rate Limiting**: Upstash Redis

## Prerequisites

- Node.js 18+
- PostgreSQL
- Redis (via Upstash)
- Google OAuth credentials
- Cloudflare account (for CDN)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fitnopia"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Rate Limiting
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"

# Media CDN
CLOUDFLARE_ACCOUNT_ID="your-cloudflare-account-id"
CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fitnopia.git
   cd fitnopia
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
fitnopia/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── ...               # Other app routes
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## Security Features

- CSRF protection
- Rate limiting
- Secure session management
- Input validation
- GDPR compliance
- AES-256 encryption for sensitive data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 