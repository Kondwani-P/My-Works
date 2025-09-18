 async function submitContactForm(event) {
    event.preventDefault();

    const form = event.target;
    const formData = {
        name: form.querySelector('[name="name"]').value,
        email: form.querySelector('[name="email"]').value,
        business: form.querySelector('[name="business"]').value,
        budget: form.querySelector('[name="budget"]').value,
        timeline: form.querySelector('[name=""timeline]').value,
        message: form.querySelector('[name="message"]').value
    };

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Message sent successfully!', 'success');
            form.reset();
        } else {
            showMessage(result.error || 'Failed to send message', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Network error. Please try again.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
 }

 function showMessage(message, type) {
    const existingMessage = document.querySelector('.contact-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageEl = document.createElement('div');
    messageEl.className = `contact-message ${type}`;
    messageEl.textContent = message;

    messageEl.style.cssText = `
        padding: 12px 16px;
        margin: 16px 0;
        border-radius: 4px;
        font-weight: 500;
        ${type === 'success'
            ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
            : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb'
        }
    `;

    const form = document.querySelector('#contactForm');
    form.parentNode.insertBefore(messageEl, form);

    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
 }

 document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', submitContactForm);
    }
 });