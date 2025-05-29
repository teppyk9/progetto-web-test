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

  // --- Handle User Type Tab Switching ---
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
    console.warn('User type tabs or hidden input not found.');
  }

  // --- Handle Form Submission ---
  if (registrationForm) {
    registrationForm.addEventListener('submit', function(event) {
      event.preventDefault();

      if (registrationErrorMessage) {
        registrationErrorMessage.textContent = ''; // Clear previous errors
      }

      const fullName = regFullnameInput.value.trim();
      const email = regEmailInput.value.trim();
      const password = regPasswordInput.value.trim();
      const confirmPassword = regConfirmPasswordInput.value.trim();
      const userType = userTypeInput.value;

      // Client-Side Validation
      if (!fullName || !email || !password || !confirmPassword) {
        if (registrationErrorMessage) registrationErrorMessage.textContent = 'All fields are required.';
        return;
      }
      if (password !== confirmPassword) {
        if (registrationErrorMessage) registrationErrorMessage.textContent = 'Passwords do not match.';
        regConfirmPasswordInput.focus();
        return;
      }
      // Basic email format validation (very simple)
      if (!email.includes('@') || !email.includes('.')) {
        if (registrationErrorMessage) registrationErrorMessage.textContent = 'Please enter a valid email address.';
        regEmailInput.focus();
        return;
      }
      if (password.length < 6) { // Example: Minimum password length
         if (registrationErrorMessage) registrationErrorMessage.textContent = 'Password must be at least 6 characters long.';
         regPasswordInput.focus();
         return;
      }


      // Disable button during API call
      if (signupButton) {
        signupButton.disabled = true;
        const signupButtonSpan = signupButton.querySelector('span');
        if (signupButtonSpan) signupButtonSpan.textContent = 'Signing Up...';
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
            throw new Error(errData.message || `Registration failed. Status: ${response.status}`);
          }).catch(() => { // Fallback if response is not JSON
            throw new Error(`Registration failed. Status: ${response.status} - ${response.statusText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        // Handle success
        alert('Registration successful! Please log in.'); // Or use a more subtle notification
        window.location.href = 'login.html';
      })
      .catch(error => {
        // Handle failure
        console.error('Registration error:', error);
        if (registrationErrorMessage) {
          registrationErrorMessage.textContent = error.message || 'An unexpected error occurred. Please try again.';
        }
      })
      .finally(() => {
        // Re-enable the signup button
        if (signupButton) {
          signupButton.disabled = false;
          const signupButtonSpan = signupButton.querySelector('span');
          if (signupButtonSpan) signupButtonSpan.textContent = 'Sign Up';
        }
      });
    });
  } else {
    console.warn('Registration form not found.');
  }
});
