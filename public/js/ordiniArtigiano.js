document.addEventListener('DOMContentLoaded', () => {
  let artisanOrders = [];
  let currentArtisanOrderFilter = 'All'; // Filtro iniziale

  const ordersTbody = document.getElementById('artisan-orders-tbody');
  const filterAllTab = document.getElementById('filter-artisan-orders-all');
  const filterPendingTab = document.getElementById('filter-artisan-orders-pending');
  const filterShippedTab = document.getElementById('filter-artisan-orders-shipped');
  const filterDeliveredTab = document.getElementById('filter-artisan-orders-delivered');
  const filterCancelledTab = document.getElementById('filter-artisan-orders-cancelled');

  const filterTabs = [
    { el: filterAllTab, name: 'All' },
    { el: filterPendingTab, name: 'Pending' },
    { el: filterShippedTab, name: 'Shipped' },
    { el: filterDeliveredTab, name: 'Delivered' },
    { el: filterCancelledTab, name: 'Cancelled' },
  ];

  // --- Recupera gli ordini dell'artigiano ---
  if (ordersTbody) {
    fetch('/api/artisan/orders')
        .then(response => {
          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Non autorizzato: effettua il login per vedere i tuoi ordini.');
            }
            throw new Error(`Errore HTTP! stato: ${response.status}`);
          }
          return response.json();
        })
        .then(orders => {
          artisanOrders = orders;
          renderArtisanOrders(); // Render iniziale con filtro 'All'
          updateActiveTabStyle();
        })
        .catch(error => {
          console.error('Errore nel caricamento degli ordini artigiano:', error);
          ordersTbody.innerHTML = `<tr><td colspan="5" class="text-red-500 p-4 text-center">${error.message || 'Impossibile caricare i tuoi ordini.'}</td></tr>`;
        });
  } else {
    console.warn('Corpo tabella ordini artigiano non trovato.');
  }

  // --- Funzione per renderizzare gli ordini artigiano ---
  function renderArtisanOrders() {
    if (!ordersTbody) {
      console.warn('Corpo tabella ordini artigiano non trovato per il rendering.');
      return;
    }
    ordersTbody.innerHTML = ''; // Pulisce le righe esistenti

    let filteredOrders = artisanOrders;
    if (currentArtisanOrderFilter !== 'All') {
      filteredOrders = artisanOrders.filter(order =>
          order.status && order.status.toLowerCase() === currentArtisanOrderFilter.toLowerCase()
      );
    }

    if (filteredOrders.length === 0) {
      ordersTbody.innerHTML = `<tr><td colspan="5" class="text-gray-500 p-4 text-center">Nessun ordine trovato per questo filtro.</td></tr>`;
      return;
    }

    filteredOrders.forEach(order => {
      const tr = document.createElement('tr');
      tr.className = 'border-t border-t-[#e0e0e0]';

      // ID Ordine
      const tdOrderId = document.createElement('td');
      tdOrderId.className = 'h-[72px] px-4 py-2 w-[400px] text-[#141414] text-sm font-normal leading-normal';
      tdOrderId.textContent = order.orderId || 'N/D';
      tr.appendChild(tdOrderId);

      // Data
      const tdDate = document.createElement('td');
      tdDate.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdDate.textContent = order.date ? new Date(order.date).toLocaleDateString() : 'N/D';
      tr.appendChild(tdDate);

      // Cliente
      const tdCustomer = document.createElement('td');
      tdCustomer.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdCustomer.textContent = order.customerName || (order.customer && order.customer.name) || 'N/D';
      tr.appendChild(tdCustomer);

      // Stato
      const tdStatus = document.createElement('td');
      tdStatus.className = 'h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal';
      const statusButton = document.createElement('button');
      // Nota: le classi Tailwind per il pulsante possono necessitare aggiustamenti se troppo generiche
      // o se serve uno stile specifico per ogni stato in futuro.
      statusButton.className = 'flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#f2f2f2] text-[#141414] text-sm font-medium leading-normal w-full';
      const statusSpan = document.createElement('span');
      statusSpan.className = 'truncate';
      statusSpan.textContent = order.status || 'N/D';
      statusButton.appendChild(statusSpan);
      tdStatus.appendChild(statusButton);
      tr.appendChild(tdStatus);

      // Azioni
      const tdActions = document.createElement('td');
      tdActions.className = 'h-[72px] px-4 py-2 w-60 text-[#757575] text-sm font-bold leading-normal tracking-[0.015em]';
      const viewDetailsLink = document.createElement('a');
      viewDetailsLink.href = `dettaglioOrdineArtigiano.html?orderId=${encodeURIComponent(order.orderId)}`;
      viewDetailsLink.textContent = 'Visualizza dettagli';
      // Applicare stile link se necessario, es. viewDetailsLink.className = 'text-blue-600 hover:underline';
      tdActions.appendChild(viewDetailsLink);
      tr.appendChild(tdActions);

      ordersTbody.appendChild(tr);
    });
  }

  // --- Aggiorna lo stile della tab attiva ---
  function updateActiveTabStyle() {
    filterTabs.forEach(tabInfo => {
      if (tabInfo.el) {
        const pElement = tabInfo.el.querySelector('p');
        if (tabInfo.name.toLowerCase() === currentArtisanOrderFilter.toLowerCase()) {
          tabInfo.el.classList.remove('border-b-transparent', 'text-[#757575]');
          tabInfo.el.classList.add('border-b-[#141414]', 'text-[#141414]');
          if (pElement) {
            pElement.classList.remove('text-[#757575]');
            pElement.classList.add('text-[#141414]');
          }
        } else {
          tabInfo.el.classList.remove('border-b-[#141414]', 'text-[#141414]');
          tabInfo.el.classList.add('border-b-transparent', 'text-[#757575]');
          if (pElement) {
            pElement.classList.remove('text-[#141414]');
            pElement.classList.add('text-[#757575]');
          }
        }
      }
    });
  }

  // --- Logica filtro tab ---
  filterTabs.forEach(tabInfo => {
    if (tabInfo.el) {
      tabInfo.el.addEventListener('click', (event) => {
        // Previeni default per href="#" ma non per link reali come la tab "All"
        if (tabInfo.el.getAttribute('href') === '#') {
          event.preventDefault();
        }
        currentArtisanOrderFilter = tabInfo.name;
        renderArtisanOrders();
        updateActiveTabStyle();
      });
    } else {
      console.warn(`Elemento tab filtro per '${tabInfo.name}' non trovato.`);
    }
  });

  // Imposta lo stile della tab attiva iniziale (di default dovrebbe essere 'All')
  updateActiveTabStyle();
});
