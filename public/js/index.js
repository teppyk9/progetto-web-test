document.addEventListener('DOMContentLoaded', () => {
  // --- Fetch Featured Artisans ---
  const artisansContainer = document.getElementById('featured-artisans-container');
  if (artisansContainer) {
    fetch('/api/artisans/featured')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(artisans => {
        artisansContainer.innerHTML = ''; // Clear existing content
        artisans.forEach(artisan => {
          const artisanElement = document.createElement('div');
          artisanElement.className = 'flex h-full flex-1 flex-col gap-4 text-center rounded-lg min-w-32 pt-4';

          const imageDiv = document.createElement('div');
          imageDiv.className = 'bg-center bg-no-repeat aspect-square bg-cover rounded-full flex flex-col self-center w-full';
          imageDiv.style.backgroundImage = `url('${artisan.imageUrl}')`;

          const infoDiv = document.createElement('div');
          const nameP = document.createElement('p');
          nameP.className = 'text-[#141414] text-base font-medium leading-normal';
          nameP.textContent = artisan.name;
          const specialtyP = document.createElement('p');
          specialtyP.className = 'text-[#757575] text-sm font-normal leading-normal';
          specialtyP.textContent = artisan.specialty;

          infoDiv.appendChild(nameP);
          infoDiv.appendChild(specialtyP);
          artisanElement.appendChild(imageDiv);
          artisanElement.appendChild(infoDiv);
          artisansContainer.appendChild(artisanElement);
        });
      })
      .catch(error => {
        console.error('Error fetching featured artisans:', error);
        artisansContainer.innerHTML = '<p class="text-red-500">Could not load featured artisans.</p>';
      });
  } else {
    console.warn('Featured artisans container not found.');
  }

  // --- Fetch Featured Products ---
  const productsContainer = document.getElementById('featured-products-container');
  if (productsContainer) {
    fetch('/api/products/featured')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(products => {
        productsContainer.innerHTML = ''; // Clear existing content
        products.forEach(product => {
          const productElement = document.createElement('div');
          productElement.className = 'flex flex-col gap-3 pb-3';

          const imageDiv = document.createElement('div');
          imageDiv.className = 'w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl';
          imageDiv.style.backgroundImage = `url('${product.imageUrl}')`;

          const infoDiv = document.createElement('div');
          const nameP = document.createElement('p');
          nameP.className = 'text-[#141414] text-base font-medium leading-normal';
          nameP.textContent = product.name;
          const priceP = document.createElement('p');
          priceP.className = 'text-[#757575] text-sm font-normal leading-normal';
          priceP.textContent = `$${product.price}`; // Assuming price is a number

          infoDiv.appendChild(nameP);
          infoDiv.appendChild(priceP);
          productElement.appendChild(imageDiv);
          productElement.appendChild(infoDiv);
          productsContainer.appendChild(productElement);
        });
      })
      .catch(error => {
        console.error('Error fetching featured products:', error);
        productsContainer.innerHTML = '<p class="text-red-500">Could not load featured products.</p>';
      });
  } else {
    console.warn('Featured products container not found.');
  }
});
