const precos = {
    layout: 500,
    animacao: 200,
    video: 300,
    restauracao: 50,
    modelagem3d: 150,
    render: 100,
    diagramacao: 5,
    imagem: 80,
    cartao: 0.5,
    panfleto: 0.3,
    folder: 1,
    banner: 50
};

// CALCULAR TOTAL
function calcularTotal() {
    let total = 0;

    document.querySelectorAll(".servico").forEach(servico => {
        const checkbox = servico.querySelector("input[type='checkbox']");
        const quantidade = servico.querySelector(".quantidade");

        if (checkbox.checked) {
            const valor = precos[checkbox.value] || 0;
            const qtd = parseInt(quantidade.value) || 1;
            total += valor * qtd;
        }
    });

    document.getElementById("total").innerText = total.toFixed(2);
    return total;
}

// PAGAMENTO
async function pagarAgora() {
    const total = calcularTotal();

    if (total <= 0) {
        alert("Selecione pelo menos um serviço!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/criar-pagamento", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ valor: total })
        });

        const data = await response.json();

        if (data.link) {
            window.open(data.link, "_blank");
        } else {
            alert("Erro ao gerar pagamento!");
        }

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao conectar com o servidor!");
    }
}

// EXECUTA TUDO DEPOIS QUE CARREGAR
document.addEventListener("DOMContentLoaded", () => {

    // ATIVAR INPUTS E DETALHES
    document.querySelectorAll(".servico").forEach(servico => {
        const checkbox = servico.querySelector("input[type='checkbox']");
        const detalhes = servico.querySelector(".detalhes");

        // começa escondido
        detalhes.style.display = "none";

        checkbox.addEventListener("change", () => {
            detalhes.style.display = checkbox.checked ? "block" : "none";
            calcularTotal();
        });
    });

    // EVENTO DE CÁLCULO (quantidade)
    document.querySelectorAll(".quantidade").forEach(input => {
        input.addEventListener("input", calcularTotal);
    });

    // NAVEGAÇÃO SPA
    const links = document.querySelectorAll("nav a");
    const pages = document.querySelectorAll(".page");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const targetId = link.getAttribute("href").replace("#", "");

            pages.forEach(page => page.classList.remove("active"));
            document.getElementById(targetId).classList.add("active");
        });
    });

});