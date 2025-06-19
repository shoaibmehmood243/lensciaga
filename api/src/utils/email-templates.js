const generateOrderEmailHTML = (orderId, name, email, items, total, promoCode, discount) => {
  const itemsHtml = items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price}</td>
      <td>${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`).join('');

  return `
    <h2>Order Confirmation - Order #${orderId}</h2>
    <p>Hi ${name},</p>
    <p>Thanks for your order! Here are your order details:</p>
    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    <p><strong>Total Amount:</strong> ${total.toFixed(2)} PKR</p>
    ${promoCode ? `<p><strong>Promo Code:</strong> ${promoCode} (${discount}% off)</p>` : ''}
    <p>We’ll notify you when your order is shipped.</p>
    <p>Regards,<br/>Team</p>
  `;
};

const generateUpdateOrderStatusEmailHTML = (name, status, orderId) => {
  return `
    <h2>Order Update - Order #${orderId}</h2>
    <p>Hi ${name},</p>
    <p>Your order status has been updated to: <strong>${status}</strong>.</p>
    <p>You can contact us if you have any questions.</p>
    <p>Regards,<br/>Team</p>
  `;
};

module.exports = { generateOrderEmailHTML, generateUpdateOrderStatusEmailHTML };
