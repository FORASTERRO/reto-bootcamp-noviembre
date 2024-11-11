// Espera de manera asincrónica
const wait = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

// Función de scraping
const scrapeProducts = async () => {
    await wait(200);  // Espera para cargar la página

    const productSelector = {
        title: ".Product__title",
        vendor: ".Product__vendor",
        price: ".Product__currentPrice"
    };

    const productElements = document.querySelectorAll("div.product-grid>div> .Product__content");
    const products = Array.from(productElements).map(el => {
        const title = el.querySelector(productSelector.title)?.innerText || "Sin título";
        const vendor = el.querySelector(productSelector.vendor)?.innerText || "Sin vendedor";
        const price = el.querySelector(productSelector.price)?.innerText || "Sin precio";

        return { title, vendor, price };
    });

    console.log("Productos extraídos:", products);
    return products;
};

// Comunicación para iniciar el scraping
chrome.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(async msg => {
        if (msg.action === 'scraping') {
            const products = await scrapeProducts();
            
            // Envía los datos de vuelta al popup
            port.postMessage({ action: 'scrapingComplete', data: products });
        }
    });
});
