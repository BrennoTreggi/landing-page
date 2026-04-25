const express = require('express');
const cors = require('cors');
const path = require('path');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

const environment = (process.env.MERCADOPAGO_ENVIRONMENT || 'production').toLowerCase();

const sandboxAccessToken = process.env.MERCADOPAGO_TEST_ACCESS_TOKEN;
const sandboxPublicKey = process.env.MERCADOPAGO_PUBLIC_KEY_TEST;

const productionAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-SEU_TOKEN_AQUI';
const productionPublicKey = process.env.MERCADOPAGO_PUBLIC_KEY || 'APP_USR-SUA_PUBLIC_KEY_AQUI';

const accessToken = environment === 'production'
  ? productionAccessToken
  : sandboxAccessToken;

const publicKey = environment === 'production'
  ? productionPublicKey
  : sandboxPublicKey;

if (!accessToken) {
  throw new Error('Token do Mercado Pago não configurado.');
}

console.log(`Ambiente Mercado Pago: ${environment}`);

const client = new MercadoPagoConfig({
  accessToken
});

const preferenceClient = new Preference(client);

function getHeaders() {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'X-Idempotency-Key': uuidv4()
  };
}

async function makePaymentRequest(paymentData) {
  const response = await fetch('https://api.mercadopago.com/v1/payments', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(paymentData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
}

app.post('/criar-pagamento', async (req, res) => {
  try {
    const { valor } = req.body;

    if (!valor || Number(valor) <= 0) {
      return res.status(400).json({ erro: 'Valor inválido' });
    }

    const preferenceData = {
      items: [
        {
          title: 'Orçamento de Serviços',
          quantity: 1,
          unit_price: Number(valor),
          currency_id: 'BRL'
        }
      ],
      payer: {
        email: 'test_user_123456@testuser.com'
      },
      payment_methods: {
        installments: 12
      },
      back_urls: {
        success: 'https://brennotreggi.github.io/landing-page/',
        failure: 'https://brennotreggi.github.io/landing-page/',
        pending: 'https://brennotreggi.github.io/landing-page/'
      }
    };

    const response = await preferenceClient.create({ body: preferenceData });
    const checkoutLink = response.sandbox_init_point || response.init_point;

    return res.json({ link: checkoutLink });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao criar pagamento' });
  }
});

app.post('/process_payment', async (req, res) => {
  try {
    const {
      token,
      issuer_id,
      installments,
      cardholderName,
      identificationType,
      identificationNumber,
      email,
      paymentMethodId,
      transactionAmount
    } = req.body;

    const paymentData = {
      transaction_amount: parseFloat(transactionAmount),
      token,
      description: 'Orçamento de Serviços',
      installments: parseInt(installments) || 1,
      payment_method_id: paymentMethodId,
      payer: {
        email,
        identification: {
          type: identificationType,
          number: identificationNumber
        },
        first_name: cardholderName || 'Cliente'
      }
    };

    if (issuer_id) {
      paymentData.issuer_id = parseInt(issuer_id);
    }

    const payment = await makePaymentRequest(paymentData);

    return res.json({
      success: true,
      paymentId: payment.id,
      status: payment.status
    });
  } catch (erro) {
    console.error(erro);
    return res.status(400).json({ erro: 'Erro ao processar pagamento' });
  }
});

app.post('/process_payment_pix', async (req, res) => {
  try {
    const {
      email,
      transactionAmount,
      payerFirstName,
      payerLastName,
      identificationType,
      identificationNumber
    } = req.body;

    const paymentData = {
      transaction_amount: parseFloat(transactionAmount),
      description: 'Pagamento Pix',
      payment_method_id: 'pix',
      payer: {
        email,
        first_name: payerFirstName,
        last_name: payerLastName,
        identification: {
          type: identificationType,
          number: identificationNumber
        }
      }
    };

    const payment = await makePaymentRequest(paymentData);

    return res.json({
      success: true,
      paymentId: payment.id,
      qrCode: payment.point_of_interaction?.transaction_data?.qr_code,
      ticketUrl: payment.point_of_interaction?.transaction_data?.ticket_url
    });
  } catch (erro) {
    console.error(erro);
    return res.status(400).json({ erro: 'Erro no Pix' });
  }
});

app.post('/process_payment_boleto', async (req, res) => {
  try {
    const {
      email,
      transactionAmount,
      payerFirstName,
      payerLastName,
      identificationType,
      identificationNumber
    } = req.body;

    const paymentData = {
      transaction_amount: parseFloat(transactionAmount),
      description: 'Pagamento Boleto',
      payment_method_id: 'bolbradesco',
      payer: {
        email,
        first_name: payerFirstName,
        last_name: payerLastName,
        identification: {
          type: identificationType,
          number: identificationNumber
        }
      }
    };

    const payment = await makePaymentRequest(paymentData);

    return res.json({
      success: true,
      paymentId: payment.id,
      ticketUrl: payment.transaction_details?.external_resource_url
    });
  } catch (erro) {
    console.error(erro);
    return res.status(400).json({ erro: 'Erro no boleto' });
  }
});

app.get('/api/public-key', (req, res) => {
  res.json({ publicKey });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
