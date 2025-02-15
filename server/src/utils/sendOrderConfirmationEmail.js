import transporter from "../config/emails.js";

export const sendOrderConfirmationEmail = async (userData, newOrder, shippingAddress, paymentStatus) => {
    // Send Confirmation Email
    const emailContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Order Confirmation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                        text-align: center;
                        margin-bottom: 10px;
                    }
                    .sub-header {
                        font-size: 18px;
                        text-align: center;
                        color: #666;
                        margin-bottom: 20px;
                    }
                    .greeting {
                        font-size: 18px;
                        font-weight: bold;
                        color: #ff9900;
                        margin-bottom: 10px;
                    }
                    .order-details {
                        border: 1px solid #ddd;
                        padding: 15px;
                        margin-top: 15px;
                        border-radius: 5px;
                        background-color: #fafafa;
                    }
                    .order-details p {
                        margin: 5px 0;
                        font-size: 16px;
                        color: #333;
                    }
                    .highlight {
                        font-weight: bold;
                        color: #007bff;
                    }
                    .button {
                        display: block;
                        width: 100%;
                        max-width: 200px;
                        margin: 20px auto;
                        padding: 12px;
                        background-color: #ff9900;
                        color: white;
                        text-align: center;
                        text-decoration: none;
                        font-size: 16px;
                        border-radius: 5px;
                        font-weight: bold;
                        transition: 0.3s;
                    }
                    .button:hover {
                        background-color: #e68900;
                    }
                    .footer {
                        text-align: center;
                        font-size: 14px;
                        color: #666;
                        margin-top: 30px;
                    }
                    .footer a {
                        color: #007bff;
                        text-decoration: none;
                    }
                    hr {
                        border: none;
                        height: 1px;
                        background-color: #ddd;
                        margin: 15px 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <p class="header">Thank You for Your Order, ${userData.firstName} ${userData.lastName}!</p>
                    <p class="sub-header">Your order has been placed successfully. We'll notify you once it's shipped.</p>
                    <div class="order-details">
                        <p><span class="highlight">Order #:</span> ${newOrder._id}</p>
                        <p><span class="highlight">Shipping Speed:</span> Standard Delivery</p>
                        <hr>
                        <p><span class="highlight">Shipping Address:</span></p>
                        <p>${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.country}
                            - ${shippingAddress.zip_code}</p>
                        <hr>
                        <p><span class="highlight">Order Total:</span> Rs.${Number(newOrder.totalAmount).toFixed(2)}</p>
                        <p><span class="highlight">Payment Status:</span> ${paymentStatus}</p>
                    </div>
                    <a href="${process.env.FRONTEND_HOST}/account/dashboard" class="button">View Order Details</a>
                    <div class="footer">
                        <p>Need help? Contact our <a href="mailto:sameercart@gmail.com">Customer Support</a>.</p>
                        <p>For the latest updates, visit <a href="${process.env.FRONTEND_HOST}/account/dashboard">Your Orders</a>.</p>
                        <p>© ${new Date().getFullYear()} SameerCart. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
    `;
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: userData.email,
        subject: "Order Confirmation",
        html: emailContent,
    });
};
