const express = require('express');
const mercadopago = require('mercadopago');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mercadopago.configure({
    access_token: 'SEU_ACCESS_TOKEN_AQUI'
});

app.post('/criar-pagamento', async (req, res) => {
    try {
        const { valor } = req.body;

        const preference = await mercadopago.preferences.create({
            items: [
                {
                    title: 'Orçamento de Serviços',
                    quantity: 1,
                    unit_price: Number(valor)
                }
            ]
        });

        res.json({
            link: preference.body.init_point
        });

    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao criar pagamento' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});