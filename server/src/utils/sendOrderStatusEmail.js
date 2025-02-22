import transporter from "../config/emails.js";

export const sendOrderStatusEmail = async (userData, order, statusMessage) => {
    const emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${statusMessage.emailSubject}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    font-size: 22px;
                    font-weight: bold;
                    text-align: center;
                    color: #333;
                }
                .sub-header {
                    font-size: 16px;
                    text-align: center;
                    color: #555;
                    margin-bottom: 20px;
                }
                .order-details, .shipping-details {
                    border: 1px solid #ddd;
                    padding: 15px;
                    margin-top: 15px;
                    border-radius: 5px;
                    background-color: #fafafa;
                }
                .order-details p, .shipping-details p {
                    margin: 8px 0;
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
                    max-width: 250px;
                    margin: 20px auto;
                    padding: 12px;
                    background-color: #007bff;
                    color: white !important;
                    text-align: center;
                    text-decoration: none;
                    font-size: 16px;
                    border-radius: 5px;
                    font-weight: bold;
                    transition: 0.3s;
                }
                .button:hover {
                    background-color: #0056b3;
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
                <p class="header">${statusMessage.title}</p>
                <p class="sub-header">${statusMessage.subtitle}</p>
                
                <div class="order-details">
                    <p><span class="highlight">Order #:</span> ${order._id}</p>
                    <p><span class="highlight">Current Status:</span> ${order.orderStatus === "CanceledByAdmin" ? "Canceled By Admin" : order.orderStatus}</p>
                    <p><span class="highlight">Payment Status:</span> ${order.paymentStatus}</p>
                    <p><span class="highlight">Payment Method:</span> ${order.paymentType ==="COD" ? "Cash On Delivery" : "Already Paid"}</p>
                    <p><span class="highlight">Total Amount:</span> ₹${order.totalAmount}</p>
                    <p><span class="highlight">Order Date:</span> ${new Date(order.orderDate).toLocaleDateString()}</p>
                    <p><span class="highlight">Estimated Shipping Date:</span> ${new Date(order.orderShippingDate).toLocaleDateString()}</p>
                    ${order.orderCancelReason ? `<p style="color: red;"><span class="highlight">Cancellation Reason:</span> ${order.orderCancelReason}</p>` : ""}
                    ${order.orderCancelReason ? `<p><span class="highlight">Delivered Date:</span> ${new Date(order.completeOrderdate).toLocaleDateString()}</p>` : ""}
                    <div class="shipping-details">
                        <p><span class="highlight">Shipping Address:</span></p>
                        <p>${order.shippingAddress.street}, ${order.shippingAddress.city}</p>
                        <p>${order.shippingAddress.state}, ${order.shippingAddress.country} - ${order.shippingAddress.zip_code}</p>
                    </div>
                </div>
                <a href="${process.env.FRONTEND_HOST}/account/dashboard" class="button">View Order Details</a>
                <div class="footer">
                    <p>Need help? Our team is here to assist you! Contact us at <a href="mailto:sameercart@gmail.com">sameercart@gmail.com</a></p>
                    <p>Visit <a href="${process.env.FRONTEND_HOST}/account/dashboard">Your Orders</a> for more details.</p>
                    <p>© ${new Date().getFullYear()} SameerCart. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await transporter.sendMail({
        from: `"SameerCart" <${process.env.EMAIL_FROM}>`,
        to: userData?.email,
        subject: statusMessage.emailSubject,
        html: emailContent,
    });
};
