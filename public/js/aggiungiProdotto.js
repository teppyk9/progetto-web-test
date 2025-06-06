document.addEventListener('DOMContentLoaded', () => {
  const addProductForm = document.getElementById('add-product-form');
  const productCategorySelect = document.getElementById('product-category');
  const saveProductButton = document.getElementById('save-product-button');

  // --- Popola le categorie ---
  if (productCategorySelect) {
    fetch('/api/categories')
        .then(response => {
          if (!response.ok) {
            throw new Error(`Errore HTTP! stato: ${response.status} - Impossibile recuperare le categorie.`);
          }
          return response.json();
        })
        .then(categories => {
          // Rimuovi le opzioni esistenti (eccetto la prima se è un placeholder)
          while (productCategorySelect.options.length > 1) {
            productCategorySelect.remove(1);
          }

          if (categories && categories.length > 0) {
            categories.forEach(category => {
              const option = document.createElement('option');
              option.value = category.id; // Presuppone che category abbia 'id' e 'name'
              option.textContent = category.name;
              productCategorySelect.appendChild(option);
            });
          } else if (productCategorySelect.options.length <= 1) {
            productCategorySelect.innerHTML = '<option value="">Nessuna categoria trovata</option>';
            productCategorySelect.disabled = true;
          }
        })
        .catch(error => {
          console.error('Errore durante il recupero delle categorie:', error);
          productCategorySelect.innerHTML = `<option value="">Errore durante il caricamento delle categorie</option>`;
          productCategorySelect.disabled = true;
        });
  } else {
    console.warn('Elemento select per la categoria prodotto non trovato.');
  }

  // --- Gestione invio form ---
  if (addProductForm) {
    addProductForm.addEventListener('submit', function(event) {
      event.preventDefault();

      if (saveProductButton) {
        saveProductButton.disabled = true;
        saveProductButton.querySelector('span').textContent = 'Salvataggio...';
      }

      const formData = new FormData(addProductForm);

      fetch('/api/artisan/products', {
        method: 'POST',
        body: formData,
      })
          .then(response => {
            if (!response.ok) {
              return response.json().catch(() => {
                throw new Error(`Errore HTTP! stato: ${response.status} - ${response.statusText}`);
              }).then(errData => {
                throw new Error(errData.message || `Errore del server: ${response.status}`);
              });
            }
            return response.json();
          })
          .then(data => {
            alert('Prodotto aggiunto con successo!');
            addProductForm.reset();
            // window.location.href = 'magazzino.html';
          })
          .catch(error => {
            console.error('Errore durante l\'aggiunta del prodotto:', error);
            alert(`Impossibile aggiungere il prodotto: ${error.message}`);
          })
          .finally(() => {
            if (saveProductButton) {
              saveProductButton.disabled = false;
              saveProductButton.querySelector('span').textContent = 'Salva prodotto';
            }
          });
    });
  } else {
    console.warn('Form per aggiungere prodotto non trovato.');
  }
});
