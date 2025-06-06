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
            if (response.status === 401) throw new Error('Per favore accedi per vedere il carrello.');
            throw new Error('Impossibile recuperare i dettagli del carrello.');
          }
          return response.json();
        })
        .then(cartData => {
          renderCart(cartData);
          updateTotals(cartData);
        })
        .catch(error => {
          console.error('Errore recupero carrello:', error);
          if (cartItemsContainer) cartItemsContainer.innerHTML = `<p class="text-red-500 p-4">${error.message || 'Errore durante il caricamento del carrello.'}</p>`;
          if (completePurchaseBtn) completePurchaseBtn.disabled = true;
        });
  }

  // --- Render Cart Items ---
  function renderCart(cartData) {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';

    if (!cartData || !cartData.items || cartData.items.length === 0) {
      cartItemsContainer.innerHTML = '<p class="p-4 text-gray-600">Il tuo carrello è vuoto.</p>';
      if (completePurchaseBtn) completePurchaseBtn.disabled = true;
      if(cartSubtotalEl) cartSubtotalEl.textContent = '€0,00';
      if(cartShippingEl) cartShippingEl.textContent = '€0,00';
      if(cartTotalEl) cartTotalEl.textContent = '€0,00';
      return;
    }

    if (completePurchaseBtn) completePurchaseBtn.disabled = false;

    cartData.items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'flex items-center gap-4 bg-white px-4 min-h-[72px] py-3 border-b border-gray-200';
      itemElement.innerHTML = `
        <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14" style="background-image: url('${item.imageUrl || 'placeholder.jpg'}');"></div>
        <div class="flex-grow flex flex-col justify-center">
          <p class="text-[#141414] text-base font-medium leading-normal line-clamp-1">${item.name || 'Nome Prodotto'}</p>
          <p class="text-[#757575] text-sm font-normal leading-normal line-clamp-1">${item.description || 'Descrizione'}</p>
          <p class="text-[#141414] text-sm font-semibold">Prezzo: €${(item.price || 0).toFixed(2)}</p>
        </div>
        <div class="flex flex-col items-end gap-2">
          <div class="flex items-center gap-2">
            <label for="qty-${item.id}" class="text-sm">Qtà:</label>
            <input type="number" id="qty-${item.id}" min="1" value="${item.quantity || 1}" 
                   class="quantity-input form-input h-8 w-16 rounded-md border-gray-300 text-center text-sm" 
                   data-item-id="${item.id}">
          </div>
          <p class="text-[#141414] text-sm font-semibold">Totale: €${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
          <button class="remove-item-btn text-red-500 hover:text-red-700 text-xs font-medium" data-item-id="${item.id}">Rimuovi</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', handleQuantityChange);
    });
    document.querySelectorAll('.remove-item-btn').forEach(button => {
      button.addEventListener('click', handleRemoveItem);
    });
  }

  // --- Gestione Quantità ---
  function handleQuantityChange(event) {
    const itemId = event.target.dataset.itemId;
    const newQuantity = parseInt(event.target.value, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      fetchCart();
      return;
    }
    updateCartItemQuantity(itemId, newQuantity);
  }

  function updateCartItemQuantity(itemId, newQuantity) {
    fetch(`/api/cart/item/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity }),
    })
        .then(response => {
          if (!response.ok) throw new Error('Impossibile aggiornare la quantità.');
          return response.json();
        })
        .then(() => fetchCart())
        .catch(error => {
          console.error('Errore aggiornamento quantità:', error);
          alert(`Errore: ${error.message}`);
          fetchCart();
        });
  }

  // --- Rimuovi Articolo ---
  function handleRemoveItem(event) {
    const itemId = event.target.dataset.itemId;
    if (confirm('Sei sicuro di voler rimuovere questo articolo dal carrello?')) {
      removeCartItem(itemId);
    }
  }

  function removeCartItem(itemId) {
    fetch(`/api/cart/item/${itemId}`, { method: 'DELETE' })
        .then(response => {
          if (!response.ok) throw new Error('Impossibile rimuovere l’articolo.');
          return response.json();
        })
        .then(() => fetchCart())
        .catch(error => {
          console.error('Errore rimozione articolo:', error);
          alert(`Errore: ${error.message}`);
          fetchCart();
        });
  }

  // --- Aggiorna Totali ---
  function updateTotals(cartData) {
    if (!cartSubtotalEl || !cartShippingEl || !cartTotalEl) return;

    let subtotal = 0;
    if (cartData && cartData.items) {
      subtotal = cartData.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    }

    const shipping = subtotal > 0 ? FIXED_SHIPPING_COST : 0;
    const total = subtotal + shipping;

    cartSubtotalEl.textContent = `€${subtotal.toFixed(2)}`;
    cartShippingEl.textContent = `€${shipping.toFixed(2)}`;
    cartTotalEl.textContent = `€${total.toFixed(2)}`;
  }

  // --- Gestione Checkout ---
  if (completePurchaseBtn) {
    completePurchaseBtn.addEventListener('click', (event) => {
      event.preventDefault();

      const requiredFields = [
        { el: shippingFullnameEl, name: 'Nome e Cognome' },
        { el: shippingAddressEl, name: 'Indirizzo' },
        { el: shippingCityEl, name: 'Città' },
        { el: shippingStateEl, name: 'Provincia' },
        { el: shippingZipEl, name: 'CAP' },
      ];

      const paymentMethodRadio = document.querySelector('input[name="payment-method"]:checked');
      if (!paymentMethodRadio) {
        alert('Seleziona un metodo di pagamento.');
        return;
      }
      const paymentMethod = paymentMethodRadio.value;

      if (paymentMethod === 'creditcard') {
        requiredFields.push(
            { el: cardNumberEl, name: 'Numero Carta' },
            { el: cardExpiryEl, name: 'Scadenza Carta' },
            { el: cardCvvEl, name: 'CVV' }
        );
      }

      for (const field of requiredFields) {
        if (field.el && !field.el.value.trim()) {
          alert(`Compila il campo ${field.name}.`);
          field.el.focus();
          return;
        }
      }

      const orderData = {
        shippingDetails: {
          fullName: shippingFullnameEl.value.trim(),
          address: shippingAddressEl.value.trim(),
          city: shippingCityEl.value.trim(),
          state: shippingStateEl.value.trim(),
          zipCode: shippingZipEl.value.trim(),
        },
        paymentDetails: { method: paymentMethod },
      };

      if (paymentMethod === 'creditcard') {
        orderData.paymentDetails.cardNumber = cardNumberEl.value.trim();
        orderData.paymentDetails.cardExpiry = cardExpiryEl.value.trim();
        orderData.paymentDetails.cardCvv = cardCvvEl.value.trim();
      }

      completePurchaseBtn.disabled = true;
      completePurchaseBtn.textContent = 'Sto processando...';

      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
          .then(response => {
            if (!response.ok) {
              return response.json().then(err => { throw new Error(err.message || 'Invio ordine fallito.') });
            }
            return response.json();
          })
          .then(orderConfirmation => {
            alert(`Ordine effettuato con successo! ID Ordine: ${orderConfirmation.orderId}`);
            if (cartItemsContainer) cartItemsContainer.innerHTML = '<p class="p-4 text-green-600">Ordine inviato. Grazie!</p>';
            updateTotals({ items: [] });
            document.querySelector('form')?.reset();
          })
          .catch(error => {
            console.error('Errore invio ordine:', error);
            alert(`Errore: ${error.message}`);
            completePurchaseBtn.disabled = false;
            completePurchaseBtn.textContent = 'Completa Acquisto';
          });
    });
  }

  // --- Fetch iniziale ---
  fetchCart();
});
