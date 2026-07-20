export const orderCreated = (order) => {
  return `
<!DOCTYPE html>
<html>

<head>
<title>Order Created</title>
</head>

<body>

<h2>BookHub Kenya</h2>

<h3>Order Confirmation</h3>

<p>
Hello ${order.buyer?.name || "Customer"},
</p>

<p>
Your order has been created successfully.
</p>

<p>
Order ID: ${order._id}
</p>

<p>
Total Amount: KES ${order.totalAmount}
</p>

<p>
Payment Status: ${order.paymentStatus}
</p>

<p>
Order Status: ${order.status}
</p>


<p>
Thank you for shopping at BookHub Kenya.
</p>

</body>

</html>
`;
};
