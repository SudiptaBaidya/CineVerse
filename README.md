# CineVerse

CineVerse is a web application for discovering movies, creating watch parties, and getting recommendations.

## Features

*   **Discover Movies:** Browse through popular, top-rated, and upcoming movies.
*   **Movie Details:** View detailed information about a movie, including its cast, crew, and reviews.
*   **Watch Parties:** Create and join watch parties with your friends.
*   **Recommendations:** Get personalized movie recommendations.
*   **User Settings:** Customize your profile and application settings.
*   **Search History:** Keep track of your past movie searches.

## Tech Stack

**Frontend:**

*   [React](https://react.dev/)
*   [Vite](https://vitejs.dev/)
*   [Firebase](https://firebase.google.com/)
*   [Tailwind CSS](https://tailwindcss.com/)

**Backend:**

*   [Node.js](https://nodejs.org/)
*   [Express](https://expressjs.com/)
*   [MongoDB](https://www.mongodb.com/)
*   [Mongoose](https://mongoosejs.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   [Node.js](https://nodejs.org/en/download/)
*   [npm](https://www.npmjs.com/get-npm)

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/SudiptaBaidya/CineVerse.git
    ```
2.  Install NPM packages for the client
    ```sh
    cd client
    npm install
    ```
3.  Install NPM packages for the server
    ```sh
    cd ../server
    npm install
    ```

### Running the Application

1.  Run the client
    ```sh
    cd client
    npm run dev
    ```
2.  Run the server
    ```sh
    cd ../server
    npm run dev
    ```

## Folder Structure

```
.
├── client/         # Frontend code
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── services/
│       └── utils/
└── server/         # Backend code
    ├── models/
    └── routes/
```