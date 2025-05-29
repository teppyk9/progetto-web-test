document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginEmailInput = document.getElementById('login-email');
  const loginPasswordInput = document.getElementById('login-password');
  const loginButton = document.getElementById('login-button');
  const loginErrorMessage = document.getElementById('login-error-message');

  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();

      // Clear previous error messages
      if (loginErrorMessage) {
        loginErrorMessage.textContent = '';
      }

      const email = loginEmailInput.value.trim();
      const password = loginPasswordInput.value.trim();

      // Basic Validation
      if (!email) {
        if (loginErrorMessage) loginErrorMessage.textContent = 'Please enter your email.';
        loginEmailInput.focus();
        return;
      }
      if (!password) {
        if (loginErrorMessage) loginErrorMessage.textContent = 'Please enter your password.';
        loginPasswordInput.focus();
        return;
      }

      // Disable button during API call
      if (loginButton) {
        loginButton.disabled = true;
        const loginButtonSpan = loginButton.querySelector('span');
        if (loginButtonSpan) loginButtonSpan.textContent = 'Logging in...';
      }

      // API Call
      fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
      })
      .then(response => {
        if (!response.ok) {
          // Attempt to parse error from response body
          return response.json().then(errData => {
            // Throw an error with the message from the server or a default one
            throw new Error(errData.message || `Login failed. Status: ${response.status}`);
          }).catch(() => {
            // Fallback if response is not JSON or errData.message is not present
            throw new Error(`Login failed. Status: ${response.status} - ${response.statusText}`);
          });
        }
        return response.json(); // Assuming success response includes a token
      })
      .then(data => {
        // Handle success
        if (data.token) {
          // Store the token (localStorage is persistent across browser sessions)
          localStorage.setItem('authToken', data.token);
          // Store userType if provided, this could be useful for role-based redirects or UI changes
          if (data.userType) {
            localStorage.setItem('userType', data.userType);
          }
          // Redirect to dashboard
          window.location.href = 'dashboard.html';
        } else {
          // This case might happen if the server responds with 200 OK but no token
          if (loginErrorMessage) loginErrorMessage.textContent = 'Login successful, but no token received.';
        }
      })
      .catch(error => {
        // Handle failure (network error or error thrown from response handling)
        console.error('Login error:', error);
        if (loginErrorMessage) {
          loginErrorMessage.textContent = error.message || 'An unexpected error occurred. Please try again.';
        }
      })
      .finally(() => {
        // Re-enable the login button
        if (loginButton) {
          loginButton.disabled = false;
          const loginButtonSpan = loginButton.querySelector('span');
          if (loginButtonSpan) loginButtonSpan.textContent = 'Log in';
        }
      });
    });
  } else {
    console.warn('Login form not found.');
  }
});
