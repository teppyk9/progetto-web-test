document.addEventListener('DOMContentLoaded', () => {
  // Header navigation links
  const homeLinks = document.querySelectorAll('a[href="#"]'); // Generalize if specific IDs/classes are available
  const navLinks = {
    'Home': '/index.html', // Assuming index.html is the homepage
    'Artisans': '/artigiani.html', // Placeholder, assuming a page for artisans
    'Products': '/catalogo.html',
    'Categories': '/catalogo.html', // Categories might also go to catalog
    'About Us': '/about.html',
    'About': '/about.html',
    'Shop': '/catalogo.html',
    'Contact Us': '/contatti.html',
    'Privacy Policy': '/privacy.html', // Placeholder
    'Terms of Service': '/terms.html', // Placeholder
  };

  homeLinks.forEach(link => {
    const linkText = link.textContent.trim();
    if (navLinks[linkText]) {
      link.href = navLinks[linkText];
    }
  });

  // Specific icon links in header
  const header = document.querySelector('header');
  if (header) {
    const cartIconLink = header.querySelector('button > div[data-icon="ShoppingBag"]');
    if (cartIconLink) {
      // Make the parent button clickable and navigate to carrello.html
      const cartButton = cartIconLink.closest('button');
      if (cartButton) {
        cartButton.addEventListener('click', () => {
          window.location.href = '/carrello.html';
        });
      }
    }

    const wishlistIconLink = header.querySelector('button > div[data-icon="Heart"]');
    if (wishlistIconLink) {
        const wishlistButton = wishlistIconLink.closest('button');
        if (wishlistButton) {
            wishlistButton.addEventListener('click', () => {
                // Placeholder for wishlist functionality or navigation
                // For now, let's assume it might go to a favorites page or open a modal
                // window.location.href = '/favorites.html'; // Example
                console.log('Wishlist icon clicked');
            });
        }
    }
  }

  // Footer links (similar logic if they also use href="#")
  const footerLinks = document.querySelectorAll('footer a[href="#"]');
  footerLinks.forEach(link => {
    const linkText = link.textContent.trim();
    if (navLinks[linkText]) {
      link.href = navLinks[linkText];
    }
  });

});
