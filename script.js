
document.querySelectorAll('.headline-word').forEach(word => {
    const english = word.textContent.trim();
    const hindi = word.dataset.hi;

    word.innerHTML = `
        <span class="word-face word-en">${english}</span>
        <span class="word-face word-hi">${hindi}</span>
    `;

    word.addEventListener('mouseenter', () => {
        word.classList.add('is-hindi');
    });

    word.addEventListener('mouseleave', () => {
        word.classList.remove('is-hindi');
    });

    word.addEventListener('click', () => {
        word.classList.toggle('is-hindi');
    });

    word.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            word.classList.toggle('is-hindi');
        }
    });

    word.setAttribute('tabindex', '0');
});
