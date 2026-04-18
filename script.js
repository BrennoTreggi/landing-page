document.addEventListener("DOMContentLoaded", () => {

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

    // 🔥 EVENTOS CORRETOS
    document.querySelectorAll(".servico input").forEach(input => {
        input.addEventListener("input", calcularTotal);
    });

});

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

            // Adiciona na página clicada
            document.getElementById(targetId).classList.add("active");
        });
    });


    // SCROLL SUAVE
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();

            const section = document.querySelector(this.getAttribute("href"));

            
            });
        });
    });



// CALCULAR TOTAL
function calcularTotal() {
    let total = 0;

    document.querySelectorAll('.servico').forEach(servico => {
        const checkbox = servico.querySelector('input[type="checkbox"]');

        if (checkbox.checked) {
            const quantidade = parseInt(servico.querySelector('input[type="number"]').value) || 1;
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