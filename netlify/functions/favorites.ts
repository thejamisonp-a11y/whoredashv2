import { Handler, HandlerEvent } from '@netlify/functions';

// Simple in-memory storage for demo (in real app would use database)
const userFavorites: Record<string, number[]> = {};

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const userId = 'demo-user'; // In real app would come from auth

  if (event.httpMethod === 'GET') {
    const favorites = userFavorites[userId] || [];
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ favorites })
    };
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

      const { companionId } = JSON.parse(event.body);
      
      if (!companionId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Companion ID is required' })
        };
      }

      if (!userFavorites[userId]) {
        userFavorites[userId] = [];
      }

      if (!userFavorites[userId].includes(companionId)) {
        userFavorites[userId].push(companionId);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Added to favorites',
          favorites: userFavorites[userId]
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

  if (event.httpMethod === 'DELETE') {
    try {
      const pathParts = event.path.split('/');
      const companionId = parseInt(pathParts[pathParts.length - 1]);
      
      if (!companionId || isNaN(companionId)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Invalid companion ID' })
        };
      }

      if (userFavorites[userId]) {
        userFavorites[userId] = userFavorites[userId].filter(id => id !== companionId);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Removed from favorites',
          favorites: userFavorites[userId] || []
        })
      };
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid request' })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method not allowed' })
  };
};