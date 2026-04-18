const express = require('express');
const cors = require('cors');
const path = require('path');

// NOVA FORMA DO MERCADO PAGO
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();

app.use(express.json());
app.use(cors());

// SERVIR ARQUIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname)));

// CONFIGURAÇÃO CORRETA
const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-6307161791349576-041719-d63e4d48d6c64210c217dfccc521cc13-3344260680'
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
        ],
        payment_methods: {
            excluded_payment_types: [],
            excluded_payment_methods: [],
            installments: 1
        }
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