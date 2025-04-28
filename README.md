# bid-bridge

**Bid Bridge** is a Node.js web server application built with the Express.js framework. It provides a full-featured REST API for managing bids placed by bidders on posted tasks.

## Key Features

- **Full CRUD Operations**  
  Perform create, read, update, and delete operations for users, tasks, and bids through a clean and structured API.

- **JWT Authentication**  
  Secure user login and session management using JSON Web Tokens (JWT).

- **Third-party Authentication**  
  Support for OAuth providers (e.g., Google, Facebook) to allow easy third-party login.

- **Real-time Messaging with Socket.IO**  
  Enable instant communication between bidders and task posters via WebSockets.

## Technical Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT (jsonwebtoken)** for authentication
- **OAuth (Passport.js)** for third-party login
- **Socket.IO** for real-time communication

## Purpose

The Bid Bridge API powers platforms where users can post tasks, bidders can place offers, communicate in real-time, and manage their activities efficiently.

## Additional Notes

- Designed for scalability with a modular project structure.
- Middleware is used for input validation, authentication, and error handling.
- User management features include signup, login, and profile updates.
