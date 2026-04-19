


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

// CONFIGURAÇÃO CORRETA - TOKEN DE TESTE PARA TESTES
const client = new MercadoPagoConfig({
    accessToken: 'TEST-5024817526090385-041903-496668c0ddc145b7db2c2d59369ae5f9-2338582345'
});

// PARA PRODUÇÃO, ALTERE PARA:
// const client = new MercadoPagoConfig({
//     accessToken: 'APP_USR-5024817526090385-041903-7e8220b36a3f8b6087fa59d420076b84-2338582345'
// });

app.post('/criar-pagamento', async (req, res) => {
    try {
        const { valor } = req.body;
        console.log("Recebido valor:", valor);

        if (!valor || valor <= 0) {
            return res.status(400).json({ erro: "Valor inválido" });
        }

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
                    excluded_payment_methods: [],
                    excluded_payment_types: [],
                    installments: 12 // Até 12 parcelas
                },
                back_urls: {
                    success: "http://localhost:3000/sucesso",
                    failure: "http://localhost:3000/falha",
                    pending: "http://localhost:3000/pendente"
                },
                auto_return: "approved"
            }
        });

        console.log("Preference criada:", response.init_point);
        res.json({
            link: response.init_point
        });

    } catch (erro) {
        console.error("ERRO:", erro);
        res.status(500).json({ erro: 'Erro ao criar pagamento' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});