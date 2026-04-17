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
    // EFEITO AO ROLAR (animação)
    // =========================
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("ativo");
            }
        });
    }, {
        threshold: 0.2
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // =========================
    // FORMULÁRIO (CONTATO/ORÇAMENTO)
    // =========================
    const form = document.querySelector("form");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            alert("Mensagem enviada com sucesso! 🚀");

            form.reset();
        });
    }

});