document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const contactNameInput = document.getElementById('contact-name');
  const contactEmailInput = document.getElementById('contact-email');
  const contactSubjectInput = document.getElementById('contact-subject');
  const contactMessageTextarea = document.getElementById('contact-message');
  const contactSendButton = document.getElementById('contact-send-button');
  const contactFormStatus = document.getElementById('contact-form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();

      // Clear previous status messages
      if (contactFormStatus) {
        contactFormStatus.textContent = '';
        contactFormStatus.className = 'text-sm px-4 py-2 min-h-[1.5em]'; // Reset classes
      }

      const name = contactNameInput.value.trim();
      const email = contactEmailInput.value.trim();
      const subject = contactSubjectInput.value.trim();
      const message = contactMessageTextarea.value.trim();

      // Basic Client-Side Validation
      if (!name || !email || !subject || !message) {
        if (contactFormStatus) {
          contactFormStatus.textContent = 'All fields are required.';
          contactFormStatus.classList.add('text-red-500');
        }
        return;
      }
      // Basic email format validation
      if (!email.includes('@') || !email.includes('.')) {
        if (contactFormStatus) {
          contactFormStatus.textContent = 'Please enter a valid email address.';
          contactFormStatus.classList.add('text-red-500');
        }
        contactEmailInput.focus();
        return;
      }

      // Disable button during API call
      if (contactSendButton) {
        contactSendButton.disabled = true;
        const buttonSpan = contactSendButton.querySelector('span');
        if (buttonSpan) buttonSpan.textContent = 'Sending...';
      }

      fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject,
          message: message,
        }),
      })
      .then(response => {
        if (!response.ok) {
          // Try to parse error from response body, then fallback
          return response.json().catch(() => {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
          }).then(errData => {
            throw new Error(errData.message || `Server error: ${response.status}`);
          });
        }
        return response.json(); // Assuming success response might contain some data, e.g., a confirmation message
      })
      .then(data => {
        // Handle success
        if (contactFormStatus) {
          contactFormStatus.textContent = data.message || 'Message sent successfully!';
          contactFormStatus.classList.add('text-green-500');
        }
        contactForm.reset(); // Clear the form fields
      })
      .catch(error => {
        // Handle failure
        console.error('Contact form submission error:', error);
        if (contactFormStatus) {
          contactFormStatus.textContent = error.message || 'An unexpected error occurred. Please try again.';
          contactFormStatus.classList.add('text-red-500');
        }
      })
      .finally(() => {
        // Re-enable the send button
        if (contactSendButton) {
          contactSendButton.disabled = false;
          const buttonSpan = contactSendButton.querySelector('span');
          if (buttonSpan) buttonSpan.textContent = 'Send Message';
        }
      });
    });
  } else {
    console.warn('Contact form not found.');
  }
});
