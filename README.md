# Recruiter Job Portal - Mobile (Expo) + Backend (Express/Firebase)

## Structure

- frontend/ (Expo React Native)
  - `App.js`, `app.config.js`
  - `src/navigation/BottomNav.jsx`
  - `src/screens/RecruiterDashboard.jsx`
  - `src/screens/JobManagementScreen.jsx`
  - `src/screens/PostJobScreen.jsx`
  - `src/services/firebase.js`
- backend/ (Express + Firebase Admin)
  - `src/index.js`
  - config: `src/config/firebaseAdmin.js`
  - middleware: `src/middleware/auth.js`
  - modules: `src/modules/*.js` (jobs, applications, recruiters, candidates)
  - controllers: `src/controllers/*.js`
  - routers: `src/routers/*.js`
- `.env.example` for environment variables

## Requirements Mapped

- Mobile screens: Post Job, Recruiter Dashboard, Job Management, with bottom nav.
- Firebase client: Auth/Firestore/Storage integrated on mobile. Use Email/Google on your Auth page (not included here).
- Backend: Auth via Firebase ID token, Firestore/Storage access via Admin SDK, routes for jobs/applications/recruiters/candidates.

## Setup

### Firebase
1. Create Firebase project. Enable Authentication (Email/Password and Google) and Firestore + Storage.
2. Create a Web app and copy config into `EXPO_PUBLIC_*` in `.env` (see `.env.example`).
3. Create a service account (Admin SDK) and copy its values into backend env: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.

### Frontend (Expo)
```
cd frontend
npm i
npm run start
```
Use Expo Go or emulator. Sign-in flow should set `auth.currentUser`; stub or add a simple auth screen if needed.

### Backend (Express)
```
cd backend
npm i
npm run dev
```
Set envs from `.env.example`.

## Notes
- The app currently reads/writes directly to Firestore client-side for jobs. You can switch to calling the backend routes by exchanging Firebase ID token from `auth.currentUser.getIdToken()` and using the REST API endpoints.
- Suggested candidates use a simple skills overlap heuristic.
- "Check Status" currently navigates to the Post Job screen as a placeholder; replace with Applicants list screen later.
