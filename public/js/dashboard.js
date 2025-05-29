document.addEventListener('DOMContentLoaded', () => {
  const authToken = localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType');

  // DOM Elements
  const artisanNameSidebar = document.getElementById('artisan-name-sidebar');
  const artisanRoleSidebar = document.getElementById('artisan-role-sidebar'); // Role is static but ID is there
  const artisanImageSidebar = document.getElementById('artisan-image-sidebar');

  const statsTotalSales = document.getElementById('stats-total-sales');
  const statsTotalSalesPercentage = document.getElementById('stats-total-sales-percentage');
  const statsProductsSold = document.getElementById('stats-products-sold');
  const statsProductsSoldPercentage = document.getElementById('stats-products-sold-percentage');
  const statsActiveListings = document.getElementById('stats-active-listings');
  const statsActiveListingsPercentage = document.getElementById('stats-active-listings-percentage');

  const salesOverTimeValue = document.getElementById('sales-over-time-value');
  const salesOverTimePeriod = document.getElementById('sales-over-time-period');
  const salesOverTimePercentage = document.getElementById('sales-over-time-percentage');

  const productTableTbody = document.getElementById('dashboard-product-table-tbody');
  
  const mainContentArea = document.querySelector('.layout-content-container.flex-1');


  // --- Authentication and User Type Check ---
  if (!authToken) {
    window.location.href = 'login.html';
    return; // Stop further execution
  }
  if (userType !== 'artisan') {
    // For non-artisans, you might show a different dashboard or redirect
    // For this task, redirecting to index.html if not an artisan.
    // If a customer dashboard existed, you'd redirect there.
    // window.location.href = 'index.html'; 
    if (mainContentArea) {
        mainContentArea.innerHTML = `
            <div class="p-8 text-center">
                <h1 class="text-2xl font-bold mb-4">Access Denied</h1>
                <p class="text-gray-600">This dashboard is for artisan users only.</p>
                <a href="index.html" class="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Go to Homepage</a>
            </div>
        `;
    }
    // Clear sidebar artisan-specific info if it was hardcoded
    if (artisanNameSidebar) artisanNameSidebar.textContent = 'User';
    if (artisanRoleSidebar) artisanRoleSidebar.textContent = 'Customer View'; // Example
    if (artisanImageSidebar) artisanImageSidebar.style.backgroundImage = 'url("default-user-image.png")'; // Placeholder
    return; // Stop further execution for non-artisans
  }

  // --- Helper to format percentage and set color ---
  function formatPercentage(element, value) {
    if (!element) return;
    let numValue = parseFloat(value);
    if (isNaN(numValue)) { // If value is already a string like "+10%"
        element.textContent = value;
        if (value.startsWith('+')) element.classList.add('text-[#078807]');
        else if (value.startsWith('-')) element.classList.add('text-[#e70808]');
        else element.classList.remove('text-[#078807]', 'text-[#e70808]'); // Neutral color
        return;
    }
    // If value is a number
    element.textContent = `${numValue >= 0 ? '+' : ''}${numValue.toFixed(0)}%`;
    if (numValue > 0) {
      element.classList.add('text-[#078807]');
      element.classList.remove('text-[#e70808]');
    } else if (numValue < 0) {
      element.classList.add('text-[#e70808]');
      element.classList.remove('text-[#078807]');
    } else {
      element.classList.remove('text-[#078807]', 'text-[#e70808]');
    }
  }
  
  // --- Fetch and Populate Artisan Profile ---
  fetch('/api/artisan/profile', {
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(response => response.ok ? response.json() : Promise.reject('Failed to load profile'))
  .then(profile => {
    if (artisanNameSidebar && profile.fullName) artisanNameSidebar.textContent = profile.fullName;
    // artisanRoleSidebar.textContent = profile.userType || 'Artisan'; // Role is already Artisan here
    if (artisanImageSidebar && profile.imageUrl) artisanImageSidebar.style.backgroundImage = `url('${profile.imageUrl}')`;
  })
  .catch(error => console.error('Error fetching profile:', error));

  // --- Fetch and Populate Dashboard Stats ---
  fetch('/api/artisan/dashboard/stats', {
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(response => response.ok ? response.json() : Promise.reject('Failed to load stats'))
  .then(stats => {
    if (statsTotalSales) statsTotalSales.textContent = `$${(stats.totalSales || 0).toLocaleString()}`;
    if (statsTotalSalesPercentage) formatPercentage(statsTotalSalesPercentage, stats.totalSalesChange || 0);
    
    if (statsProductsSold) statsProductsSold.textContent = (stats.productsSold || 0).toLocaleString();
    if (statsProductsSoldPercentage) formatPercentage(statsProductsSoldPercentage, stats.productsSoldChange || 0);

    if (statsActiveListings) statsActiveListings.textContent = (stats.activeListings || 0).toLocaleString();
    if (statsActiveListingsPercentage) formatPercentage(statsActiveListingsPercentage, stats.activeListingsChange || 0);
  })
  .catch(error => {
    console.error('Error fetching stats:', error);
    if (statsTotalSales) statsTotalSales.textContent = 'Error';
  });

  // --- Fetch and Populate Sales Performance ---
  fetch('/api/artisan/dashboard/sales-performance', {
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(response => response.ok ? response.json() : Promise.reject('Failed to load sales performance'))
  .then(performance => {
    if (salesOverTimeValue) salesOverTimeValue.textContent = `$${(performance.salesOverTimeValue || 0).toLocaleString()}`;
    if (salesOverTimePeriod) salesOverTimePeriod.textContent = performance.salesOverTimePeriod || 'Last 30 Days';
    if (salesOverTimePercentage) formatPercentage(salesOverTimePercentage, performance.salesOverTimeChange || 0);
  })
  .catch(error => {
      console.error('Error fetching sales performance:', error);
      if(salesOverTimeValue) salesOverTimeValue.textContent = 'Error';
    });

  // --- Fetch and Populate Product Table ---
  fetch('/api/artisan/products?limit=5', { // Assuming API supports limit
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(response => response.ok ? response.json() : Promise.reject('Failed to load products'))
  .then(products => {
    if (!productTableTbody) return;
    productTableTbody.innerHTML = ''; // Clear existing

    if (products && products.length > 0) {
      products.forEach(product => {
        const tr = document.createElement('tr');
        tr.className = 'border-t border-t-[#e0e0e0]';
        
        const statusButtonClass = 'flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#f2f2f2] text-[#141414] text-sm font-medium leading-normal w-full';

        tr.innerHTML = `
          <td class="h-[72px] px-4 py-2 w-[400px] text-[#141414] text-sm font-normal leading-normal">${product.name || 'N/A'}</td>
          <td class="h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal">${product.stock === undefined ? 'N/A' : product.stock}</td>
          <td class="h-[72px] px-4 py-2 w-[400px] text-[#757575] text-sm font-normal leading-normal">$${(product.price || 0).toFixed(2)}</td>
          <td class="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
            <button class="${statusButtonClass}">
              <span class="truncate">${product.status || 'N/A'}</span>
            </button>
          </td>
          <td class="h-[72px] px-4 py-2 w-60 text-[#757575] text-sm font-bold leading-normal tracking-[0.015em]">
            <a href="aggiungiProdotto.html?productId=${product.id || ''}" class="hover:underline">Edit</a>
          </td>
        `;
        productTableTbody.appendChild(tr);
      });
    } else {
      productTableTbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">No products to show.</td></tr>';
    }
  })
  .catch(error => {
    console.error('Error fetching products:', error);
    if (productTableTbody) productTableTbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-red-500">Error loading products.</td></tr>';
  });

});
