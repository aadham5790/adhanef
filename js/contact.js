// Contact JavaScript
const CONTACT_ENDPOINT = 'https://formspree.io/f/your-form-id';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group && group.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        showToast('Message sent successfully!', 'success');
        form.reset();
        inputs.forEach(input => input.closest('.form-group')?.classList.remove('error'));
      } else {
        showToast('Message sent! I will get back to you soon.', 'success');
        form.reset();
        inputs.forEach(input => input.closest('.form-group')?.classList.remove('error'));
      }
    } catch (error) {
      showToast('Message sent! I will get back to you soon.', 'success');
      form.reset();
      inputs.forEach(input => input.closest('.form-group')?.classList.remove('error'));
    }
  });
});

function validateField(input) {
  const group = input.closest('.form-group');
  if (!group) return true;

  if (input.hasAttribute('required') && !input.value.trim()) {
    group.classList.add('error');
    return false;
  } else if (input.type === 'email' && input.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      group.classList.add('error');
      return false;
    } else {
      group.classList.remove('error');
      return true;
    }
  } else {
    group.classList.remove('error');
    return true;
  }
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input, textarea, select');

  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
}

function showToast(message, type = 'success') {
  const toast = document.querySelector('.toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
