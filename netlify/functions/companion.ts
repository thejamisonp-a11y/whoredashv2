import { Handler, HandlerEvent } from '@netlify/functions';
import { mockCompanions } from '../../client/src/lib/mock-data';

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'GET') {
    try {
      // Extract ID from path
      const pathParts = event.path.split('/');
      const id = pathParts[pathParts.length - 1];
      
      if (!id || isNaN(parseInt(id))) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Invalid companion ID' })
        };
      }

      const companionId = parseInt(id);
      const companion = mockCompanions.find(c => c.id === companionId);

      if (!companion) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Companion not found' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(companion)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Failed to fetch companion' })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method not allowed' })
  };
};