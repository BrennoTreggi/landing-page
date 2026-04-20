


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

app.get('/sucesso', (req, res) => {
    res.send('<h1>Pagamento aprovado</h1><p>Obrigado! Seu pagamento foi processado com sucesso.</p>');
});

app.get('/falha', (req, res) => {
    res.send('<h1>Pagamento não aprovado</h1><p>O pagamento não foi concluído. Tente novamente.</p>');
});

app.get('/pendente', (req, res) => {
    res.send('<h1>Pagamento pendente</h1><p>O pagamento está pendente. Aguarde a confirmação.</p>');
});


 const client = new MercadoPagoConfig({
     accessToken: 'TEST-5024817526090385-041920-dee4861a531f0efb31218164e8c3fe54-2338582345'
 });


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
                }
            }
        });

        console.log("Preference criada:", response.init_point);
        res.json({
            link: response.init_point
        });

    } catch (erro) {
        console.error("ERRO DETALHADO:", erro.message || erro);
        if (erro.response) {
            console.error("Resposta MP:", erro.response.data);
        }
        res.status(500).json({ erro: 'Erro ao criar pagamento', detalhes: erro.message });
    }
});

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});