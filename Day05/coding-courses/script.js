document.addEventListener("DOMContentLoaded", () => {
    const enrollButtons = document.querySelectorAll(".enroll-btn");
    enrollButtons.forEach((button) => {
        button.addEventListener("click", () => {
            alert("Thank you for your interest! Redirecting to checkout...");
        });
    });
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            if (targetId.startsWith("#")) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({behavior: "smooth"});
                }
            }
        });
    });
});
