const precos = {
    layout: 500,
    video: 300
};

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

async function pagarAgora() {
    const total = calcularTotal();

    if (total <= 0) {
        alert("Selecione um serviço!");
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

document.addEventListener("DOMContentLoaded", () => {

    // CALCULAR
    document.querySelectorAll(".servico input").forEach(input => {
        input.addEventListener("input", calcularTotal);
    });

    // DETALHES
    document.querySelectorAll(".servico").forEach(servico => {
        const checkbox = servico.querySelector("input[type='checkbox']");
        const detalhes = servico.querySelector(".detalhes");

        detalhes.style.display = "none";

        checkbox.addEventListener("change", () => {
            detalhes.style.display = checkbox.checked ? "block" : "none";
            calcularTotal();
        });
    });

    // SPA
    const links = document.querySelectorAll("nav a");
    const pages = document.querySelectorAll(".page");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const id = link.getAttribute("href").replace("#", "");

            pages.forEach(p => p.classList.remove("active"));
            document.getElementById(id).classList.add("active");
        });
    });

});