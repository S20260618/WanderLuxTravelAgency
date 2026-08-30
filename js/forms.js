/**
 * WanderLux Travel Agency - Forms Validation & Submission Handler
 * Handles Appointment Request and Contact Form submissions with client-side validation.
 * Unit: ICT502 - Internet and Web Development
 */

document.addEventListener('DOMContentLoaded', () => {
  initAppointmentForm();
  initContactForm();
  checkUrlParamsForPrefill();
});

/* --------------------------------------------------------------------------
   1. Validation Utility Functions
   -------------------------------------------------------------------------- */
const validators = {
  isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).trim().toLowerCase());
  },
  isValidPhone(phone) {
    // Allows Australian numbers or generic international formats (min 8 digits)
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    return /^\d{8,15}$/.test(cleaned);
  },
  isValidName(name) {
    return name.trim().length >= 2;
  },
  isValidDate(dateStr) {
    if (!dateStr) return false;
    const selectedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  },
  isValidMessage(msg) {
    return msg.trim().length >= 10;
  }
};

function showFieldError(field, message) {
  field.classList.add('is-invalid');
  field.classList.remove('is-valid');
  const parent = field.closest('.form-group');
  if (parent) {
    let errorEl = parent.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      parent.appendChild(errorEl);
    }
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function clearFieldError(field) {
  field.classList.remove('is-invalid');
  field.classList.add('is-valid');
  const parent = field.closest('.form-group');
  if (parent) {
    const errorEl = parent.querySelector('.form-error');
    if (errorEl) {
      errorEl.style.display = 'none';
    }
  }
}

function showToast(message, type = 'success') {
  let toast = document.querySelector('.alert-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'alert-toast';
    document.body.appendChild(toast);
  }

  const icon = type === 'success' ? '✓' : '⚠';
  toast.style.borderLeftColor = type === 'success' ? 'var(--success)' : 'var(--error)';
  toast.innerHTML = `<span style="font-weight: bold; font-size: 1.2rem; color: ${type === 'success' ? '#10b981' : '#ef4444'}">${icon}</span> <span>${message}</span>`;
  
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* --------------------------------------------------------------------------
   2. Appointment Request Form
   -------------------------------------------------------------------------- */
function initAppointmentForm() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  const nameInput = document.getElementById('appt-name');
  const emailInput = document.getElementById('appt-email');
  const phoneInput = document.getElementById('appt-phone');
  const dateInput = document.getElementById('appt-date');
  const messageInput = document.getElementById('appt-message');

  // Set minimum date to today
  if (dateInput) {
    const todayStr = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', todayStr);
  }

  // Real-time validation
  nameInput?.addEventListener('input', () => {
    if (validators.isValidName(nameInput.value)) clearFieldError(nameInput);
    else showFieldError(nameInput, 'Please enter a valid full name (min 2 characters).');
  });

  emailInput?.addEventListener('input', () => {
    if (validators.isValidEmail(emailInput.value)) clearFieldError(emailInput);
    else showFieldError(emailInput, 'Please enter a valid email address.');
  });

  phoneInput?.addEventListener('input', () => {
    if (validators.isValidPhone(phoneInput.value)) clearFieldError(phoneInput);
    else showFieldError(phoneInput, 'Please enter a valid phone number (min 8 digits).');
  });

  dateInput?.addEventListener('change', () => {
    if (validators.isValidDate(dateInput.value)) clearFieldError(dateInput);
    else showFieldError(dateInput, 'Please select a future date for your appointment.');
  });

  messageInput?.addEventListener('input', () => {
    if (validators.isValidMessage(messageInput.value)) clearFieldError(messageInput);
    else showFieldError(messageInput, 'Please provide details about your travel plans (min 10 characters).');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (!validators.isValidName(nameInput.value)) {
      showFieldError(nameInput, 'Full name is required (min 2 characters).');
      isValid = false;
    }
    if (!validators.isValidEmail(emailInput.value)) {
      showFieldError(emailInput, 'A valid email address is required.');
      isValid = false;
    }
    if (!validators.isValidPhone(phoneInput.value)) {
      showFieldError(phoneInput, 'A valid contact phone number is required.');
      isValid = false;
    }
    if (!validators.isValidDate(dateInput.value)) {
      showFieldError(dateInput, 'Please choose an appointment date from today onwards.');
      isValid = false;
    }
    if (!validators.isValidMessage(messageInput.value)) {
      showFieldError(messageInput, 'Please write a message explaining your travel requirements (min 10 characters).');
      isValid = false;
    }

    if (!isValid) return;

    // Simulated async submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Booking Appointment...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      showToast(`Thank you, ${nameInput.value.trim()}! Your consultation request has been booked for ${dateInput.value}. We will email you confirmation shortly.`, 'success');
      form.reset();
      form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   3. Contact Form
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (!nameInput || !validators.isValidName(nameInput.value)) {
      showFieldError(nameInput, 'Please enter your name.');
      isValid = false;
    }
    if (!emailInput || !validators.isValidEmail(emailInput.value)) {
      showFieldError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }
    if (!subjectInput || subjectInput.value.trim().length < 3) {
      showFieldError(subjectInput, 'Please enter a subject (min 3 characters).');
      isValid = false;
    }
    if (!messageInput || !validators.isValidMessage(messageInput.value)) {
      showFieldError(messageInput, 'Please enter your message (min 10 characters).');
      isValid = false;
    }

    if (!isValid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Message...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      showToast(`Message sent successfully! Our travel specialists will respond to ${emailInput.value} within 24 hours.`, 'success');
      form.reset();
      form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   4. URL Parameter Prefill (Calculator to Appointment Hand-off)
   -------------------------------------------------------------------------- */
function checkUrlParamsForPrefill() {
  const messageInput = document.getElementById('appt-message');
  if (!messageInput) return;

  const urlParams = new URLSearchParams(window.location.search);
  const dest = urlParams.get('dest');
  const travelers = urlParams.get('travelers');
  const days = urlParams.get('days');
  const style = urlParams.get('style');
  const cost = urlParams.get('cost');

  if (dest && travelers && days) {
    messageInput.value = `I am interested in booking the following calculated package:\n- Destination: ${dest}\n- Travellers: ${travelers}\n- Duration: ${days} days\n- Travel Style: ${style || 'Standard'}\n- Estimated Cost: ${cost || 'TBD'}\nPlease contact me to finalize itinerary details.`;
  }
}
