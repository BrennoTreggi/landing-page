// Espera o HTML carregar totalmente
document.addEventListener("DOMContentLoaded", () => {

    const links = document.querySelectorAll("nav a");
    const pages = document.querySelectorAll(".page");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const targetId = link.getAttribute("href").replace("#", "");
            
            // Remove active de todas
            pages.forEach(page => {
                page.classList.remove("active");
            });

            // Ativa a página clicada
            const targetPage = document.getElementById(targetId);
            targetPage.classList.add("active");
        });
    });

const btn = document.querySelector(".btn");

btn.addEventListener("click", () => {
    console.log("Usuário clicou no orçamento");
});

    // =========================
    // SCROLL SUAVE (extra controle)
    // =========================
    const linksInternos = document.querySelectorAll('a[href^="#"]');

    linksInternos.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const section = document.querySelector(targetId);

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });

    // =========================
    // FORMULÁRIO (ORÇAMENTO)
    // =========================
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
function calcularTotal() {
    let total = 0;

    document.querySelectorAll('.servico').forEach(servico => {
        const checkbox = servico.querySelector('input[type="checkbox"]');

        if (checkbox.checked) {
            const quantidade = parseInt(servico.querySelector('input[type="number"]').value) || 1;

            // Tabela de preços
            const nome = checkbox.parentElement.innerText.trim();

            let preco = 0;

            if (nome.includes("Layout")) preco = 300;
            else if (nome.includes("Banner")) preco = 50;
            else if (nome.includes("Diagramação")) preco = 5;
            else if (nome.includes("3D")) preco = 150;
            else preco = 100;

            total += preco * quantidade;
        }
    });

    return total;
}

async function pagarAgora() {
    const total = calcularTotal();

    if (total <= 0) {
        alert("Selecione pelo menos um serviço!");
        return;
    }

    const response = await fetch("http://localhost:3000/criar-pagamento", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ valor: total })
    });

    const data = await response.json();

    window.open(data.link, "_blank");
}
mercadopago.configure({
    access_token: 'SEAPP_USR-6307161791349576-041719-d63e4d48d6c64210c217dfccc521cc13-3344260680'
});

});