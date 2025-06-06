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
          console.error('Errore nel caricamento dei prodotti:', error);
          productGridContainer.innerHTML = '<p class="text-red-500">Impossibile caricare i prodotti.</p>';
        });
  } else {
    console.warn('Contenitore della griglia dei prodotti non trovato.');
  }

  // --- Render Products Function ---
  function renderProducts(productsToRender) {
    if (!productGridContainer) {
      console.warn('Contenitore della griglia dei prodotti non trovato per il rendering.');
      return;
    }
    productGridContainer.innerHTML = ''; // Clear existing products

    if (productsToRender.length === 0) {
      productGridContainer.innerHTML = '<p class="text-gray-500">Nessun prodotto trovato.</p>';
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
      priceP.textContent = `€${product.price}`;

      // Optional: Add category or availability
      // const categoryP = document.createElement('p');
      // categoryP.className = 'text-[#757575] text-xs font-normal';
      // categoryP.textContent = `Categoria: ${product.category || 'N/D'}`;

      // const availabilityP = document.createElement('p');
      // availabilityP.className = 'text-[#757575] text-xs font-normal';
      // availabilityP.textContent = `Disponibilità: ${product.availability || 'N/D'}`;

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
    console.warn('Campo di ricerca non trovato.');
  }

  // --- Filter Functionality (Basic Placeholders) ---
  if (filterCategoryButton) {
    filterCategoryButton.addEventListener('click', () => {
      console.log('Filtro per categoria cliccato');
      // Esempio: Prompt per la categoria e filtro
      // const category = prompt("Inserisci la categoria da filtrare (es. Ceramica, Legno):");
      // if (category) {
      //   const filteredProducts = allProducts.filter(product =>
      //     product.category && product.category.toLowerCase() === category.toLowerCase()
      //   );
      //   renderProducts(filteredProducts);
      // }
    });
  } else {
    console.warn('Pulsante filtro categoria non trovato.');
  }

  if (filterPriceButton) {
    filterPriceButton.addEventListener('click', () => {
      console.log('Filtro per prezzo cliccato');
      // Placeholder per la logica di filtro del prezzo
    });
  } else {
    console.warn('Pulsante filtro prezzo non trovato.');
  }

  if (filterAvailabilityButton) {
    filterAvailabilityButton.addEventListener('click', () => {
      console.log('Filtro per disponibilità cliccato');
      // Placeholder per la logica di filtro della disponibilità
    });
  } else {
    console.warn('Pulsante filtro disponibilità non trovato.');
  }
});

