
# Quiz App Backend

## Project Overview

### Student
- Purpose: The Quiz App is a website designed to help you improve your language fluency. It provides features such as leaderboards, language customization, and dynamically adjusts question difficulty based on your learning ability.

### Admin
- Admin users can add languages, exercises, and quizzes to the app.

## Project Structure

The project structure is organized with directories that clearly reflect their purpose. Each directory stores relevant files that contain the corresponding business logic.


## Directory Structure

```
├── app
│   ├── config
│   │   ├── db.js
│   │   └── logger.js
│   ├── controllers
│   │   ├── admin.js
│   │   ├── leaderboard.js
│   │   └── quiz.js
│   ├── error
│   │   ├── errors.js
│   │   ├── handleUncaughtErrors.js
│   │   ├── handler.js
│   │   └── index.js
│   ├── middlewares
│   │   ├── auth.js
│   │   └── utils.js
│   ├── models
│   │   ├── Questions.js
│   │   ├── answers.js
│   │   ├── exercise.js
│   │   ├── index.js
│   │   ├── language.js
│   │   ├── progress.js
│   │   └── user.js
│   ├── routes
│   │   ├── admin.js
│   │   ├── index.js
│   │   ├── leaderboard.js
│   │   ├── quiz.js
│   │   └── user.js
│   └── utils
│       ├── httpResponse.js
│       ├── index.js
│       ├── user.js
│       ├── userProgress.js
│       └── utils.js
├── error.log
├── package-lock.json
├── package.json
└── server.js
```

## Getting Started

### Prerequisites
- Clone the repository
- Install dependencies using `npm install`
- Set up your environment variables in a `.env` file

```
PORT = 
MONGODB_URI =
JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRY=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRY=
```

### Frontend
You can access the hosted frontend on [here](https://inquisitive-sundae-7712d6.netlify.app/). The website is user-friendly and easy to navigate click on more options for more pages.


## External Dependencies Used

- JWT:
- MongoDB
- Mongoose
- Express-async-handler

## Usage

Run the application using:

```
npm run dev
```

## Features

- **Async Handler**: The app utilizes async handlers on all routes to handle errors more efficiently, reducing the need to write try-catch blocks for each route.

## Contributors

- Name: Bhavyashu Agarwal
- Email: the.bhavyashu@gmail.com
