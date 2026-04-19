const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

// 🔑 SEU TOKEN DE TESTE (depois trocamos para produção)
const client = new MercadoPagoConfig({
    accessToken: 'TEST-5024817526090385-041903-496668c0ddc145b7db2c2d59369ae5f9-2338582345'
});

// 🚀 ROTA PIX
app.post('/pagar-pix', async (req, res) => {
    try {
        const { valor } = req.body;

        console.log("VALOR RECEBIDO:", valor); // debug

        const payment = new Payment(client);

        const result = await payment.create({
            body: {
                transaction_amount: Number(valor),
                description: 'Pagamento de serviços',
                payment_method_id: 'pix',
                payer: {
                    email: 'teste@email.com'
                }
            }
        });

        console.log("RESPOSTA MP:", result); // debug importante

        if (!result.point_of_interaction) {
            return res.status(500).json({
                erro: "PIX não retornado",
                detalhe: result
            });
        }

        res.json({
            qr_code: result.point_of_interaction.transaction_data.qr_code,
            qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64
        });

    } catch (erro) {
        console.error("ERRO COMPLETO:", erro);
        res.status(500).json({ erro: 'Erro ao gerar PIX' });
    }
});