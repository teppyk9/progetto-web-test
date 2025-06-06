document.addEventListener('DOMContentLoaded', () => {
  let artisanProducts = [];

  const searchInput = document.getElementById('artisan-product-search-input');
  const stockAlertsTbody = document.getElementById('stock-alerts-tbody');
  const allProductsTbody = document.getElementById('all-products-tbody');

  // --- Fetch Artisan's Products ---
  if (stockAlertsTbody && allProductsTbody) {
    fetch('/api/artisan/products') // Supponendo che questo endpoint ritorni i prodotti dell'artigiano loggato
        .then(response => {
          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Non autorizzato: effettua il login.');
            }
            throw new Error(`Errore HTTP! stato: ${response.status}`);
          }
          return response.json();
        })
        .then(products => {
          artisanProducts = products;
          renderAllProductsTable(artisanProducts);
          renderStockAlertsTable(artisanProducts);
        })
        .catch(error => {
          console.error('Errore nel caricamento dei prodotti dell\'artigiano:', error);
          if (allProductsTbody) {
            allProductsTbody.innerHTML = `<tr><td colspan="4" class="text-red-500 p-4 text-center">${error.message || 'Impossibile caricare i prodotti.'}</td></tr>`;
          }
          if (stockAlertsTbody) {
            stockAlertsTbody.innerHTML = `<tr><td colspan="3" class="text-red-500 p-4 text-center">${error.message || 'Impossibile caricare gli avvisi di stock.'}</td></tr>`;
          }
        });
  } else {
    console.warn('Elementi necessari per le tabelle non trovati.');
  }

  // --- Funzione per renderizzare la tabella di tutti i prodotti ---
  function renderAllProductsTable(productsToRender) {
    if (!allProductsTbody) {
      console.warn('Corpo tabella "tutti i prodotti" non trovato per il rendering.');
      return;
    }
    allProductsTbody.innerHTML = ''; // Pulisce i prodotti esistenti

    if (productsToRender.length === 0) {
      allProductsTbody.innerHTML = '<tr><td colspan="4" class="text-gray-500 p-4 text-center">Nessun prodotto trovato.</td></tr>';
      return;
    }

    productsToRender.forEach(product => {
      const tr = document.createElement('tr');
      tr.className = 'border-t border-t-[#e0e0e0]';

      // Nome prodotto
      const tdName = document.createElement('td');
      tdName.className = 'h-[72px] px-4 py-2 w-[400px] text-[#141414] text-sm font-normal leading-normal';
      tdName.textContent = product.name || 'N/D';
      tr.appendChild(tdName);

      // Stock
      const tdStock = document.createElement('td');
      tdStock.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdStock.textContent = product.stock !== undefined ? product.stock : 'N/D';
      tr.appendChild(tdStock);

      // Prezzo
      const tdPrice = document.createElement('td');
      tdPrice.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdPrice.textContent = product.price !== undefined ? `€${product.price}` : 'N/D';
      tr.appendChild(tdPrice);

      // Stato
      const tdStatus = document.createElement('td');
      tdStatus.className = 'h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal';
      const statusButton = document.createElement('button');
      statusButton.className = 'flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#f2f2f2] text-[#141414] text-sm font-medium leading-normal w-full';
      const statusSpan = document.createElement('span');
      statusSpan.className = 'truncate';
      statusSpan.textContent = product.status || 'N/D';
      statusButton.appendChild(statusSpan);
      tdStatus.appendChild(statusButton);
      tr.appendChild(tdStatus);

      allProductsTbody.appendChild(tr);
    });
  }

  // --- Funzione per renderizzare la tabella degli avvisi di stock ---
  function renderStockAlertsTable(products) {
    if (!stockAlertsTbody) {
      console.warn('Corpo tabella "avvisi stock" non trovato per il rendering.');
      return;
    }
    stockAlertsTbody.innerHTML = ''; // Pulisce gli avvisi esistenti

    const productsNeedingAlert = products.filter(p => p.stock !== undefined && p.alertThreshold !== undefined && p.stock < p.alertThreshold);

    if (productsNeedingAlert.length === 0) {
      stockAlertsTbody.innerHTML = '<tr><td colspan="3" class="text-gray-500 p-4 text-center">Nessun avviso di stock.</td></tr>';
      return;
    }

    productsNeedingAlert.forEach(product => {
      const tr = document.createElement('tr');
      tr.className = 'border-t border-t-[#e0e0e0]';

      // Nome prodotto
      const tdName = document.createElement('td');
      tdName.className = 'h-[72px] px-4 py-2 w-[400px] text-[#141414] text-sm font-normal leading-normal';
      tdName.textContent = product.name || 'N/D';
      tr.appendChild(tdName);

      // Stock
      const tdStock = document.createElement('td');
      tdStock.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdStock.textContent = product.stock;
      tr.appendChild(tdStock);

      // Soglia di avviso
      const tdThreshold = document.createElement('td');
      tdThreshold.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdThreshold.textContent = product.alertThreshold;
      tr.appendChild(tdThreshold);

      stockAlertsTbody.appendChild(tr);
    });
  }

  // --- Funzionalità di ricerca ---
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const searchTerm = event.target.value.toLowerCase();
      const filteredProducts = artisanProducts.filter(product =>
          product.name && product.name.toLowerCase().includes(searchTerm)
      );
      renderAllProductsTable(filteredProducts);
      // Facoltativo: filtrare e renderizzare anche gli avvisi stock se la ricerca deve applicarsi anche lì.
      // Per ora, la ricerca si applica solo alla tabella "Tutti i prodotti".
      // renderStockAlertsTable(filteredProducts); // Decommenta se la ricerca deve filtrare anche gli avvisi di stock
    });
  } else {
    console.warn('Input di ricerca per prodotti artigiano non trovato.');
  }
});
