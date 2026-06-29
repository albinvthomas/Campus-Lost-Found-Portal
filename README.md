# Campus Lost & Found Portal 🎓🔍

A full-stack web application designed to help university students and faculty report, browse, and seamlessly reunite with lost items across campus. 

## 🏗️ How It Was Created

This project was built from scratch utilizing the **MERN** stack. Development was divided into two isolated architectures:
1. **Backend (`/backend`)**: A Node.js REST API was set up to handle data persistence, authentication, and file storage. It utilizes custom middleware for JWT validation and Multer for localized image storage. 
2. **Frontend (`/frontend`)**: A React SPA (Single Page Application) scaffolded with Vite. It consumes the REST API using an Axios interceptor to securely append JWT tokens to all outgoing requests. The UI was designed entirely from scratch using Tailwind CSS to maintain a clean, consistent, and fully responsive aesthetic.

## 💻 Tech Stack & Rationale

### 1. MongoDB & Mongoose
- **Why**: The portal required a flexible database capable of handling items that could vastly differ in description and categorization. NoSQL is perfect here. Mongoose was used to enforce a strict schema validation layer (e.g., ensuring `enum` types for Categories like "Electronics" or "Keys") before data hits the DB.

### 2. Express.js & Node.js
- **Why**: Node provides a fast, asynchronous runtime ideal for I/O heavy tasks (like reading/writing uploaded images). Express was used to cleanly route our REST endpoints (`/api/auth`, `/api/items`) and easily plug in modular middleware.

### 3. React & Vite
- **Why React**: The dashboard needed to feel alive and dynamic without page reloads. React's context API (`AuthContext.jsx`) was utilized to seamlessly broadcast the user's login state globally to protect routes (`PrivateRoute.jsx`) and toggle UI elements.
- **Why Vite**: Chosen over Create React App (CRA) due to its significantly faster Cold Start times and near-instant Hot Module Replacement (HMR).

### 4. Tailwind CSS v4
- **Why**: For styling, Tailwind provides utility classes that allowed us to build custom, highly responsive components (like the mobile hamburger menu and CSS Grid item cards) directly within our JSX. We upgraded to v4 alongside `@tailwindcss/postcss` for lightning-fast CSS compilation.

### 5. JSON Web Tokens (JWT) & bcryptjs
- **Why**: JWT was implemented to provide a stateless authentication mechanism. Instead of managing session cookies on the server, the server issues a signed token, pushing session state management to the client. `bcryptjs` was used as a Mongoose pre-save hook to cryptographically hash user passwords to prevent plaintext database vulnerabilities.

### 6. Multer
- **Why**: Native Express cannot easily parse `multipart/form-data` (which is required when uploading physical files). Multer acts as a middleware funnel, extracting the uploaded binary image, saving it safely to `/backend/uploads`, and appending the resulting filename to the `req.file` object for saving in Mongo.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `127.0.0.1:27017` or via MongoDB Atlas)

### 1. Backend Configuration
```bash
cd backend
npm install
```
Create a `.env` file in `/backend` with the following:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus_lost_found
JWT_SECRET=your_super_secret_key
```
Start the server:
```bash
node server.js
```
*(Note: A `dev_server.js` script is also available to automatically spin up an in-memory MongoDB database for testing without local installation!)*

### 2. Frontend Configuration
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

Navigate to `http://localhost:5173` in your browser!
