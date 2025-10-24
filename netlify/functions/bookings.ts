import { Handler, HandlerEvent } from '@netlify/functions';

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

      const bookingData = JSON.parse(event.body);
      
      // Validate required fields
      const { companionId, scheduledFor, duration, location, totalAmount } = bookingData;
      
      if (!companionId || !scheduledFor || !duration || !location || !totalAmount) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Missing required fields' })
        };
      }

      // In a real app, this would save to a database
      // For demo purposes, we'll just return a success response
      const booking = {
        id: Math.floor(Math.random() * 10000),
        companionId,
        clientId: 'demo-client',
        scheduledFor,
        duration,
        location,
        specialRequests: bookingData.specialRequests || '',
        totalAmount,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(booking)
      };
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid booking data' })
      };
    }
  }

  if (event.httpMethod === 'GET') {
    // Return empty array for demo
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([])
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method not allowed' })
  };
};