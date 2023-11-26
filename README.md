# Shopping Node App

## Description

This is a shopping application built with Node.js, using Mongoose for MongoDB object modeling and providing user authentication. It's designed to demonstrate the creation, reading, updating, and deleting (CRUD) operations with a focus on backend services.

## Features

- User Authentication (Sign up, Sign in, Sign out)
- CRUD operations for products
- Shopping cart functionality
- Order management
- Admin dashboard for managing products, users, and orders

## Installation

To run this application, you will need Node.js and MongoDB installed on your machine.

1. Clone the repository:
   ```sh
   git clone https://github.com/isandeep4/shoppigAppNode/
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```
3. Set up your environment variables in a `.env` file at the root directory:
   ```sh
   DATABASE_URL=mongodb://localhost:27017/shopping
   SESSION_SECRET=your_secret_key
   ```
4. Start the MongoDB service on your machine.

5. Run the server:
   ```sh
   npm start
   ```

## Usage

After starting the server, the app will be running on `http://localhost:3000`.

- Access the application through your web browser.
- Sign up for a new user account or sign in with existing credentials.
- Explore the product listings, add items to your cart, and proceed to checkout.

## API Endpoints

| Method | Endpoint          | Description            | Access  |
|--------|-------------------|------------------------|---------|
| POST   | `/users/signup`   | Register a new user    | Public  |
| POST   | `/users/login`    | Log in a user          | Public  |
| GET    | `/products`       | Fetch all products     | Public  |
| POST   | `/products`       | Create a new product   | Admin   |
| PUT    | `/products/:id`   | Update a product       | Admin   |
| DELETE | `/products/:id`   | Delete a product       | Admin   |
| POST   | `/orders`         | Place a new order      | Users   |
| GET    | `/orders`         | Get all user's orders  | Users   |
