document.addEventListener('DOMContentLoaded', () => {
  const addProductForm = document.getElementById('add-product-form');
  const productCategorySelect = document.getElementById('product-category');
  const saveProductButton = document.getElementById('save-product-button');
  
  // --- Populate Categories ---
  if (productCategorySelect) {
    fetch('/api/categories')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - Could not fetch categories.`);
        }
        return response.json();
      })
      .then(categories => {
        // Clear existing options (except the first "Select category" if it's there and you want to keep it)
        // Assuming the first option is a placeholder and should be kept.
        // If not, use: productCategorySelect.innerHTML = '<option value="">Select category</option>';
        
        // Remove dummy options if any, keeping the first one if it's a placeholder
        while (productCategorySelect.options.length > 1) {
            productCategorySelect.remove(1);
        }

        if (categories && categories.length > 0) {
          categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id; // Assuming category object has 'id' and 'name'
            option.textContent = category.name;
            productCategorySelect.appendChild(option);
          });
        } else if (productCategorySelect.options.length <= 1) { // Only placeholder exists
            productCategorySelect.innerHTML = '<option value="">No categories found</option>';
            productCategorySelect.disabled = true;
        }
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        productCategorySelect.innerHTML = `<option value="">Error loading categories</option>`;
        productCategorySelect.disabled = true;
      });
  } else {
    console.warn('Product category select element not found.');
  }

  // --- Handle Form Submission ---
  if (addProductForm) {
    addProductForm.addEventListener('submit', function(event) {
      event.preventDefault();

      if (saveProductButton) {
        saveProductButton.disabled = true;
        saveProductButton.querySelector('span').textContent = 'Saving...';
      }

      const formData = new FormData(addProductForm);
      
      // Log FormData entries for debugging (optional)
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }

      fetch('/api/artisan/products', { // Make sure this is the correct endpoint
        method: 'POST',
        body: formData, // Browser automatically sets Content-Type to multipart/form-data
      })
      .then(response => {
        if (!response.ok) {
          // Try to parse error as JSON, then fallback to status text
          return response.json().catch(() => {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
          }).then(errData => {
            throw new Error(errData.message || `Server error: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(data => {
        alert('Product added successfully!');
        addProductForm.reset(); // Clear the form
        // Optionally, redirect or update UI further
        // window.location.href = 'magazzino.html'; 
      })
      .catch(error => {
        console.error('Error adding product:', error);
        alert(`Failed to add product: ${error.message}`);
      })
      .finally(() => {
        if (saveProductButton) {
          saveProductButton.disabled = false;
          saveProductButton.querySelector('span').textContent = 'Save Product';
        }
      });
    });
  } else {
    console.warn('Add product form not found.');
  }
});
