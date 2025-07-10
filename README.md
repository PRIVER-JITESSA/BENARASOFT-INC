# Movie Streaming Platform - Banerasoft Inc.

This is a responsive and interactive movie streaming web app built with **React.js**, **Next.js**, and **Clerk**, powered by the **TMDb (The Movie Database) API**. The application simulates a real-world streaming experience with user authentication, movie discovery, and a personalized dashboard.


## Features

###  Landing Page
- Clean, responsive hero section with CTAs for **Sign Up** and **Log In**
- Highlights trending/popular movies from the TMDb API
- Optional demo section showcasing app features

### Authentication
- Implemented using **Clerk**
- Secure Sign Up, Log In, and session management

### Dashboard
- Displays user-specific metrics:
  - Movies browsed / added to watchlist
  - Personalized recommendations (basic logic)
- Includes:
  - Chart visualizations (e.g., favorite genres, watch activity)
  - A sortable table of the latest 5 movies with a **"View More"** option

### Movie Menu
- Scrollable, card-based movie display with:
  - Poster, title, release date, genre, rating
- Filterable by:
  - Genre, release year, rating
- Searchable by title/keyword
- Sortable by release date, rating, or popularity
- Supports pagination for large data sets

### Settings
- User logout with a confirmation dialog

## Libraries & Tools Used

- **React.js** (via Next.js)
- **Tailwind CSS** for UI styling
- **Clerk** for authentication
- **TMDb API** for movie data
- **Lucide-react** for icons
- **Chart.js / Recharts** for dashboard visualizations (optional)
- **Radix UI** (via ShadCN) for dialogs and UI components


## Known Issues / Limitations

### 🔍 Recommendation Engine
The personalized recommendation feature is currently very basic and not deeply integrated. Some limitations include:
- No persistent user history or advanced tracking logic
- Lacks collaborative filtering or AI-based similarity matching
- Limited by the TMDb API's filtering capabilities for per-user preferences

### Data Persistence
"My List" and viewing history are stored in local state or localStorage and are not persisted on a backend database. This can be expanded in future iterations.


## Getting Started
Visit the url in the Github section and browse.

Enjoy !!
