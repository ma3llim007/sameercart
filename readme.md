# sameerCart E-Commerce Project

![Project Screenshot](images/home.png)

## Overview

[SameerCart](https://sameercart.onrender.com/) is a full-featured eCommerce application designed to provide a seamless shopping experience. Users can browse products, add them to their cart, and complete secure purchases. The platform includes robust features like user authentication, product management, order tracking, and payment gateway integration.


## Features

-   Secure user authentication & authorization (Sign Up, Login, Logout, Password Reset)
-   Product browsing, filtering, and search functionality
-   Shopping cart and smooth checkout process
-   Order management and real-time order tracking
-   Secure payment gateway integration via Razorpay
-   Admin panel for managing products, orders, and users
-   Fully responsive design for mobile and desktop users

## Technologies Used

-   **Frontend:** React.js (with Context API & Hooks)
-   **Backend:** Node.js / Express.js
-   **Database:** MongoDB with Mongoose ORM
-   **Authentication:** JWT-based authentication
-   **Payment Gateway:** Razorpay for secure transactions
-   **Hosting & Deployment:** Render for backend and Vercel for frontend

## Installation

To set up the project locally, follow these steps:

### Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   yarn
   ```

3. Set up environment variables:
   ```bash
   cp .env.sample .env
   ```
   Update `.env` file with your credentials (e.g., Backend URL,etc.).

4. Start the frontend server:
   ```bash
   yarn start
   ```
   The frontend should be accessible at `http://localhost:5173`.
---
### Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd ../server
   ```
2. Install dependencies:
   ```bash
   yarn
   ```
3. Set up environment variables:
   ```bash
   cp .env.sample .env
   ```
    Update `.env` file with your credentials (e.g., database URI, Stripe keys, JWT secret, etc.).

4. Start the backend server:
    ```bash
    npm run dev
    ```
    The backend should be accessible at `http://localhost:8000`.

---
## Usage

To explore the application:

-   Visit the live website: [SameerCart](https://sameercart.onrender.com/)
-   Sign up or log in to access your personalized dashboard.
-   Browse products and add items to your shopping cart.
-   Proceed to checkout and make secure payments using Razorpay.
-   Track your order status in real-time.

## ⚠️ Warning & Danger Zone
- **Do not use real credit/debit card details unless you intend to make an actual purchase.**
- **For testing purposes, use Stripe's test card details to avoid unintended transactions.**
- **Unauthorized transactions will not be refunded.**
- **Ensure your credentials and payment details are securely stored and not shared with others.**


## Development & Contribution

Want to contribute? Follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/ma3llim007/sameercart.git
    ```
2. Create a new branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. Implement your changes and commit:
    ```bash
    git add .
    git commit -m "Describe your changes here"
    ```
4. Push to GitHub:
    ```bash
    git push origin feature/your-feature-name
    ```
5. Open a pull request on GitHub and describe your changes.

## Contributing Guidelines

-   Ensure code follows project structure and best practices.
-   Submit detailed pull requests with clear descriptions.
-   Report bugs and suggest improvements via GitHub Issues.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

-   **React.js:** For a scalable and flexible frontend.
-   **React Context API:** For efficient state management.
-   **Express.js & MongoDB:** For a robust backend architecture.
-   **Razorpay:** For secure and seamless payment processing.