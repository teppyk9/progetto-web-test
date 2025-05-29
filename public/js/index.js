document.addEventListener('DOMContentLoaded', () => {
  // "Shop Now" button in the hero section
  const shopNowButton = document.querySelector('button > span.truncate'); // Target by text content might be fragile
  if (shopNowButton && shopNowButton.textContent.trim() === 'Shop Now') {
    const actualButton = shopNowButton.closest('button');
    if (actualButton) {
      actualButton.addEventListener('click', () => {
        window.location.href = '/catalogo.html';
      });
    }
  }

  // "Subscribe" button
  const subscribeButton = Array.from(document.querySelectorAll('button > span.truncate')).find(span => span.textContent.trim() === 'Subscribe');
  if (subscribeButton) {
    const actualSubscribeButton = subscribeButton.closest('button');
    if (actualSubscribeButton) {
      actualSubscribeButton.addEventListener('click', () => {
        // Placeholder for actual subscription logic
        console.log('Subscribe button clicked. Implement newsletter signup.');
        alert('Newsletter subscription is not yet implemented.');
      });
    }
  }
});
