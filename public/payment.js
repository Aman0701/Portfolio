
document.getElementById('paymentForm').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the default form submission behavior  
    const amount = document.getElementById('price').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    try {
        const result = await fetch('/api/getkey');

        const key = await result.json();
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Setting content type to JSON
            },
            body: JSON.stringify({ amount: amount })
        });

        const { orderId } = await response.json();
        const options = {
            key: key.key,
            amount: parseFloat(amount * 100),
            currency: "INR",
            name: "Aman Agrawal",
            description: "Test Transaction",
            image: "src/views/vinayagar.webp",
            order_id: orderId,
            prefill: {
                name: name,
                email: email,
                contact: phone,
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#121212",
            },
            handler: function (response) {
                // If you want to send this data to the server
                fetch('/api/paymentverification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        payment_id: response.razorpay_payment_id,
                        order_id: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                        name: name,
                        email: email,
                        contact: phone,
                        amount: amount
                    })
                }).then(res => res.text())
                    .then(html => {
                        // You can insert the HTML into a specific element on your page
                        document.body.innerHTML = html;  // Example: replace the entire body with the response
                    })
                    .catch(error => console.error('Error:', error));
            }
        };
        const razor = new window.Razorpay(options);
        razor.open();
    } catch (err) {
        console.log(err);

    }
});
