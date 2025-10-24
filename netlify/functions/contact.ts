import { Handler, HandlerEvent } from '@netlify/functions';

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'POST') {
    try {
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Request body is required' })
        };
      }

      const contactData = JSON.parse(event.body);
      const { name, email, subject, message, type } = contactData;
      
      // Validate required fields
      if (!name || !email || !subject || !message) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'All fields are required' })
        };
      }

      // In a real app, this would send an email or save to database
      console.log('Contact form submission:', { name, email, subject, message, type });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Message sent successfully! We\'ll get back to you within 24 hours.',
          success: true 
        })
      };
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid contact data' })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method not allowed' })
  };
};