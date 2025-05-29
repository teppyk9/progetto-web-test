document.addEventListener('DOMContentLoaded', () => {
  let artisanProducts = [];

  const searchInput = document.getElementById('artisan-product-search-input');
  const stockAlertsTbody = document.getElementById('stock-alerts-tbody');
  const allProductsTbody = document.getElementById('all-products-tbody');

  // --- Fetch Artisan's Products ---
  if (stockAlertsTbody && allProductsTbody) {
    fetch('/api/artisan/products') // Assuming this endpoint returns products for the logged-in artisan
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Please log in.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(products => {
        artisanProducts = products;
        renderAllProductsTable(artisanProducts);
        renderStockAlertsTable(artisanProducts);
      })
      .catch(error => {
        console.error('Error fetching artisan products:', error);
        if (allProductsTbody) {
            allProductsTbody.innerHTML = `<tr><td colspan="4" class="text-red-500 p-4 text-center">${error.message || 'Could not load products.'}</td></tr>`;
        }
        if (stockAlertsTbody) {
            stockAlertsTbody.innerHTML = `<tr><td colspan="3" class="text-red-500 p-4 text-center">${error.message || 'Could not load stock alerts.'}</td></tr>`;
        }
      });
  } else {
    console.warn('Required table body elements not found.');
  }

  // --- Render All Products Table Function ---
  function renderAllProductsTable(productsToRender) {
    if (!allProductsTbody) {
      console.warn('All products table body not found for rendering.');
      return;
    }
    allProductsTbody.innerHTML = ''; // Clear existing products

    if (productsToRender.length === 0) {
      allProductsTbody.innerHTML = '<tr><td colspan="4" class="text-gray-500 p-4 text-center">No products found.</td></tr>';
      return;
    }

    productsToRender.forEach(product => {
      const tr = document.createElement('tr');
      tr.className = 'border-t border-t-[#e0e0e0]';

      // Product Name
      const tdName = document.createElement('td');
      tdName.className = 'h-[72px] px-4 py-2 w-[400px] text-[#141414] text-sm font-normal leading-normal';
      tdName.textContent = product.name || 'N/A';
      tr.appendChild(tdName);

      // Stock
      const tdStock = document.createElement('td');
      tdStock.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdStock.textContent = product.stock !== undefined ? product.stock : 'N/A';
      tr.appendChild(tdStock);

      // Price
      const tdPrice = document.createElement('td');
      tdPrice.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdPrice.textContent = product.price !== undefined ? `$${product.price}` : 'N/A';
      tr.appendChild(tdPrice);

      // Status
      const tdStatus = document.createElement('td');
      tdStatus.className = 'h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal';
      const statusButton = document.createElement('button');
      statusButton.className = 'flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#f2f2f2] text-[#141414] text-sm font-medium leading-normal w-full';
      const statusSpan = document.createElement('span');
      statusSpan.className = 'truncate';
      statusSpan.textContent = product.status || 'N/A';
      statusButton.appendChild(statusSpan);
      tdStatus.appendChild(statusButton);
      tr.appendChild(tdStatus);

      allProductsTbody.appendChild(tr);
    });
  }

  // --- Render Stock Alerts Table Function ---
  function renderStockAlertsTable(products) {
    if (!stockAlertsTbody) {
      console.warn('Stock alerts table body not found for rendering.');
      return;
    }
    stockAlertsTbody.innerHTML = ''; // Clear existing alerts

    const productsNeedingAlert = products.filter(p => p.stock !== undefined && p.alertThreshold !== undefined && p.stock < p.alertThreshold);

    if (productsNeedingAlert.length === 0) {
      stockAlertsTbody.innerHTML = '<tr><td colspan="3" class="text-gray-500 p-4 text-center">No stock alerts.</td></tr>';
      return;
    }

    productsNeedingAlert.forEach(product => {
      const tr = document.createElement('tr');
      tr.className = 'border-t border-t-[#e0e0e0]';

      // Product Name
      const tdName = document.createElement('td');
      tdName.className = 'h-[72px] px-4 py-2 w-[400px] text-[#141414] text-sm font-normal leading-normal';
      tdName.textContent = product.name || 'N/A';
      tr.appendChild(tdName);

      // Stock
      const tdStock = document.createElement('td');
      tdStock.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdStock.textContent = product.stock;
      tr.appendChild(tdStock);

      // Alert Threshold
      const tdThreshold = document.createElement('td');
      tdThreshold.className = 'h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal';
      tdThreshold.textContent = product.alertThreshold;
      tr.appendChild(tdThreshold);

      stockAlertsTbody.appendChild(tr);
    });
  }

  // --- Search Functionality ---
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const searchTerm = event.target.value.toLowerCase();
      const filteredProducts = artisanProducts.filter(product =>
        product.name && product.name.toLowerCase().includes(searchTerm)
      );
      renderAllProductsTable(filteredProducts);
      // Optionally, re-filter and render stock alerts if search should apply there too.
      // For now, search only applies to the "All Products" table.
      // renderStockAlertsTable(filteredProducts); // Uncomment if search should also filter stock alerts
    });
  } else {
    console.warn('Artisan product search input not found.');
  }
});
