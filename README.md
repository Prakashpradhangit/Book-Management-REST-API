# Book Management REST API

A simple REST API built using **Node.js, Express, and TypeScript** to manage a collection of books.  
The application supports standard CRUD operations and bulk book import using CSV files with proper validation.

This project was created to demonstrate clean backend architecture, clear separation of concerns, and real-world API handling such as file uploads, validation, and error management.

---

## Features

- Create, read, update, and delete books
- Bulk import books using a CSV file
- Manual CSV parsing and validation (no CSV parsing libraries)
- Centralized error handling
- Request logging using Morgan
- Environment-based configuration with dotenv
- Clean and maintainable folder structure

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Multer (file upload handling)
- Morgan (logging)
- Jest (unit testing)

---

## Project Structure

- controllers/ # Handles request and response logic
- routes/ # API route definitions
- services/ # Business logic
- utils/ # Utility functions (CSV parser)
- middleware/ # Error handling middleware
- app.ts # Express app configuration
- server.ts # Server entry point


---

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

---

### Installation

1. Clone the repository


2. Install dependencies
npm install


3. Create a `.env` file in the root directory
PORT=3000

4. Start the development server
npm run dev



---

## API Endpoints

### Books

| Method | Endpoint | Description |
|------|--------|------------|
| GET | /books | Get all books |
| GET | /books/:id | Get book by ID |
| POST | /books | Create a new book |
| PUT | /books/:id | Update a book |
| DELETE | /books/:id | Delete a book |

### Bulk Import

| Method | Endpoint | Description |
|------|--------|------------|
| POST | /books/import | Import books using CSV |

---

## CSV Import

### Required CSV Format

The CSV file must include the following headers:

```csv
title,author,publishedYear

title,author,publishedYear
Core Java,Prakash,2001
Advanced Java,Prakash,2002

