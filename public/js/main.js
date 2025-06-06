document.addEventListener('DOMContentLoaded', () => {
  // Link di navigazione nell'header
  const homeLinks = document.querySelectorAll('a[href="#"]'); // Generalizza se ci sono ID/classi specifiche disponibili
  const navLinks = {
    'Home': '/index.html', // Si assume che index.html sia la homepage
    'Artisans': '/artigiani.html', // Segnaposto, si presume una pagina per artigiani
    'Products': '/catalogo.html',
    'Categories': '/catalogo.html', // Le categorie potrebbero puntare anch'esse al catalogo
    'About Us': '/about.html',
    'About': '/about.html',
    'Shop': '/catalogo.html',
    'Contact Us': '/contatti.html',
    'Privacy Policy': '/privacy.html', // Segnaposto
    'Terms of Service': '/terms.html', // Segnaposto
  };

  homeLinks.forEach(link => {
    const linkText = link.textContent.trim();
    if (navLinks[linkText]) {
      link.href = navLinks[linkText];
    }
  });

  // Link specifici delle icone nell'header
  const header = document.querySelector('header');
  if (header) {
    const cartIconLink = header.querySelector('button > div[data-icon="ShoppingBag"]');
    if (cartIconLink) {
      // Rende cliccabile il pulsante genitore e naviga a carrello.html
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
          // Segnaposto per funzionalità wishlist o navigazione
          // Per ora, si presume possa andare a una pagina preferiti o aprire una finestra modale
          // window.location.href = '/favorites.html'; // Esempio
          console.log('Icona wishlist cliccata');
        });
      }
    }
  }

  // Link nel footer (logica simile se anche loro usano href="#")
  const footerLinks = document.querySelectorAll('footer a[href="#"]');
  footerLinks.forEach(link => {
    const linkText = link.textContent.trim();
    if (navLinks[linkText]) {
      link.href = navLinks[linkText];
    }
  });

});
