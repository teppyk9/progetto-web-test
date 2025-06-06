document.addEventListener('DOMContentLoaded', () => {
  let userOrders = [];
  let currentFilter = 'All'; // Filtro iniziale

  const ordersTbody = document.getElementById('user-orders-tbody');
  const filterAllTab = document.getElementById('filter-orders-all');
  const filterActiveTab = document.getElementById('filter-orders-active');
  const filterCompletedTab = document.getElementById('filter-orders-completed');

  const activeOrderStatuses = ["Processing", "Shipped", "Pending"]; // Definizione ordini attivi
  const completedOrderStatuses = ["Delivered"]; // Definizione ordini completati

  // --- Recupera gli ordini dell'utente ---
  if (ordersTbody) {
    fetch('/api/user/orders')
        .then(response => {
          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Non autorizzato: accedi per visualizzare i tuoi ordini.');
            }
            throw new Error(`Errore HTTP! stato: ${response.status}`);
          }
          return response.json();
        })
        .then(orders => {
          userOrders = orders;
          renderOrders(); // Primo render con filtro 'All'
          updateActiveTabStyle();
        })
        .catch(error => {
          console.error('Errore nel recupero degli ordini:', error);
          ordersTbody.innerHTML = `<tr><td colspan="4" class="text-red-500 p-4 text-center">${error.message || 'Impossibile caricare i tuoi ordini.'}</td></tr>`;
        });
  } else {
    console.warn('Corpo tabella ordini utente non trovato.');
  }

  // --- Funzione per il rendering degli ordini ---
  function renderOrders() {
    if (!ordersTbody) {
      console.warn('Corpo tabella ordini utente non trovato per il rendering.');
      return;
    }
    ordersTbody.innerHTML = ''; // Pulisce le righe esistenti

    let filteredOrders = userOrders;
    if (currentFilter === 'Active') {
      filteredOrders = userOrders.filter(order => activeOrderStatuses.includes(order.status));
    } else if (currentFilter === 'Completed') {
      filteredOrders = userOrders.filter(order => completedOrderStatuses.includes(order.status));
    }

    if (filteredOrders.length === 0) {
      ordersTbody.innerHTML = `<tr><td colspan="4" class="text-gray-500 p-4 text-center">Nessun ordine trovato per questo filtro.</td></tr>`;
      return;
    }

    filteredOrders.forEach(order => {
      const tr = document.createElement('tr');
      tr.className = 'border-t border-t-[#e0e0e0]';

      // ID ordine
      const tdOrderId = document.createElement('td');
      tdOrderId.className = 'h-[72px] px-4 py-2 w-[400px] text-[#141414] text-sm font-normal leading-normal';
      tdOrderId.textContent = order.orderId || 'N/D';
      tr.appendChild(tdOrderId);

      // Data
      const tdDate = document.createElement('td');
      tdDate.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdDate.textContent = order.date ? new Date(order.date).toLocaleDateString() : 'N/D';
      tr.appendChild(tdDate);

      // Stato
      const tdStatus = document.createElement('td');
      tdStatus.className = 'h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal';
      const statusButton = document.createElement('button');
      statusButton.className = 'flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f2f2f2] text-[#141414] text-sm font-medium leading-normal w-full';
      const statusSpan = document.createElement('span');
      statusSpan.className = 'truncate';
      statusSpan.textContent = order.status || 'N/D';
      statusButton.appendChild(statusSpan);
      tdStatus.appendChild(statusButton);
      tr.appendChild(tdStatus);

      // Totale
      const tdTotal = document.createElement('td');
      tdTotal.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdTotal.textContent = order.total !== undefined ? `€${order.total.toFixed(2)}` : 'N/D';
      tr.appendChild(tdTotal);

      ordersTbody.appendChild(tr);
    });
  }

  // --- Aggiorna lo stile delle tab ---
  function updateActiveTabStyle() {
    const tabs = [filterAllTab, filterActiveTab, filterCompletedTab];
    tabs.forEach(tab => {
      if (tab) {
        const pElement = tab.querySelector('p');
        if (tab.id === `filter-orders-${currentFilter.toLowerCase()}`) {
          tab.classList.remove('border-b-transparent', 'text-[#757575]');
          tab.classList.add('border-b-[#141414]', 'text-[#141414]');
          if (pElement) {
            pElement.classList.remove('text-[#757575]');
            pElement.classList.add('text-[#141414]');
          }
        } else {
          tab.classList.remove('border-b-[#141414]', 'text-[#141414]');
          tab.classList.add('border-b-transparent', 'text-[#757575]');
          if (pElement) {
            pElement.classList.remove('text-[#141414]');
            pElement.classList.add('text-[#757575]');
          }
        }
      }
    });
  }

  // --- Logica per il filtraggio tramite tab ---
  function setupTabListener(tabElement, filterName) {
    if (tabElement) {
      tabElement.addEventListener('click', (event) => {
        event.preventDefault();
        currentFilter = filterName;
        renderOrders();
        updateActiveTabStyle();
      });
    } else {
      console.warn(`Scheda filtro per '${filterName}' non trovata.`);
    }
  }

  setupTabListener(filterAllTab, 'All');
  setupTabListener(filterActiveTab, 'Active');
  setupTabListener(filterCompletedTab, 'Completed');

  updateActiveTabStyle();
});
