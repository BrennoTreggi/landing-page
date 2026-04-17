// Espera o HTML carregar totalmente
document.addEventListener("DOMContentLoaded", () => {

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
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
    let current = "";

    document.querySelectorAll("section").forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("ativo");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("ativo");
        }
    });
});