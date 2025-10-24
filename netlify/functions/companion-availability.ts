import { Handler, HandlerEvent } from '@netlify/functions';

// Simple in-memory storage for demo (in real app would use database)
const companionAvailability: Record<string, boolean> = {};

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'PUT') {
    try {
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Request body is required' })
        };
      }

      const { companionId, isAvailable } = JSON.parse(event.body);
      
      if (!companionId || typeof isAvailable !== 'boolean') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Companion ID and availability status are required' })
        };
      }

      companionAvailability[companionId] = isAvailable;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: `Availability updated to ${isAvailable ? 'available' : 'unavailable'}`,
          companionId,
          isAvailable,
          success: true
        })
      };
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid request data' })
      };
    }
  }

  if (event.httpMethod === 'GET') {
    const pathParts = event.path.split('/');
    const companionId = pathParts[pathParts.length - 1];
    
    const isAvailable = companionAvailability[companionId] ?? true; // Default to available

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ companionId, isAvailable })
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method not allowed' })
  };
};