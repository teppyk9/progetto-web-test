document.addEventListener('DOMContentLoaded', () => {
  let userOrders = [];
  let currentFilter = 'All'; // Initial filter

  const ordersTbody = document.getElementById('user-orders-tbody');
  const filterAllTab = document.getElementById('filter-orders-all');
  const filterActiveTab = document.getElementById('filter-orders-active');
  const filterCompletedTab = document.getElementById('filter-orders-completed');

  const activeOrderStatuses = ["Processing", "Shipped", "Pending"]; // Define what counts as an active order
  const completedOrderStatuses = ["Delivered"]; // Define what counts as a completed order

  // --- Fetch User Orders ---
  if (ordersTbody) {
    fetch('/api/user/orders')
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
        userOrders = orders;
        renderOrders(); // Initial render with 'All' filter
        updateActiveTabStyle();
      })
      .catch(error => {
        console.error('Error fetching user orders:', error);
        ordersTbody.innerHTML = `<tr><td colspan="4" class="text-red-500 p-4 text-center">${error.message || 'Could not load your orders.'}</td></tr>`;
      });
  } else {
    console.warn('User orders table body not found.');
  }

  // --- Render Orders Function ---
  function renderOrders() {
    if (!ordersTbody) {
      console.warn('User orders table body not found for rendering.');
      return;
    }
    ordersTbody.innerHTML = ''; // Clear existing rows

    let filteredOrders = userOrders;
    if (currentFilter === 'Active') {
      filteredOrders = userOrders.filter(order => activeOrderStatuses.includes(order.status));
    } else if (currentFilter === 'Completed') {
      filteredOrders = userOrders.filter(order => completedOrderStatuses.includes(order.status));
    }
    // 'All' uses all orders, so no specific filtering needed here

    if (filteredOrders.length === 0) {
      ordersTbody.innerHTML = `<tr><td colspan="4" class="text-gray-500 p-4 text-center">No orders found for this filter.</td></tr>`;
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
      // Format date if necessary, assuming it's a string for now
      tdDate.textContent = order.date ? new Date(order.date).toLocaleDateString() : 'N/A';
      tr.appendChild(tdDate);

      // Status
      const tdStatus = document.createElement('td');
      tdStatus.className = 'h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal';
      const statusButton = document.createElement('button');
      statusButton.className = 'flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f2f2f2] text-[#141414] text-sm font-medium leading-normal w-full';
      const statusSpan = document.createElement('span');
      statusSpan.className = 'truncate';
      statusSpan.textContent = order.status || 'N/A';
      statusButton.appendChild(statusSpan);
      tdStatus.appendChild(statusButton);
      tr.appendChild(tdStatus);

      // Total
      const tdTotal = document.createElement('td');
      tdTotal.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdTotal.textContent = order.total !== undefined ? `$${order.total.toFixed(2)}` : 'N/A';
      tr.appendChild(tdTotal);

      ordersTbody.appendChild(tr);
    });
  }

  // --- Update Tab Styles ---
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


  // --- Tab Filtering Logic ---
  function setupTabListener(tabElement, filterName) {
    if (tabElement) {
      tabElement.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        currentFilter = filterName;
        renderOrders();
        updateActiveTabStyle();
      });
    } else {
      console.warn(`Filter tab for '${filterName}' not found.`);
    }
  }

  setupTabListener(filterAllTab, 'All');
  setupTabListener(filterActiveTab, 'Active');
  setupTabListener(filterCompletedTab, 'Completed');

  // Set initial active tab style (should be 'All' by default)
  updateActiveTabStyle();
});
