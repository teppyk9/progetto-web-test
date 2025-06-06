document.addEventListener('DOMContentLoaded', () => {
  const registrationForm = document.getElementById('registration-form');
  const userTypeInput = document.getElementById('user-type');
  const tabCustomer = document.getElementById('tab-customer');
  const tabArtisan = document.getElementById('tab-artisan');

  const regFullnameInput = document.getElementById('reg-fullname');
  const regEmailInput = document.getElementById('reg-email');
  const regPasswordInput = document.getElementById('reg-password');
  const regConfirmPasswordInput = document.getElementById('reg-confirm-password');

  const signupButton = document.getElementById('signup-button');
  const registrationErrorMessage = document.getElementById('registration-error-message');

  // --- Gestione cambio tab tipo utente ---
  function setActiveTab(activeTab, inactiveTab) {
    activeTab.classList.remove('border-b-transparent', 'text-[#757575]');
    activeTab.classList.add('border-b-[#141414]', 'text-[#141414]');
    activeTab.querySelector('p')?.classList.remove('text-[#757575]');
    activeTab.querySelector('p')?.classList.add('text-[#141414]');

    inactiveTab.classList.remove('border-b-[#141414]', 'text-[#141414]');
    inactiveTab.classList.add('border-b-transparent', 'text-[#757575]');
    inactiveTab.querySelector('p')?.classList.remove('text-[#141414]');
    inactiveTab.querySelector('p')?.classList.add('text-[#757575]');
  }

  if (tabCustomer && tabArtisan && userTypeInput) {
    tabCustomer.addEventListener('click', (event) => {
      event.preventDefault();
      userTypeInput.value = 'customer';
      setActiveTab(tabCustomer, tabArtisan);
    });

    tabArtisan.addEventListener('click', (event) => {
      event.preventDefault();
      userTypeInput.value = 'artisan';
      setActiveTab(tabArtisan, tabCustomer);
    });
  } else {
    console.warn('Tab tipo utente o input nascosto non trovati.');
  }

  // --- Gestione invio modulo ---
  if (registrationForm) {
    registrationForm.addEventListener('submit', function(event) {
      event.preventDefault();

      if (registrationErrorMessage) {
        registrationErrorMessage.textContent = ''; // Pulisce errori precedenti
      }

      const fullName = regFullnameInput.value.trim();
      const email = regEmailInput.value.trim();
      const password = regPasswordInput.value.trim();
      const confirmPassword = regConfirmPasswordInput.value.trim();
      const userType = userTypeInput.value;

      // Validazione lato client
      if (!fullName || !email || !password || !confirmPassword) {
        if (registrationErrorMessage) registrationErrorMessage.textContent = 'Tutti i campi sono obbligatori.';
        return;
      }
      if (password !== confirmPassword) {
        if (registrationErrorMessage) registrationErrorMessage.textContent = 'Le password non corrispondono.';
        regConfirmPasswordInput.focus();
        return;
      }
      // Validazione base formato email (molto semplice)
      if (!email.includes('@') || !email.includes('.')) {
        if (registrationErrorMessage) registrationErrorMessage.textContent = 'Inserisci un indirizzo email valido.';
        regEmailInput.focus();
        return;
      }
      if (password.length < 6) { // Esempio: lunghezza minima password
        if (registrationErrorMessage) registrationErrorMessage.textContent = 'La password deve contenere almeno 6 caratteri.';
        regPasswordInput.focus();
        return;
      }


      // Disabilita il pulsante durante la chiamata API
      if (signupButton) {
        signupButton.disabled = true;
        const signupButtonSpan = signupButton.querySelector('span');
        if (signupButtonSpan) signupButtonSpan.textContent = 'Registrazione in corso...';
      }

      fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName,
          email: email,
          password: password,
          userType: userType,
        }),
      })
          .then(response => {
            if (!response.ok) {
              return response.json().then(errData => {
                throw new Error(errData.message || `Registrazione fallita. Stato: ${response.status}`);
              }).catch(() => { // Fallback se la risposta non è JSON
                throw new Error(`Registrazione fallita. Stato: ${response.status} - ${response.statusText}`);
              });
            }
            return response.json();
          })
          .then(data => {
            // Gestione successo
            alert('Registrazione completata! Effettua il login.');
            window.location.href = 'login.html';
          })
          .catch(error => {
            // Gestione fallimento
            console.error('Errore di registrazione:', error);
            if (registrationErrorMessage) {
              registrationErrorMessage.textContent = error.message || 'Si è verificato un errore imprevisto. Riprova.';
            }
          })
          .finally(() => {
            // Riabilita il pulsante di registrazione
            if (signupButton) {
              signupButton.disabled = false;
              const signupButtonSpan = signupButton.querySelector('span');
              if (signupButtonSpan) signupButtonSpan.textContent = 'Registrati';
            }
          });
    });
  } else {
    console.warn('Modulo di registrazione non trovato.');
  }
});
