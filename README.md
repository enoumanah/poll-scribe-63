# PollCreator - Complete React Polling Application

A production-ready polling application built with React, TypeScript, Tailwind CSS, and Framer Motion. Create polls, collect votes, and visualize results with beautiful animations and responsive design.

## 🚀 Features

- **Authentication System**: Secure login/register with JWT tokens
- **Poll Management**: Create, view, edit, and delete polls
- **Real-time Voting**: Interactive voting interface with instant results
- **Privacy Controls**: Public polls and private polls with shareable links
- **Beautiful UI**: Responsive design with dark/light mode toggle
- **Smooth Animations**: Framer Motion animations throughout the app
- **Toast Notifications**: User feedback with React Toastify
- **Production Ready**: Optimized for deployment on Vercel

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: React Context + hooks
- **Icons**: Heroicons
- **Notifications**: React Toastify
- **Backend Integration**: REST API integration
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd poll-creator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your API URL:
   ```
   VITE_API_URL=https://poll-api-7doi.onrender.com/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/ui/          # Reusable UI components
│   ├── Navigation.tsx      # Main navigation bar
│   └── ProtectedRoute.tsx  # Route protection wrapper
├── contexts/              # React contexts
│   ├── AuthContext.tsx    # Authentication state
│   └── ThemeContext.tsx   # Dark/light theme
├── pages/                 # Main application pages
│   ├── Landing.tsx        # Homepage with hero section
│   ├── Login.tsx          # Authentication page
│   ├── Dashboard.tsx      # User's polls overview
│   ├── CreatePoll.tsx     # Poll creation form
│   ├── PollView.tsx       # Poll voting & results
│   ├── Privacy.tsx        # Privacy policy
│   └── NotFound.tsx       # 404 error page
├── services/              # External services
│   └── api.ts            # API integration layer
├── App.tsx               # Main app component with routing
├── main.tsx              # Application entry point
└── index.css             # Global styles & design system
```

## 🎨 Design System

The application uses a comprehensive design system defined in `src/index.css`:

- **Colors**: HSL-based color tokens for light/dark themes
- **Typography**: Inter font with proper font weights
- **Components**: Pre-styled button, card, and form variants
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach

## 📱 Pages & Features

### 🏠 Landing Page (`/`)
- Hero section with call-to-action
- Feature highlights
- Theme toggle
- Responsive design

### 🔐 Authentication (`/login`)
- Login/Register toggle
- Form validation
- Password visibility toggle
- Error handling with toasts

### 📊 Dashboard (`/dashboard`)
- Poll grid with animations
- Create, view, share, delete actions
- Empty state with call-to-action
- Responsive card layout

### ➕ Create Poll (`/create`)
- Dynamic option management (2-10 options)
- Public/private visibility settings
- Form validation
- Character limits

### 🗳️ Poll View (`/polls/:id` & `/share/:shareLink`)
- Interactive voting interface
- Real-time results with animated bars
- Share functionality
- Results visualization

## 🔧 API Integration

The app integrates with a Spring Boot backend API:

- **Base URL**: `https://poll-api-7doi.onrender.com/api`
- **Authentication**: JWT token-based
- **Endpoints**: 
  - `POST /auth/login` - User authentication
  - `POST /auth/register` - User registration
  - `GET /polls` - Fetch user's polls
  - `POST /polls` - Create new poll
  - `GET /polls/:id` - Get poll details
  - `POST /polls/:id/vote` - Submit vote
  - `DELETE /polls/:id` - Delete poll

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   ```
   VITE_API_URL=https://poll-api-7doi.onrender.com/api
   ```
3. **Deploy** - Vercel will automatically build and deploy

### Manual Build

```bash
# Build for production
npm run build

# Preview build locally
npm run preview
```

## 🔒 Environment Variables

Create a `.env` file with:

```env
# API Configuration
VITE_API_URL=https://poll-api-7doi.onrender.com/api

# For local development:
# VITE_API_URL=http://localhost:8080/api
```

## 🎯 Key Features Implementation

### Authentication Flow
- JWT token storage in localStorage
- Automatic token validation
- Route protection for authenticated pages
- Redirect to login for unauthenticated users

### Theme System
- Dark/light mode toggle
- localStorage persistence
- System preference detection
- Smooth theme transitions

### Animation System
- Page transitions with Framer Motion
- Staggered list animations
- Hover effects and micro-interactions
- Loading states with spinners

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 📄 License

This project is built for demonstration purposes. Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For questions or issues, please open a GitHub issue or contact through the application.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**