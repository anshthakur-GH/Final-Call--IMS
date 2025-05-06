# Inventory Management System (IMS)

A basic, beginner-friendly Inventory Management System built with Node.js, Express, MySQL, and EJS.

## Features
- User login & session
- Dashboard with metrics & charts
- Product CRUD
- Stock management & alerts
- Manual order entry
- Sales & purchases tracking
- Reports (CSV/PDF export)

## Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Set up MySQL and import the provided SQL schema.
3. Edit `db/connection.js` with your MySQL credentials.
4. Run the app:
   ```
   npm start
   ```

## Folder Structure
- `routes/` – Express route handlers
- `views/` – EJS templates
- `public/` – Static files (CSS, JS)
- `db/` – Database connection

## Default Login
- Username: `admin`
- Password: `admin123`
