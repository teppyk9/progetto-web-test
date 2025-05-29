document.addEventListener('DOMContentLoaded', () => {
  const orderIdParam = new URLSearchParams(window.location.search).get('orderId');

  // DOM element references
  const breadcrumbOrderIdEl = document.getElementById('breadcrumb-order-id');
  const mainOrderIdEl = document.getElementById('main-order-id');
  const orderPlacedDateEl = document.getElementById('order-placed-date');
  const summaryOrderTotalEl = document.getElementById('summary-order-total');
  const summaryShippingEl = document.getElementById('summary-shipping');
  const summaryTaxesEl = document.getElementById('summary-taxes');
  const summaryGrandTotalEl = document.getElementById('summary-grand-total');
  const customerNameEl = document.getElementById('customer-name');
  const customerEmailEl = document.getElementById('customer-email');
  const shippingAddressEl = document.getElementById('shipping-address');
  const orderItemsTbodyEl = document.getElementById('order-items-tbody');
  const fulfillmentStatusSelectEl = document.getElementById('fulfillment-status-select');
  const trackingNumberInputEl = document.getElementById('tracking-number-input');
  const updateStatusBtnEl = document.getElementById('update-status-btn');
  const supportMessageTextareaEl = document.getElementById('support-message-textarea');
  const sendMessageBtnEl = document.getElementById('send-message-btn');
  
  const pageContentContainer = document.querySelector('.layout-content-container.flex-1'); // For displaying general errors

  if (!orderIdParam) {
    displayError("Order ID not found in URL.");
    return;
  }

  // --- Fetch Order Details ---
  fetch(`/api/artisan/orders/${orderIdParam}`)
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized: Please log in.');
        if (response.status === 404) throw new Error('Order not found.');
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(orderData => {
      populatePage(orderData);
    })
    .catch(error => {
      console.error('Error fetching order details:', error);
      displayError(error.message || "Could not load order details.");
    });

  // --- Populate Page with Order Data ---
  function populatePage(data) {
    if (!data) {
        displayError("Order data is missing or invalid.");
        return;
    }

    if (breadcrumbOrderIdEl) breadcrumbOrderIdEl.textContent = `Order ${data.orderId || 'N/A'}`;
    if (mainOrderIdEl) mainOrderIdEl.textContent = `Order ${data.orderId || 'N/A'}`;
    if (orderPlacedDateEl && data.placedDate) {
      orderPlacedDateEl.textContent = `Placed on ${new Date(data.placedDate).toLocaleDateString()}`;
    } else if (orderPlacedDateEl) {
        orderPlacedDateEl.textContent = 'Placed on N/A';
    }

    if (summaryOrderTotalEl) summaryOrderTotalEl.textContent = `$${(data.orderTotal || 0).toFixed(2)}`;
    if (summaryShippingEl) summaryShippingEl.textContent = `$${(data.shippingCost || 0).toFixed(2)}`;
    if (summaryTaxesEl) summaryTaxesEl.textContent = `$${(data.taxes || 0).toFixed(2)}`;
    if (summaryGrandTotalEl) summaryGrandTotalEl.textContent = `$${(data.grandTotal || 0).toFixed(2)}`;

    if (data.customer) {
      if (customerNameEl) customerNameEl.textContent = data.customer.name || 'N/A';
      if (customerEmailEl) customerEmailEl.textContent = data.customer.email || 'N/A';
      if (shippingAddressEl) shippingAddressEl.textContent = data.customer.shippingAddress || 'N/A';
    } else {
      if (customerNameEl) customerNameEl.textContent = 'N/A';
      if (customerEmailEl) customerEmailEl.textContent = 'N/A';
      if (shippingAddressEl) shippingAddressEl.textContent = 'N/A';
    }

    if (orderItemsTbodyEl) {
      orderItemsTbodyEl.innerHTML = ''; // Clear example rows
      if (data.items && data.items.length > 0) {
        data.items.forEach(item => {
          const tr = document.createElement('tr');
          tr.className = 'border-t border-t-[#e0e0e0]';
          tr.innerHTML = `
            <td class="h-[72px] px-4 py-2 text-[#141414] text-sm font-normal leading-normal">${item.name || 'N/A'}</td>
            <td class="h-[72px] px-4 py-2 text-[#757575] text-sm font-normal leading-normal">${item.quantity || 0}</td>
            <td class="h-[72px] px-4 py-2 text-[#757575] text-sm font-normal leading-normal">$${(item.price || 0).toFixed(2)}</td>
            <td class="h-[72px] px-4 py-2 text-[#757575] text-sm font-normal leading-normal">$${(item.total || 0).toFixed(2)}</td>
          `;
          orderItemsTbodyEl.appendChild(tr);
        });
      } else {
        orderItemsTbodyEl.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-gray-500">No items found in this order.</td></tr>';
      }
    }

    if (fulfillmentStatusSelectEl) fulfillmentStatusSelectEl.value = data.status || 'Pending';
    if (trackingNumberInputEl) trackingNumberInputEl.value = data.trackingNumber || '';
  }

  // --- Update Fulfillment Status ---
  if (updateStatusBtnEl) {
    updateStatusBtnEl.addEventListener('click', () => {
      const newStatus = fulfillmentStatusSelectEl.value;
      const newTrackingNumber = trackingNumberInputEl.value.trim();

      updateStatusBtnEl.disabled = true;
      updateStatusBtnEl.textContent = 'Updating...';

      fetch(`/api/artisan/orders/${orderIdParam}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, trackingNumber: newTrackingNumber }),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message || 'Failed to update status.') });
        }
        return response.json();
      })
      .then(updatedOrder => {
        alert('Order status updated successfully.');
        // Optionally, re-populate parts of the page if the response contains the full updated order
        if (fulfillmentStatusSelectEl) fulfillmentStatusSelectEl.value = updatedOrder.status || newStatus;
        if (trackingNumberInputEl) trackingNumberInputEl.value = updatedOrder.trackingNumber || newTrackingNumber;
      })
      .catch(error => {
        console.error('Error updating order status:', error);
        alert(`Error: ${error.message}`);
      })
      .finally(() => {
        updateStatusBtnEl.disabled = false;
        updateStatusBtnEl.textContent = 'Update Status';
      });
    });
  }

  // --- Send Customer Support Message (Basic) ---
  if (sendMessageBtnEl) {
    sendMessageBtnEl.addEventListener('click', () => {
      const messageText = supportMessageTextareaEl.value.trim();
      if (!messageText) {
        alert('Please enter a message.');
        return;
      }
      console.log(`Sending message for order ${orderIdParam}:`, messageText);
      // Here you would typically POST to a backend endpoint
      // For example:
      // fetch(`/api/artisan/orders/${orderIdParam}/messages`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: messageText }),
      // })
      // .then(...)
      alert('Message sending functionality is not fully implemented in this demo.\nMessage logged to console.');
      if (supportMessageTextareaEl) supportMessageTextareaEl.value = ''; // Clear textarea
    });
  }
  
  // --- Helper to display errors ---
  function displayError(message) {
    if (pageContentContainer) {
        // Clear existing content that might be specific to order details
        const elementsToClear = pageContentContainer.querySelectorAll('p[id], span[id], div[id^="summary-"], tbody[id], select[id], input[id], textarea[id]');
        elementsToClear.forEach(el => {
            if (el.tagName === 'TBODY') el.innerHTML = '';
            else if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') el.value = '';
            else el.textContent = '';
        });
        // Hide or clear specific sections
        const sectionsToHide = pageContentContainer.querySelectorAll('h2'); // Hide all H2s for simplicity
        sectionsToHide.forEach(h2 => h2.style.display = 'none');
        
        // Display the error message prominently
        let errorDisplay = pageContentContainer.querySelector('.error-message-display');
        if (!errorDisplay) {
            errorDisplay = document.createElement('p');
            errorDisplay.className = 'text-red-500 text-center p-8 text-xl error-message-display';
            // Find a suitable place to insert, e.g., after the breadcrumbs or main title
            const breadcrumbDiv = pageContentContainer.querySelector('.flex.flex-wrap.gap-2.p-4');
            if (breadcrumbDiv && breadcrumbDiv.parentNode) {
                breadcrumbDiv.parentNode.insertBefore(errorDisplay, breadcrumbDiv.nextSibling);
            } else {
                 pageContentContainer.prepend(errorDisplay);
            }
        }
        errorDisplay.textContent = message;
    } else {
        alert(message); // Fallback if main container not found
    }
  }

});
