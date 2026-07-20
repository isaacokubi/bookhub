export default function (payment) {
  return `

<h1>Payment Successful</h1>

<p>

Receipt:
${payment.mpesaReceiptNumber}

</p>

`;
}
