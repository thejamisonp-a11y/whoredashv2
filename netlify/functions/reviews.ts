import { Handler, HandlerEvent } from '@netlify/functions';
import { mockReviews } from '../../client/src/lib/mock-data';

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
      const queryParams = event.queryStringParameters || {};
      const { companionId } = queryParams;

      let reviews = [...mockReviews];

      if (companionId) {
        const id = parseInt(companionId);
        reviews = reviews.filter(review => review.companionId === id);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(reviews)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Failed to fetch reviews' })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method not allowed' })
  };
};