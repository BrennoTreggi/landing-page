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
        const quantidadeInput = servico.querySelector(".quantidade");

        if (!checkbox.checked) return;

        const key = checkbox.value; // importante: value no input
        const qtd = parseInt(quantidadeInput.value) || 0;

        let precoUnitario = 0;

        switch (key) {

            case 'layout':
                precoUnitario = qtd === 1 ? 700 : 500;
                break;

            case 'animacao':
            case 'video':
                // aqui você está usando quantidade como segundos
                precoUnitario = qtd <= 30 ? 150 : 100;
                break;

            case 'restauracao':
                precoUnitario = qtd === 1 ? 120 : 100;
                break;

            case 'modelagem3d':
                precoUnitario = qtd === 1 ? 200 : 150;
                break;

            case 'reparo3d':
                precoUnitario = qtd === 1 ? 150 : 120;
                break;

            case 'render':
                precoUnitario = qtd === 1 ? 200 : 150;
                break;

            case 'diagramacao':
                if (qtd >= 15 && qtd <= 20) precoUnitario = 6.5;
                else if (qtd <= 30) precoUnitario = 5.3;
                else if (qtd <= 80) precoUnitario = 4.7;
                else if (qtd <= 120) precoUnitario = 3.7;
                break;

            case 'imagem':
                precoUnitario = 30;
                break;

            case 'cartao':
                precoUnitario = 80;
                break;

            case 'panfleto':
                precoUnitario = 100;
                break;

            case 'folder':
                precoUnitario = 120;
                break;

            case 'banner':
                precoUnitario = 150;
                break;
        }

        total += qtd * precoUnitario;
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

// EXECUTA QUANDO CARREGA
document.addEventListener("DOMContentLoaded", () => {

    // EVENTO DE CÁLCULO
    document.querySelectorAll(".servico input").forEach(input => {
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