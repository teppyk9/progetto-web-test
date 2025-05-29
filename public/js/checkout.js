document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element References ---
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartShippingEl = document.getElementById('cart-shipping');
  const cartTotalEl = document.getElementById('cart-total');

  const shippingFullnameEl = document.getElementById('shipping-fullname');
  const shippingAddressEl = document.getElementById('shipping-address');
  const shippingCityEl = document.getElementById('shipping-city');
  const shippingStateEl = document.getElementById('shipping-state');
  const shippingZipEl = document.getElementById('shipping-zip');

  const cardNumberEl = document.getElementById('card-number');
  const cardExpiryEl = document.getElementById('card-expiry');
  const cardCvvEl = document.getElementById('card-cvv');

  const completePurchaseBtn = document.getElementById('complete-purchase-btn');

  const FIXED_SHIPPING_COST = 5.00;

  // --- Fetch Cart Data ---
  function fetchCart() {
    fetch('/api/cart')
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) throw new Error('Please log in to view your cart.');
          throw new Error('Could not fetch cart details.');
        }
        return response.json();
      })
      .then(cartData => {
        renderCart(cartData);
        updateTotals(cartData);
      })
      .catch(error => {
        console.error('Error fetching cart:', error);
        if (cartItemsContainer) cartItemsContainer.innerHTML = `<p class="text-red-500 p-4">${error.message || 'Error loading cart.'}</p>`;
        // Disable checkout if cart fails to load
        if (completePurchaseBtn) completePurchaseBtn.disabled = true;
      });
  }

  // --- Render Cart Items ---
  function renderCart(cartData) {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = ''; // Clear existing items

    if (!cartData || !cartData.items || cartData.items.length === 0) {
      cartItemsContainer.innerHTML = '<p class="p-4 text-gray-600">Your cart is empty.</p>';
      if (completePurchaseBtn) completePurchaseBtn.disabled = true;
      // Ensure totals are zeroed out if cart is empty
      if(cartSubtotalEl) cartSubtotalEl.textContent = '$0.00';
      if(cartShippingEl) cartShippingEl.textContent = '$0.00';
      if(cartTotalEl) cartTotalEl.textContent = '$0.00';
      return;
    }

    if (completePurchaseBtn) completePurchaseBtn.disabled = false;

    cartData.items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'flex items-center gap-4 bg-white px-4 min-h-[72px] py-3 border-b border-gray-200';
      itemElement.innerHTML = `
        <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14" style="background-image: url('${item.imageUrl || 'placeholder.jpg'}');"></div>
        <div class="flex-grow flex flex-col justify-center">
          <p class="text-[#141414] text-base font-medium leading-normal line-clamp-1">${item.name || 'Product Name'}</p>
          <p class="text-[#757575] text-sm font-normal leading-normal line-clamp-1">${item.description || 'Description'}</p>
          <p class="text-[#141414] text-sm font-semibold">Price: $${(item.price || 0).toFixed(2)}</p>
        </div>
        <div class="flex flex-col items-end gap-2">
          <div class="flex items-center gap-2">
            <label for="qty-${item.id}" class="text-sm">Qty:</label>
            <input type="number" id="qty-${item.id}" min="1" value="${item.quantity || 1}" 
                   class="quantity-input form-input h-8 w-16 rounded-md border-gray-300 text-center text-sm" 
                   data-item-id="${item.id}">
          </div>
          <p class="text-[#141414] text-sm font-semibold">Item Total: $${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
          <button class="remove-item-btn text-red-500 hover:text-red-700 text-xs font-medium" data-item-id="${item.id}">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
    });

    // Add event listeners for new quantity inputs and remove buttons
    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', handleQuantityChange);
      // Consider adding 'blur' event as well if needed
    });
    document.querySelectorAll('.remove-item-btn').forEach(button => {
      button.addEventListener('click', handleRemoveItem);
    });
  }

  // --- Handle Quantity Change ---
  function handleQuantityChange(event) {
    const itemId = event.target.dataset.itemId;
    const newQuantity = parseInt(event.target.value, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      // Optionally reset to old value or show error
      // For now, refetch to get server-side validation or reset
      fetchCart();
      return;
    }
    updateCartItemQuantity(itemId, newQuantity);
  }

  // --- Update Cart Item Quantity ---
  function updateCartItemQuantity(itemId, newQuantity) {
    fetch(`/api/cart/item/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity }),
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to update quantity.');
      return response.json();
    })
    .then(() => fetchCart()) // Re-fetch to update cart display and totals
    .catch(error => {
      console.error('Error updating quantity:', error);
      alert(`Error: ${error.message}`);
      fetchCart(); // Re-fetch to revert optimistic UI or show server state
    });
  }

  // --- Handle Remove Item ---
  function handleRemoveItem(event) {
    const itemId = event.target.dataset.itemId;
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      removeCartItem(itemId);
    }
  }

  // --- Remove Cart Item ---
  function removeCartItem(itemId) {
    fetch(`/api/cart/item/${itemId}`, { method: 'DELETE' })
    .then(response => {
      if (!response.ok) throw new Error('Failed to remove item.');
      return response.json();
    })
    .then(() => fetchCart()) // Re-fetch to update cart display and totals
    .catch(error => {
      console.error('Error removing item:', error);
      alert(`Error: ${error.message}`);
      fetchCart();
    });
  }

  // --- Update Totals ---
  function updateTotals(cartData) {
    if (!cartSubtotalEl || !cartShippingEl || !cartTotalEl) return;

    let subtotal = 0;
    if (cartData && cartData.items) {
      subtotal = cartData.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    }

    const shipping = subtotal > 0 ? FIXED_SHIPPING_COST : 0;
    const total = subtotal + shipping;

    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    cartShippingEl.textContent = `$${shipping.toFixed(2)}`;
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  // --- Handle Checkout Submission ---
  if (completePurchaseBtn) {
    completePurchaseBtn.addEventListener('click', (event) => {
      event.preventDefault();

      // Basic Form Validation
      const requiredFields = [
        { el: shippingFullnameEl, name: 'Full Name' },
        { el: shippingAddressEl, name: 'Address' },
        { el: shippingCityEl, name: 'City' },
        { el: shippingStateEl, name: 'State' },
        { el: shippingZipEl, name: 'Zip Code' },
      ];
      
      const paymentMethodRadio = document.querySelector('input[name="payment-method"]:checked');
      if (!paymentMethodRadio) {
        alert('Please select a payment method.');
        return;
      }
      const paymentMethod = paymentMethodRadio.value;

      if (paymentMethod === 'creditcard') {
        requiredFields.push(
          { el: cardNumberEl, name: 'Card Number' },
          { el: cardExpiryEl, name: 'Card Expiry' },
          { el: cardCvvEl, name: 'Card CVV' }
        );
      }
      
      for (const field of requiredFields) {
        if (field.el && !field.el.value.trim()) {
          alert(`Please fill in the ${field.name}.`);
          field.el.focus();
          return;
        }
      }
      
      // Collect Data
      const orderData = {
        shippingDetails: {
          fullName: shippingFullnameEl.value.trim(),
          address: shippingAddressEl.value.trim(),
          city: shippingCityEl.value.trim(),
          state: shippingStateEl.value.trim(),
          zipCode: shippingZipEl.value.trim(),
        },
        paymentDetails: {
          method: paymentMethod,
        },
        // Cart items are typically taken from the session on the backend
        // If you need to send them, retrieve from 'userCart.items'
      };

      if (paymentMethod === 'creditcard') {
        orderData.paymentDetails.cardNumber = cardNumberEl.value.trim();
        orderData.paymentDetails.cardExpiry = cardExpiryEl.value.trim();
        orderData.paymentDetails.cardCvv = cardCvvEl.value.trim();
      }

      // Disable button to prevent multiple submissions
      completePurchaseBtn.disabled = true;
      completePurchaseBtn.textContent = 'Processing...';

      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message || 'Order submission failed.') });
        }
        return response.json();
      })
      .then(orderConfirmation => {
        alert(`Order successfully placed! Order ID: ${orderConfirmation.orderId}`);
        // Clear cart (assuming an endpoint or a full page reload that would do this)
        // For now, just clear the display and disable button further.
        if (cartItemsContainer) cartItemsContainer.innerHTML = '<p class="p-4 text-green-600">Your order has been placed. Thank you!</p>';
        updateTotals({ items: [] }); // Zero out totals
        // Potentially redirect: window.location.href = `/order-confirmation?id=${orderConfirmation.orderId}`;
        // Reset form fields (optional)
        document.querySelector('form')?.reset(); // If inputs are in a form
      })
      .catch(error => {
        console.error('Error submitting order:', error);
        alert(`Error: ${error.message}`);
        completePurchaseBtn.disabled = false;
        completePurchaseBtn.textContent = 'Complete Purchase';
      });
    });
  }

  // --- Initial Fetch ---
  fetchCart();
});
