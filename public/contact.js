document.getElementById('contact-form').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const userEmail = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const messageContent = document.getElementById('message').value;
  
    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, subject, messageContent }),
      });
  
      if (response.ok) {
        alert('Message sent successfully!');
      } else {
        alert('Error sending message.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  });