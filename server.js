


const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');

const app = express(); // 🔥 ESSA LINHA É OBRIGATÓRIA
app.use(express.json());
app.use(cors());

const client = new MercadoPagoConfig({
    accessToken: 'TEST-5024817526090385-041903-496668c0ddc145b7db2c2d59369ae5f9-2338582345'
});

const payment = new Payment(client);

app.post('/pagar-pix', async (req, res) => {
    try {
        const { valor } = req.body;

        if (!valor || valor <= 0) {
            return res.status(400).json({ erro: "Valor inválido" });
        }

        const pagamento = await payment.create({
            body: {
                transaction_amount: Number(valor),
                description: "Pagamento via PIX",
                payment_method_id: "pix",

                payer: {
                    email: "brennotreggi3@hotmail.com",
                    first_name: "Teste",
                    last_name: "Teste",
                    identification: {
                        type: "CPF",
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

async function pagarPix() {

    document.getElementById("pix-area").classList.remove("hidden");
    document.getElementById("boleto-area").classList.add("hidden");

    const total = calcularTotal();

    if (!total || total <= 0) {
        alert("Selecione pelo menos um serviço!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/pagar-pix", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ valor: total })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            alert("Erro ao gerar pagamento");
            return;
        }

        document.getElementById('qrcode').src =
            "data:image/png;base64," + data.qr_code_base64;

        document.getElementById('pixCode').value = data.qr_code;

    } catch (error) {
        alert("Erro ao conectar com servidor");
        console.error(error);
    }
}

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});