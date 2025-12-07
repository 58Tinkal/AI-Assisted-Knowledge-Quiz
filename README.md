# AI-Assisted Knowledge Quiz Application

A modern, full-stack quiz application powered by Google Gemini AI that generates personalized quiz questions and provides intelligent feedback. Built with React, Express.js, and featuring a beautiful dark/light theme with responsive design.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)

## 📋 Table of Contents

- [Project Setup & Demo](#1-project-setup--demo)
- [Problem Understanding](#2-problem-understanding)
- [AI Prompts & Iterations](#3-ai-prompts--iterations)
- [Architecture & Code Structure](#4-architecture--code-structure)
- [Features](#features)
- [Screenshots](#5-screenshots--screen-recording)
- [Deployment](#deployment)
- [Known Issues & Improvements](#6-known-issues--improvements)

---

## 1. Project Setup & Demo

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

#### Clone the Repository

```bash
git clone <repository-url>
cd AI-Assisted_Quiz
```

#### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

#### Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory (optional, for production):

```env
VITE_API_BASE=http://localhost:5000
```

### Running the Application

#### Development Mode

**Terminal 1 - Start Backend:**

```bash
cd server
npm start
```

**Terminal 2 - Start Frontend:**

```bash
cd client
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

#### Production Build

**Build Frontend:**

```bash
cd client
npm run build
```

**Start Production Server:**

```bash
cd server
npm start
```

### Demo

- **Live Demo**: [https://ai-assisted-knowledge-quiz-one.vercel.app/]
- **Screen Recording**: [https://drive.google.com/file/d/1qpqHNqcix0CWMXvNuzlscSYgFHtZMX_o/view?usp=drive_link]

---

## 2. Problem Understanding

### Problem Statement

The goal was to create an intelligent quiz application that:

1. Generates contextually relevant quiz questions using AI
2. Provides a smooth, interactive user experience
3. Offers personalized feedback based on performance
4. Supports multiple subjects and difficulty levels
5. Works seamlessly across different devices and screen sizes

### Assumptions Made

1. **AI Model**: Google Gemini 2.5 Flash is used for question generation and feedback
2. **Question Format**: All questions follow a multiple-choice format (A, B, C, D)
3. **User Flow**: Users complete quizzes sequentially, with the ability to mark questions for review
4. **State Management**: Quiz state is persisted in localStorage for session continuity
5. **Deployment**: Application is designed to be deployed on Vercel (serverless functions)

### Key Challenges Addressed

- **AI Response Parsing**: Implemented robust JSON parsing with fallback mechanisms
- **State Management**: Used React Context API for global state with localStorage persistence
- **Theme System**: Built a comprehensive dark/light theme system with CSS variables
- **Responsive Design**: Ensured compatibility across mobile, tablet, and desktop devices
- **API Integration**: Configured proper CORS and environment-based API routing

---

## 3. AI Prompts & Iterations

### Initial Approach

**Initial Prompt (v1):**

```
Generate ${count} multiple choice questions for ${subject} with difficulty ${difficulty}.
```

**Issues Faced:**

- AI returned inconsistent JSON formats
- Sometimes included explanations or markdown formatting
- Questions didn't always match the specified difficulty level

### Refined Prompts

**Question Generation Prompt (Current):**

```
You are a quiz generator. Create exactly ${n} multiple choice questions
for the topic "${finalTopic}" with difficulty "${difficulty}".

Return ONLY valid JSON with this exact structure:
{
  "questions": [
    {
      "id": "string",
      "question": "string",
      "options": [
        { "id": "A", "text": "string" },
        { "id": "B", "text": "string" },
        { "id": "C", "text": "string" },
        { "id": "D", "text": "string" }
      ],
      "correctOptionId": "A" | "B" | "C" | "D"
    }
  ]
}

Rules:
- Do NOT include explanations.
- Do NOT include any text before or after the JSON.
- All questions must be unique and accurate.
```

**Feedback Generation Prompt:**

```
You are a helpful tutor. A user completed a quiz.

Name: ${name}
Subject: ${subject}
Score: ${score} out of ${total}

Write a short, friendly feedback message in 3-5 sentences:
- Mention their score.
- Highlight 1-2 strengths.
- Suggest 1-2 ways to improve.

Return ONLY the feedback text. No JSON, no bullet points.
```

### Improvements Made

1. **JSON Parsing**: Implemented `safeParseJson()` function with multiple fallback strategies
2. **Retry Logic**: Added retry mechanism (2 attempts) for invalid responses
3. **Strict Formatting**: Explicitly requested JSON-only responses with no extra text
4. **Model Selection**: Used Gemini 2.5 Flash for faster response times

### AI Service Implementation

Located in `server/src/services/quizService.js`:

- Uses `@google/generative-ai` package
- Implements error handling and retry logic
- Validates response structure before returning

---

## 4. Architecture & Code Structure

### Project Structure

```
AI-Assisted_Quiz/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── charts/      # Chart components (Pie, Bar)
│   │   │   ├── Loader.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── QuestionPalette.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/        # React Context providers
│   │   │   ├── QuizContext.jsx    # Quiz state management
│   │   │   └── ThemeContext.jsx  # Theme state management
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useLocalStorage.js
│   │   ├── pages/          # Page components
│   │   │   ├── StartPage.jsx
│   │   │   ├── CustomizePage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   └── ReportPage.jsx
│   │   ├── services/       # API service layer
│   │   │   └── api.js
│   │   ├── styles/         # Global styles
│   │   │   └── main.css
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vercel.json         # Vercel deployment config
│
└── server/                 # Express.js backend
    ├── src/
    │   ├── routes/         # API route handlers
    │   │   ├── quizRoutes.js
    │   │   └── userRoutes.js
    │   └── services/       # Business logic
    │       └── quizService.js  # AI integration
    ├── index.js            # Server entry point
    ├── package.json
    └── vercel.json         # Vercel serverless config
```

### Technology Stack

**Frontend:**

- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **React Router DOM 7.10.0** - Client-side routing
- **Axios 1.13.2** - HTTP client
- **Recharts 3.5.1** - Chart library
- **CSS Variables** - Theming system

**Backend:**

- **Express.js 5.2.1** - Web framework
- **Google Generative AI** - AI question generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Key Architectural Decisions

#### 1. State Management

- **React Context API**: Used for global state (quiz data, theme)
- **localStorage**: Persists quiz state across sessions
- **Custom Hook**: `useLocalStorage` for state persistence

#### 2. Component Architecture

- **Page Components**: Each route has its own page component
- **Reusable Components**: Shared UI components (cards, buttons, charts)
- **Context Providers**: Separated concerns (Quiz, Theme)

#### 3. API Design

- **RESTful Routes**: `/api/quiz/generate`, `/api/quiz/feedback`, `/api/users`
- **Error Handling**: Comprehensive error responses with helpful messages
- **CORS Configuration**: Supports cross-origin requests

#### 4. Styling Approach

- **CSS Variables**: Theme-aware color system
- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode**: Full dark/light theme support

### Data Flow

```
User Input → React Component → Context API → API Service → Express Backend → Gemini AI
                                                                                ↓
User Interface ← React Component ← Context API ← API Response ← JSON Response
```

### Key Files Explained

**`client/src/App.jsx`**

- Main application component
- Sets up routing and context providers
- Includes theme toggle for all pages

**`client/src/context/QuizContext.jsx`**

- Manages quiz state (questions, answers, progress)
- Handles quiz generation, navigation, and submission
- Persists state to localStorage

**`client/src/context/ThemeContext.jsx`**

- Manages theme state (light/dark)
- Applies theme classes to document body
- Persists theme preference

**`server/src/services/quizService.js`**

- Interfaces with Google Gemini AI
- Generates quiz questions and feedback
- Implements JSON parsing and retry logic

**`server/src/routes/quizRoutes.js`**

- Handles `/api/quiz/generate` and `/api/quiz/feedback` endpoints
- Validates request data
- Calls quiz service and returns responses

---

## Features

### Core Features

✅ **AI-Powered Question Generation**

- Dynamic question generation using Google Gemini AI
- Support for multiple subjects and topics
- Adjustable difficulty levels (Easy, Medium, Hard)
- Customizable number of questions (5, 10, 15)

✅ **Interactive Quiz Experience**

- Real-time progress tracking
- Question navigation (Previous/Next)
- Mark for review functionality
- Question status indicators (Not Visited, Not Answered, Answered, Marked)

✅ **Comprehensive Reporting**

- Visual performance charts (Pie and Bar charts)
- Detailed score breakdown
- AI-generated personalized feedback
- Question-by-question analysis

✅ **Modern UI/UX**

- Dark/Light theme toggle
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Accessible design with keyboard navigation

✅ **State Persistence**

- Quiz progress saved to localStorage
- Theme preference persistence
- Session continuity

### Technical Features

- **Serverless Ready**: Configured for Vercel deployment
- **Environment-based Configuration**: Supports development and production
- **Error Handling**: Comprehensive error messages and fallbacks
- **Performance Optimized**: Fast load times with Vite
- **Accessibility**: ARIA labels, focus management, reduced motion support

---

## 5. Screenshots / Screen Recording

### Application Screenshots

#### Screenshot Placeholders

**Start Page**

![startpage](https://github.com/user-attachments/assets/426af366-1e1f-49d6-841d-e82f1f384513)

**Customize Page**

![customize](https://github.com/user-attachments/assets/500c19a7-baca-4273-8e33-d9fce3fb1414)

```
[Add screenshot: CustomizePage.png]
```

**Quiz Page**

![quizPage](https://github.com/user-attachments/assets/bed42641-8fc4-45f3-941b-00252ece693f)

```
[Add screenshot: QuizPage.png]
```

**Report Page - Summary View**

![report1](https://github.com/user-attachments/assets/77da5c52-d3b8-42a0-a803-5a2f5d21bc42)

![report2](https://github.com/user-attachments/assets/a94f6bca-199f-4da0-af25-c68ad913e3cf)

```
[Add screenshot: ReportPage-Summary.png]
```

**Report Page - Analysis View**

![Analysis](https://github.com/user-attachments/assets/a19ce1ab-4eff-4cf6-8e92-7a617845b1a0)

```
[Add screenshot: ReportPage-Analysis.png]
```

**Dark Mode**

![darkmode](https://github.com/user-attachments/assets/8314ed7d-4f8d-47ac-893e-69cc516e564b)

```
[Add screenshot: DarkMode.png]
```

**Mobile View**

![mobileview](https://github.com/user-attachments/assets/e2efe52c-27cf-4868-b9b0-e5d1f4a0abb0)

```
[Add screenshot: MobileView.png]
```

**AI Feedback**

![AIfeedback](https://github.com/user-attachments/assets/78d2a398-dfbd-4f7e-b5c3-4247590876b5)

### Screen Recording

[https://drive.google.com/file/d/1qpqHNqcix0CWMXvNuzlscSYgFHtZMX_o/view?usp=drive_link]

---

## Deployment

### Vercel Deployment

The application is configured for deployment on Vercel.

#### Backend Deployment

1. Connect your GitHub repository to Vercel
2. Set root directory to `server`
3. Add environment variables:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `CLIENT_URL`: Your frontend URL (optional)
4. Deploy

#### Frontend Deployment

1. Set root directory to `client`
2. Add environment variables:
   - `VITE_API_BASE`: Your backend API URL (e.g., `https://your-backend.vercel.app`)
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy

### Environment Variables

**Backend (.env)**

```env
GEMINI_API_KEY=your_api_key_here
PORT=5000
CLIENT_URL=https://your-frontend.vercel.app
```

**Frontend (.env)**

```env
VITE_API_BASE=https://your-backend.vercel.app
```

### Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend environment variable set correctly
- [ ] CORS configured properly
- [ ] API endpoints tested
- [ ] Theme toggle working
- [ ] Responsive design verified on multiple devices

---

## 6. Known Issues / Improvements

### Known Issues

1. **AI Response Parsing**

   - **Issue**: Occasionally, Gemini returns malformed JSON
   - **Current Solution**: Retry mechanism with fallback parsing
   - **Improvement**: Implement more robust JSON extraction or switch to structured output

2. **Question Quality**

   - **Issue**: Some generated questions may not perfectly match difficulty level
   - **Current Solution**: Prompt engineering with explicit difficulty instructions
   - **Improvement**: Add question validation or post-processing

3. **State Management**

   - **Issue**: Large quiz state in localStorage may impact performance
   - **Current Solution**: Basic localStorage implementation
   - **Improvement**: Implement state compression or pagination

4. **Error Handling**
   - **Issue**: Generic error messages for API failures
   - **Current Solution**: Basic error handling
   - **Improvement**: User-friendly error messages with retry options

### Planned Improvements

#### Short-term (1-2 weeks)

1. **Enhanced Question Types**

   - Support for true/false questions
   - Multiple correct answers
   - Fill-in-the-blank questions

2. **User Authentication**

   - User accounts and profiles
   - Quiz history tracking
   - Performance analytics over time

3. **Question Bank**

   - Save favorite questions
   - Create custom question sets
   - Share quizzes with others

4. **Timer Functionality**
   - Optional time limits per question
   - Overall quiz timer
   - Time-based scoring

#### Medium-term (1-2 months)

1. **Advanced Analytics**

   - Performance trends over time
   - Subject-wise breakdown
   - Weak area identification

2. **Social Features**

   - Leaderboards
   - Quiz sharing
   - Collaborative quizzes

3. **Offline Support**

   - Service worker implementation
   - Offline quiz taking
   - Sync when online

4. **Accessibility Enhancements**
   - Screen reader optimization
   - Keyboard-only navigation
   - High contrast mode

#### Long-term (3+ months)

1. **Multi-language Support**

   - Internationalization (i18n)
   - Questions in multiple languages
   - Regional difficulty adjustments

2. **Advanced AI Features**

   - Adaptive difficulty based on performance
   - Personalized learning paths
   - Explanation generation for incorrect answers

3. **Mobile App**

   - React Native version
   - Push notifications
   - Offline-first architecture

4. **Enterprise Features**
   - Team/classroom management
   - Bulk quiz creation
   - Advanced reporting and analytics

### Technical Debt

1. **Testing**

   - Add unit tests for components
   - Integration tests for API routes
   - E2E tests for critical user flows

2. **Type Safety**

   - Migrate to TypeScript
   - Add PropTypes or similar
   - API response validation

3. **Performance**

   - Code splitting for routes
   - Lazy loading for charts
   - Image optimization

4. **Documentation**
   - API documentation (Swagger/OpenAPI)
   - Component documentation (Storybook)
   - Developer guide

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License.

---

## Acknowledgments

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) for AI capabilities
- [React](https://react.dev/) for the UI framework
- [Vite](https://vitejs.dev/) for the build tool
- [Recharts](https://recharts.org/) for chart components
- [Vercel](https://vercel.com/) for deployment platform

---

## Contact

For questions or support, please open an issue on GitHub or contact the maintainers.

---

**Made with  using React and AI**
