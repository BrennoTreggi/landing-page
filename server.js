const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();

app.use(express.json());
app.use(cors());

const client = new MercadoPagoConfig({
    accessToken: 'SEU_ACCESS_TOKEN_AQUI'
});

app.post('/criar-pagamento', async (req, res) => {
    try {
        const { valor } = req.body;

        const preference = new Preference(client);

        const response = await preference.create({
            body: {
                items: [
                    {
                        title: 'Serviço',
                        quantity: 1,
                        unit_price: Number(valor)
                    }
                ]
            }
        });

        res.json({ link: response.init_point });

    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: 'Erro' });
    }
});

app.listen(3000, () => {
    console.log("Rodando em http://localhost:3000");
});