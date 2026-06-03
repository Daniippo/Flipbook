async function loadFlipbooksList() {
    const response = await fetch('./data/flipbooks.json');
    if (!response.ok) throw new Error('Impossibile caricare il catalogo');
    return await response.json();
}

async function initApp() {
    try {
        const catalog = await loadFlipbooksList();
        const container = document.getElementById('flipbooks-container');
        const loading = document.getElementById('loading');

        loading.style.display = 'none';

        if (!catalog.flipbooks || catalog.flipbooks.length === 0) {
            const errorDiv = document.getElementById('error');
            errorDiv.textContent = 'Nessun flipbook disponibile al momento.';
            errorDiv.style.display = 'block';
            return;
        }

        catalog.flipbooks.forEach(flipbook => {
            const card = document.createElement('a');
            card.href = `viewer.html?id=${flipbook.id}`;
            card.className = 'flipbook-card';
            
            const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22200%22%3E%3Crect fill=%22%23e8ebed%22 width=%22280%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-family=%22Arial%22 font-size=%2214%22%3ECopertina non disponibile%3C/text%3E%3C/svg%3E`;
            
            card.innerHTML = `
                <img src="${flipbook.copertina}" alt="${flipbook.titolo}" class="flipbook-thumb" onerror="this.src='${placeholderSvg}'">
                <div class="flipbook-info">
                    <div class="flipbook-title">${flipbook.titolo}</div>
                    <div class="flipbook-desc">${flipbook.descrizione}</div>
                    <div class="flipbook-meta">
                        <span>📄 ${flipbook.pagine} pagine</span>
                        <span>${new Date(flipbook.data_creazione).toLocaleDateString('it-IT')}</span>
                    </div>
                    <button class="btn-open">Apri Flipbook →</button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (e) {
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = `Errore: ${e.message}`;
        errorDiv.style.display = 'block';
        document.getElementById('loading').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', initApp);
