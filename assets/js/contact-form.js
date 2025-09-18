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
 }