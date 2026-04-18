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
            total += valor * (parseInt(quantidade.value) || 1);
        }
    });

    document.getElementById("total").innerText = total.toFixed(2);
    return total;
}

document.querySelectorAll(".servico").forEach(servico => {
    const checkbox = servico.querySelector("input[type='checkbox']");
    const detalhes = servico.querySelector(".detalhes");

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            detalhes.style.display = "block";
        } else {
            detalhes.style.display = "none";
        }
    });
});

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