const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const TOKEN = 'APP_USR-8959984422569476-041719-2c2f0cab47e614339a175c63d3cf9ec6-2338582345';

// ================= PIX =================
app.post('/pagar-pix', async (req, res) => {
    const { valor } = req.body;

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            transaction_amount: Number(valor),
            description: 'Pagamento de serviço',
            payment_method_id: 'pix',
            payer: {
                email: 'cliente@email.com'
            }
        })
    });

    const data = await response.json();

    res.json({
        qr_code: data.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: data.point_of_interaction.transaction_data.qr_code_base64
    });
});

// ================= BOLETO =================
app.post('/pagar-boleto', async (req, res) => {
    const { valor } = req.body;

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            transaction_amount: Number(valor),
            description: 'Pagamento via boleto',
            payment_method_id: 'bolbradesco',
            payer: {
                email: 'cliente@email.com'
            }
        })
    });

    const data = await response.json();

    res.json({
        boleto: data.transaction_details.external_resource_url
    });
});

app.listen(3000, () => console.log('Servidor rodando'));