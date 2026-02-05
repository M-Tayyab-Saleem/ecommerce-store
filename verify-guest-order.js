
const axios = require('axios');

async function testGuestOrder() {
    try {
        const productsRes = await axios.get('http://localhost:3000/api/products');
        if (!productsRes.data.success || productsRes.data.data.length === 0) {
            console.log('No products found to order');
            return;
        }
        const product = productsRes.data.data[0];

        const orderData = {
            items: [
                {
                    product: product._id,
                    quantity: 1,
                    selectedVariant: "default"
                }
            ],
            shippingAddress: {
                name: 'Guest User',
                phone: '03001234567',
                address: '123 Guest St',
                city: 'Lahore'
            },
            paymentMethod: 'COD',
            email: 'guest@example.com'
        };

        const res = await axios.post('http://localhost:3000/api/orders', orderData);
        console.log('Guest Order Status:', res.status);
        console.log('Guest Info:', res.data.data.guestInfo);
    } catch (error) {
        console.error('Guest Order Failed:', error.response ? error.response.data : error.message);
    }
}

testGuestOrder();
