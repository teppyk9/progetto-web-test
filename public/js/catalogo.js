document.addEventListener('DOMContentLoaded', () => {
  let allProducts = [];

  const productGridContainer = document.getElementById('product-grid-container');
  const searchInput = document.getElementById('search-input');
  const filterCategoryButton = document.getElementById('filter-category-button');
  const filterPriceButton = document.getElementById('filter-price-button');
  const filterAvailabilityButton = document.getElementById('filter-availability-button');

  // --- Fetch Products ---
  if (productGridContainer) {
    fetch('/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(products => {
        allProducts = products;
        renderProducts(allProducts);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        productGridContainer.innerHTML = '<p class="text-red-500">Could not load products.</p>';
      });
  } else {
    console.warn('Product grid container not found.');
  }

  // --- Render Products Function ---
  function renderProducts(productsToRender) {
    if (!productGridContainer) {
      console.warn('Product grid container not found for rendering.');
      return;
    }
    productGridContainer.innerHTML = ''; // Clear existing products

    if (productsToRender.length === 0) {
      productGridContainer.innerHTML = '<p class="text-gray-500">No products found.</p>';
      return;
    }

    productsToRender.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'flex flex-col gap-3 pb-3';

      const imageDiv = document.createElement('div');
      imageDiv.className = 'w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg';
      imageDiv.style.backgroundImage = `url('${product.imageUrl || 'placeholder.jpg'}')`; // Fallback image

      const infoDiv = document.createElement('div');
      const nameP = document.createElement('p');
      nameP.className = 'text-[#141414] text-base font-medium leading-normal';
      nameP.textContent = product.name;

      const priceP = document.createElement('p');
      priceP.className = 'text-[#757575] text-sm font-normal leading-normal';
      priceP.textContent = `$${product.price}`;

      // Optional: Add category or availability
      // const categoryP = document.createElement('p');
      // categoryP.className = 'text-[#757575] text-xs font-normal';
      // categoryP.textContent = `Category: ${product.category || 'N/A'}`;

      // const availabilityP = document.createElement('p');
      // availabilityP.className = 'text-[#757575] text-xs font-normal';
      // availabilityP.textContent = `Availability: ${product.availability || 'N/A'}`;

      infoDiv.appendChild(nameP);
      infoDiv.appendChild(priceP);
      // infoDiv.appendChild(categoryP);
      // infoDiv.appendChild(availabilityP);

      productElement.appendChild(imageDiv);
      productElement.appendChild(infoDiv);
      productGridContainer.appendChild(productElement);
    });
  }

  // --- Search Functionality ---
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const searchTerm = event.target.value.toLowerCase();
      const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
      );
      renderProducts(filteredProducts);
    });
  } else {
    console.warn('Search input not found.');
  }

  // --- Filter Functionality (Basic Placeholders) ---
  if (filterCategoryButton) {
    filterCategoryButton.addEventListener('click', () => {
      console.log('Category filter clicked');
      // Example: Prompt for category and filter
      // const category = prompt("Enter category to filter by (e.g., Ceramics, Woodworking):");
      // if (category) {
      //   const filteredProducts = allProducts.filter(product =>
      //     product.category && product.category.toLowerCase() === category.toLowerCase()
      //   );
      //   renderProducts(filteredProducts);
      // }
    });
  } else {
    console.warn('Filter category button not found.');
  }

  if (filterPriceButton) {
    filterPriceButton.addEventListener('click', () => {
      console.log('Price filter clicked');
      // Placeholder for price filtering logic
    });
  } else {
    console.warn('Filter price button not found.');
  }

  if (filterAvailabilityButton) {
    filterAvailabilityButton.addEventListener('click', () => {
      console.log('Availability filter clicked');
      // Placeholder for availability filtering logic
    });
  } else {
    console.warn('Filter availability button not found.');
  }
});
