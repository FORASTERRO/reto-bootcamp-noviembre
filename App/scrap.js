let scrapedData = []; // Almacena los datos extraídos

document.getElementById('btnScrap').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const port = chrome.tabs.connect(tab.id);
    port.postMessage({ action: 'scraping' });

    // Recibe los datos de `app.js`
    port.onMessage.addListener((msg) => {
        if (msg.action === 'scrapingComplete') {
            scrapedData = msg.data; // Guarda los datos
            document.getElementById('downloadJson').style.display = 'inline';
            document.getElementById('downloadCsv').style.display = 'inline';
            alert("Scraping completado. Puedes descargar los datos.");
        }
    });
});

// Función para descargar en JSON
document.getElementById('downloadJson').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(scrapedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productos.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Función para descargar en CSV
document.getElementById('downloadCsv').addEventListener('click', () => {
    const headers = Object.keys(scrapedData[0]).join(',') + '\n';
    const rows = scrapedData.map(item =>
        Object.values(item).map(value => `"${value}"`).join(',')
    ).join('\n');
    
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productos.csv';
    a.click();
    URL.revokeObjectURL(url);
});
