# CareerBridge - Employment and Career Development Platform

**Connecting Talent to Opportunity.**

CareerBridge is a comprehensive employment and career development platform designed for Rwanda, connecting students, graduates, job seekers, employers, and administrators through a modern, secure, and scalable web application.

## 🎯 Project Overview

CareerBridge aims to:
- Connect Rwandan students and graduates with employment opportunities
- Help employers find qualified candidates efficiently
- Simplify the internship and job application process
- Provide a centralized platform for discovering opportunities
- Enable applicants to track their applications
- Help organizations manage recruitment activities
- Provide access to professional training and career development resources
- Reduce difficulties associated with finding reliable job advertisements
- Improve communication between employers and applicants

## 📋 Features

### For Students & Graduates
- Create professional profiles with CV management
- Search and filter job opportunities
- Save and track applications
- Receive personalized notifications
- Access career development resources
- Message employers

### For Employers
- Post job opportunities and internships
- Manage applications and candidates
- Shortlist and track candidates
- Communicate with applicants
- View recruitment analytics
- Organization verification

### For Administrators
- User management and moderation
- Opportunity moderation and approval
- Employer verification workflow
- Analytics and reporting
- Category and content management
- Platform activity monitoring

## 🏗️ Technology Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- React Hook Form for forms
- Zod for validation
- Recharts for analytics
- Lucide React for icons

### Backend
- Node.js with Express.js
- Prisma ORM
- MySQL 8.0+
- JWT authentication
- bcrypt for password hashing
- Multer for file uploads
- Helmet for security
- CORS for cross-origin requests

## 📁 Project Structure

```
careerbridge/
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── layouts/           # Layout components
│   │   ├── pages/             # Page components
│   │   │   ├── public/
│   │   │   ├── student/
│   │   │   ├── employer/
│   │   │   └── admin/
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API services
│   │   ├── context/           # React context
│   │   ├── routes/            # Route configuration
│   │   ├── utils/             # Utility functions
│   │   ├── validations/       # Form validation schemas
│   │   ├── constants/         # Constants and enums
│   │   └── App.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Express middleware
│   │   ├── validators/        # Request validators
│   │   ├── utils/             # Utility functions
│   │   └── app.js            # Express app setup
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/        # Database migrations
│   ├── tests/                 # Test files
│   ├── server.js             # Entry point
│   └── package.json
│
├── CAREERBRIDGE_ANALYSIS.md   # System analysis document
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MySQL 8.0+
- Git

### Installation

#### 1. Clone the Repository
```bash
cd C:\xampp\htdocs\PROJECTS\CAREER BRIDGE
```

#### 2. Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure .env with your database and email settings
# DATABASE_URL=mysql://user:password@localhost:3306/careerbridge
# JWT_SECRET=your_secret_key_here
# etc.

# Run database migrations
npm run prisma:migrate

# Seed initial data (optional)
npm run prisma:seed

# Start development server
npm run dev
```

Backend runs on `http://localhost:5000`

#### 3. Setup Frontend

```bash
cd ../client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📚 Available Scripts

### Backend
```bash
npm run dev              # Start development server with auto-reload
npm start                # Start production server
npm run build            # Build for production
npm test                 # Run tests
npm run lint             # Lint code
npm run prisma:studio   # Open Prisma Studio
npm run prisma:migrate  # Run migrations
```

### Frontend
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Lint code
```

## 🔐 Security Features

- Secure password hashing with bcrypt
- JWT-based authentication
- HTTPS ready (production)
- CORS configuration
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- SQL injection prevention (ORM)
- XSS protection
- Secure headers with Helmet
- File upload validation
- Authorization checks on all protected routes
- Activity logging for sensitive operations

## 📊 Database

CareerBridge uses a normalized relational MySQL database with:
- 25+ tables with proper relationships
- Primary and foreign keys for referential integrity
- Indexes on frequently queried columns
- Enum types for status and role fields
- Cascading deletes for data consistency

Key tables:
- Users, Student Profiles, Organizations
- Opportunities, Applications, Application Status History
- Skills, Education, Work Experience, Certifications
- Messages, Conversations, Notifications
- Career Resources, Reports, Activity Logs

See `CAREERBRIDGE_ANALYSIS.md` for detailed database schema.

## 🎨 UI/UX Design

The platform features:
- Modern professional interface
- Responsive design for all devices
- Consistent color scheme (Navy Blue, Teal, Professional Blue)
- Intuitive navigation
- Clear call-to-action buttons
- Loading states and error handling
- Toast notifications
- Empty states
- Professional dashboards

## 📈 Development Phases

### Phase 1: Planning & Analysis ✅
- Requirements analysis
- System architecture
- Database design
- API specifications

### Phase 2: Project Setup ✅
- Initialize projects
- Configure development environment
- Set up database
- Basic structure

### Phase 3: Database Development
- Create migrations
- Seed initial data
- Test database operations

### Phase 4: UI/UX Development
- Build homepage
- Create reusable components
- Build dashboards
- Make responsive

### Phase 5: Backend API Development
- Authentication system
- Profile management
- Opportunity management
- Application workflow
- Admin features

### Phase 6: Frontend & Backend Integration
- Connect pages to APIs
- Implement workflows
- State management

### Phase 7: Testing & Security
- Unit and integration tests
- Security review
- Performance optimization
- Bug fixes

### Phase 8: Deployment
- Production configuration
- Deploy frontend and backend
- Database configuration

## 🧪 Testing

The project includes tests for:
- Authentication flow
- API endpoints
- Database operations
- Authorization checks
- Validation rules

Run tests with:
```bash
npm test
```

## 📖 API Documentation

API endpoints are organized by module:

- **Authentication**: `/api/auth/*`
- **Students**: `/api/students/*`
- **Opportunities**: `/api/opportunities/*`
- **Applications**: `/api/applications/*`
- **Employers**: `/api/employers/*`
- **Messages**: `/api/messages/*`
- **Notifications**: `/api/notifications/*`
- **Admin**: `/api/admin/*`
- **Resources**: `/api/resources/*`

See complete API documentation in the backend code comments and Swagger docs (when available).

## 🌍 Rwanda-Specific Features

- Default currency: Rwandan Franc (RWF)
- Country code: +250
- Location selection by province and district
- Support for local organization types
- Privacy policy aligned with local regulations
- Mobile-optimized for all device sizes
- Architecture ready for Kinyarwanda and French translations

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=mysql://user:password@localhost:3306/careerbridge
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=noreply@careerbridge.rw
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=CareerBridge
VITE_APP_VERSION=1.0.0
```

## 🚢 Deployment

### Frontend
- Deploy to Vercel or Netlify
- Build: `npm run build`
- Output: `dist` folder

### Backend
- Deploy to Render or similar service
- Database: AWS RDS or managed MySQL hosting
- Environment variables configured in deployment platform

See deployment guides in documentation folder.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests for new features
4. Commit with clear messages
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For issues and questions:
- Check the documentation in `CAREERBRIDGE_ANALYSIS.md`
- Review the API documentation
- Check existing GitHub issues
- Contact the development team

## 🎓 Development Team

CareerBridge was designed and developed as a comprehensive platform following best practices in:
- Software architecture
- Database design
- Security
- User experience
- Performance optimization

---

**Status**: Phase 2 - Project Setup Complete ✅

Next Phase: Phase 3 - Database Development

**Last Updated**: November 16, 2026
