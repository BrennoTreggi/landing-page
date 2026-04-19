const express = require('express');
const cors = require('cors');

// NOVA FORMA DO MERCADO PAGO
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();

app.use(express.json());
app.use(cors());

// CONFIGURAÇÃO CORRETA
const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-3587674818144140-041901-a92264984e2a696ad92811da722dc2a8-2338582345'
});

app.post('/criar-pagamento', async (req, res) => {
    try {
        const { valor } = req.body;

        const preference = new Preference(client);

        const response = await preference.create({
            body: {
                items: [
                    {
                        title: 'Orçamento de Serviços',
                        quantity: 1,
                        unit_price: Number(valor)
                    }
                ]
            }
        });

        res.json({
            link: response.init_point
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao criar pagamento' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});