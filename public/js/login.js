document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginEmailInput = document.getElementById('login-email');
  const loginPasswordInput = document.getElementById('login-password');
  const loginButton = document.getElementById('login-button');
  const loginErrorMessage = document.getElementById('login-error-message');

  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();

      // Pulisci i messaggi di errore precedenti
      if (loginErrorMessage) {
        loginErrorMessage.textContent = '';
      }

      const email = loginEmailInput.value.trim();
      const password = loginPasswordInput.value.trim();

      // Validazione di base
      if (!email) {
        if (loginErrorMessage) loginErrorMessage.textContent = 'Per favore inserisci la tua email.';
        loginEmailInput.focus();
        return;
      }
      if (!password) {
        if (loginErrorMessage) loginErrorMessage.textContent = 'Per favore inserisci la tua password.';
        loginPasswordInput.focus();
        return;
      }

      // Disabilita il pulsante durante la chiamata API
      if (loginButton) {
        loginButton.disabled = true;
        const loginButtonSpan = loginButton.querySelector('span');
        if (loginButtonSpan) loginButtonSpan.textContent = 'Accesso in corso...';
      }

      // Chiamata API
      fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
      })
          .then(response => {
            if (!response.ok) {
              // Prova a interpretare l'errore dal corpo della risposta
              return response.json().then(errData => {
                // Genera un errore con il messaggio ricevuto dal server o uno di default
                throw new Error(errData.message || `Accesso fallito. Stato: ${response.status}`);
              }).catch(() => {
                // Fallback se la risposta non è JSON o errData.message non è presente
                throw new Error(`Accesso fallito. Stato: ${response.status} - ${response.statusText}`);
              });
            }
            return response.json(); // Si presume che la risposta di successo contenga un token
          })
          .then(data => {
            // Gestisci il successo
            if (data.token) {
              // Salva il token (localStorage è persistente tra le sessioni del browser)
              localStorage.setItem('authToken', data.token);
              // Salva userType se presente, utile per redirect o modifiche UI basate sul ruolo
              if (data.userType) {
                localStorage.setItem('userType', data.userType);
              }
              // Reindirizza alla dashboard
              window.location.href = 'dashboard.html';
            } else {
              // Caso che può succedere se il server risponde 200 OK ma senza token
              if (loginErrorMessage) loginErrorMessage.textContent = 'Accesso effettuato con successo, ma nessun token ricevuto.';
            }
          })
          .catch(error => {
            // Gestisci il fallimento (errore di rete o errore lanciato dalla gestione della risposta)
            console.error('Errore di accesso:', error);
            if (loginErrorMessage) {
              loginErrorMessage.textContent = error.message || 'Si è verificato un errore imprevisto. Per favore riprova.';
            }
          })
          .finally(() => {
            // Riabilita il pulsante di accesso
            if (loginButton) {
              loginButton.disabled = false;
              const loginButtonSpan = loginButton.querySelector('span');
              if (loginButtonSpan) loginButtonSpan.textContent = 'Accedi';
            }
          });
    });
  } else {
    console.warn('Modulo di login non trovato.');
  }
});
