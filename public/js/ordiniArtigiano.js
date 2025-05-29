document.addEventListener('DOMContentLoaded', () => {
  let artisanOrders = [];
  let currentArtisanOrderFilter = 'All'; // Initial filter

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

  // --- Fetch Artisan Orders ---
  if (ordersTbody) {
    fetch('/api/artisan/orders')
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Please log in to view your orders.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(orders => {
        artisanOrders = orders;
        renderArtisanOrders(); // Initial render with 'All' filter
        updateActiveTabStyle();
      })
      .catch(error => {
        console.error('Error fetching artisan orders:', error);
        ordersTbody.innerHTML = `<tr><td colspan="5" class="text-red-500 p-4 text-center">${error.message || 'Could not load your orders.'}</td></tr>`;
      });
  } else {
    console.warn('Artisan orders table body not found.');
  }

  // --- Render Artisan Orders Function ---
  function renderArtisanOrders() {
    if (!ordersTbody) {
      console.warn('Artisan orders table body not found for rendering.');
      return;
    }
    ordersTbody.innerHTML = ''; // Clear existing rows

    let filteredOrders = artisanOrders;
    if (currentArtisanOrderFilter !== 'All') {
      filteredOrders = artisanOrders.filter(order => 
        order.status && order.status.toLowerCase() === currentArtisanOrderFilter.toLowerCase()
      );
    }

    if (filteredOrders.length === 0) {
      ordersTbody.innerHTML = `<tr><td colspan="5" class="text-gray-500 p-4 text-center">No orders found for this filter.</td></tr>`;
      return;
    }

    filteredOrders.forEach(order => {
      const tr = document.createElement('tr');
      tr.className = 'border-t border-t-[#e0e0e0]';

      // Order ID
      const tdOrderId = document.createElement('td');
      tdOrderId.className = 'h-[72px] px-4 py-2 w-[400px] text-[#141414] text-sm font-normal leading-normal';
      tdOrderId.textContent = order.orderId || 'N/A';
      tr.appendChild(tdOrderId);

      // Date
      const tdDate = document.createElement('td');
      tdDate.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdDate.textContent = order.date ? new Date(order.date).toLocaleDateString() : 'N/A';
      tr.appendChild(tdDate);

      // Customer
      const tdCustomer = document.createElement('td');
      tdCustomer.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdCustomer.textContent = order.customerName || (order.customer && order.customer.name) || 'N/A';
      tr.appendChild(tdCustomer);
      
      // Status
      const tdStatus = document.createElement('td');
      tdStatus.className = 'h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal';
      const statusButton = document.createElement('button');
      // Note: Tailwind classes for button styling might need adjustment if they are too generic
      // or if specific styling per status is needed later.
      statusButton.className = 'flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#f2f2f2] text-[#141414] text-sm font-medium leading-normal w-full';
      const statusSpan = document.createElement('span');
      statusSpan.className = 'truncate';
      statusSpan.textContent = order.status || 'N/A';
      statusButton.appendChild(statusSpan);
      tdStatus.appendChild(statusButton);
      tr.appendChild(tdStatus);

      // Actions
      const tdActions = document.createElement('td');
      tdActions.className = 'h-[72px] px-4 py-2 w-60 text-[#757575] text-sm font-bold leading-normal tracking-[0.015em]';
      const viewDetailsLink = document.createElement('a');
      viewDetailsLink.href = `dettaglioOrdineArtigiano.html?orderId=${encodeURIComponent(order.orderId)}`;
      viewDetailsLink.textContent = 'View Details';
      // Apply link styling if needed, e.g., viewDetailsLink.className = 'text-blue-600 hover:underline';
      tdActions.appendChild(viewDetailsLink);
      tr.appendChild(tdActions);

      ordersTbody.appendChild(tr);
    });
  }

  // --- Update Tab Styles ---
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

  // --- Tab Filtering Logic ---
  filterTabs.forEach(tabInfo => {
    if (tabInfo.el) {
      tabInfo.el.addEventListener('click', (event) => {
        // Prevent default for href="#" but not for actual links like the "All" tab
        if (tabInfo.el.getAttribute('href') === '#') {
          event.preventDefault();
        }
        currentArtisanOrderFilter = tabInfo.name;
        renderArtisanOrders();
        updateActiveTabStyle();
      });
    } else {
      console.warn(`Filter tab element for '${tabInfo.name}' not found.`);
    }
  });

  // Set initial active tab style (should be 'All' by default as per currentArtisanOrderFilter)
  updateActiveTabStyle();
});
