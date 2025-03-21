const sendEmail = async () => {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'recipient@example.com',  // Recipient's email
        subject: 'Test Subject',      // Subject
        text: 'This is a test email', // Email body
      }),
    });
  
    const data = await response.json();
    if (data.success) {
      console.log('Email sent successfully');
    } else {
      console.log('Error sending email:', data.error);
    }
  };
  