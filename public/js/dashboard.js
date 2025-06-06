document.addEventListener('DOMContentLoaded', () => {
  const authToken = localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType');

  const dom = {
    sidebar: {
      name: document.getElementById('artisan-name-sidebar'),
      role: document.getElementById('artisan-role-sidebar'),
      image: document.getElementById('artisan-image-sidebar')
    },
    stats: {
      totalSales: document.getElementById('stats-total-sales'),
      totalSalesPct: document.getElementById('stats-total-sales-percentage'),
      productsSold: document.getElementById('stats-products-sold'),
      productsSoldPct: document.getElementById('stats-products-sold-percentage'),
      activeListings: document.getElementById('stats-active-listings'),
      activeListingsPct: document.getElementById('stats-active-listings-percentage')
    },
    salesPerformance: {
      value: document.getElementById('sales-over-time-value'),
      period: document.getElementById('sales-over-time-period'),
      pct: document.getElementById('sales-over-time-percentage')
    },
    productTableBody: document.getElementById('dashboard-product-table-tbody'),
    mainContentArea: document.querySelector('.layout-content-container.flex-1')
  };

  // --- Redirect non-authorized users ---
  if (!authToken) return (window.location.href = 'login.html');
  if (userType !== 'artisan') return renderAccessDenied();

  // --- Init dashboard ---
  fetchAndRenderProfile();
  fetchAndRenderStats();
  fetchAndRenderSalesPerformance();
  fetchAndRenderProducts();

  // ---------------------- //
  // --- Helper Methods --- //
  // ---------------------- //

  function renderAccessDenied() {
    if (dom.mainContentArea) {
      dom.mainContentArea.innerHTML = `
        <div class="p-8 text-center">
          <h1 class="text-2xl font-bold mb-4">Accesso Negato</h1>
          <p class="text-gray-600">Questo cruscotto è riservato agli utenti artigiani.</p>
          <a href="index.html" class="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Vai alla Home</a>
        </div>`;
    }
    if (dom.sidebar.name) dom.sidebar.name.textContent = 'Utente';
    if (dom.sidebar.role) dom.sidebar.role.textContent = 'Vista Cliente';
    if (dom.sidebar.image) dom.sidebar.image.style.backgroundImage = 'url("default-user-image.png")';
  }

  function formatPercentage(element, value) {
    if (!element) return;
    const parsed = parseFloat(value);
    const isNumeric = !isNaN(parsed);
    const finalValue = isNumeric ? `${parsed >= 0 ? '+' : ''}${parsed.toFixed(0)}%` : value;

    element.textContent = finalValue;
    element.classList.remove('text-[#078807]', 'text-[#e70808]');

    if (finalValue.startsWith('+')) element.classList.add('text-[#078807]');
    else if (finalValue.startsWith('-')) element.classList.add('text-[#e70808]');
  }

  function fetchAndRenderProfile() {
    fetch('/api/artisan/profile', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
        .then(res => res.ok ? res.json() : Promise.reject('Impossibile caricare il profilo'))
        .then(profile => {
          if (dom.sidebar.name) dom.sidebar.name.textContent = profile.fullName || 'Artigiano';
          if (dom.sidebar.image && profile.imageUrl) {
            dom.sidebar.image.style.backgroundImage = `url('${profile.imageUrl}')`;
          }
        })
        .catch(err => console.error('Errore nel caricamento del profilo:', err));
  }

  function fetchAndRenderStats() {
    fetch('/api/artisan/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
        .then(res => res.ok ? res.json() : Promise.reject('Impossibile caricare le statistiche'))
        .then(stats => {
          dom.stats.totalSales.textContent = `$${(stats.totalSales || 0).toLocaleString()}`;
          formatPercentage(dom.stats.totalSalesPct, stats.totalSalesChange || 0);

          dom.stats.productsSold.textContent = (stats.productsSold || 0).toLocaleString();
          formatPercentage(dom.stats.productsSoldPct, stats.productsSoldChange || 0);

          dom.stats.activeListings.textContent = (stats.activeListings || 0).toLocaleString();
          formatPercentage(dom.stats.activeListingsPct, stats.activeListingsChange || 0);
        })
        .catch(err => {
          console.error('Errore nelle statistiche:', err);
          dom.stats.totalSales.textContent = 'Errore';
        });
  }

  function fetchAndRenderSalesPerformance() {
    fetch('/api/artisan/dashboard/sales-performance', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
        .then(res => res.ok ? res.json() : Promise.reject('Impossibile caricare le performance di vendita'))
        .then(data => {
          dom.salesPerformance.value.textContent = `$${(data.salesOverTimeValue || 0).toLocaleString()}`;
          dom.salesPerformance.period.textContent = data.salesOverTimePeriod || 'Ultimi 30 Giorni';
          formatPercentage(dom.salesPerformance.pct, data.salesOverTimeChange || 0);
        })
        .catch(err => {
          console.error('Errore nelle performance di vendita:', err);
          dom.salesPerformance.value.textContent = 'Errore';
        });
  }

  function fetchAndRenderProducts() {
    fetch('/api/artisan/products?limit=5', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
        .then(res => res.ok ? res.json() : Promise.reject('Impossibile caricare i prodotti'))
        .then(products => {
          const tbody = dom.productTableBody;
          if (!tbody) return;

          tbody.innerHTML = '';
          if (!products || products.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">Nessun prodotto da mostrare.</td></tr>`;
            return;
          }

          products.forEach(product => {
            const tr = document.createElement('tr');
            tr.className = 'border-t border-t-[#e0e0e0]';
            tr.innerHTML = `
          <td class="h-[72px] px-4 py-2 w-[400px] text-[#141414] text-sm">${product.name || 'N/D'}</td>
          <td class="h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm">${product.stock ?? 'N/D'}</td>
          <td class="h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm">$${(product.price || 0).toFixed(2)}</td>
          <td class="h-[72px] px-4 py-2 w-60 text-sm">
            <button class="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-full h-8 px-4 bg-[#f2f2f2] text-[#141414] text-sm">
              <span class="truncate">${product.status || 'N/D'}</span>
            </button>
          </td>
          <td class="h-[72px] px-4 py-2 w-60 text-[#757575] text-sm font-bold tracking-[0.015em]">
            <a href="aggiungiProdotto.html?productId=${product.id || ''}" class="hover:underline">Modifica</a>
          </td>`;
            tbody.appendChild(tr);
          });
        })
        .catch(err => {
          console.error('Errore nel caricamento prodotti:', err);
          if (dom.productTableBody)
            dom.productTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">Errore nel caricamento dei prodotti.</td></tr>`;
        });
  }
});
