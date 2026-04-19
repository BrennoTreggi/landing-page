const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

const client = new MercadoPagoConfig({
    accessToken: 'TEST-5024817526090385-041903-496668c0ddc145b7db2c2d59369ae5f9-2338582345'
});

// 🔥 FALTOU ISSO AQUI
const payment = new Payment(client);

app.post('/pagar-pix', async (req, res) => {
    try {
        const { valor } = req.body;

        // 🚨 validação importante
        if (!valor || valor <= 0) {
            return res.status(400).json({ erro: "Valor inválido" });
        }

        const pagamento = await payment.create({
            body: {
                transaction_amount: Number(valor),
                description: "Pagamento via PIX",
                payment_method_id: "pix",

                payer: {
                    email: "test_user_8363282714826584978@testuser.com",
                    first_name: "Teste",
                    last_name: "Teste",
                    identification: {
                        type: "CPF", // ✅ CORRIGIDO
                        number: "12345678909"
                    }
                }
            }
        });

        console.log("RESPOSTA MP:", pagamento);

        res.json({
            qr_code: pagamento.point_of_interaction.transaction_data.qr_code,
            qr_code_base64: pagamento.point_of_interaction.transaction_data.qr_code_base64
        });

    } catch (erro) {
        console.error("ERRO REAL:", erro);
        res.status(500).json({ erro });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});