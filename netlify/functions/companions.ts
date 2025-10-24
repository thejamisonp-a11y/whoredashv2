import { Handler, HandlerEvent } from '@netlify/functions';
import { mockCompanions } from '../../client/src/lib/mock-data';

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

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

  if (event.httpMethod === 'GET') {
    try {
      const queryParams = event.queryStringParameters || {};
      const {
        search,
        category,
        location,
        userLat,
        userLng,
        maxDistance = '25',
        minPrice,
        maxPrice,
        minRating = '0',
        sortBy = 'distance'
      } = queryParams;

      let filteredCompanions = [...mockCompanions];

      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase();
        filteredCompanions = filteredCompanions.filter(companion =>
          companion.name.toLowerCase().includes(searchLower) ||
          companion.bio.toLowerCase().includes(searchLower) ||
          companion.services.some(service => service.toLowerCase().includes(searchLower))
        );
      }

      // Filter by category
      if (category && category !== 'all') {
        filteredCompanions = filteredCompanions.filter(companion =>
          companion.category === category
        );
      }

      // Filter by location
      if (location) {
        const locationLower = location.toLowerCase();
        filteredCompanions = filteredCompanions.filter(companion =>
          companion.location.toLowerCase().includes(locationLower)
        );
      }

      // Filter by price range
      if (minPrice && maxPrice) {
        const min = parseInt(minPrice);
        const max = parseInt(maxPrice);
        filteredCompanions = filteredCompanions.filter(companion =>
          companion.hourlyRate >= min && companion.hourlyRate <= max
        );
      }

      // Filter by minimum rating
      if (minRating) {
        const rating = parseFloat(minRating);
        filteredCompanions = filteredCompanions.filter(companion =>
          companion.rating >= rating
        );
      }

      // Calculate distances and sort
      if (userLat && userLng) {
        const userLatNum = parseFloat(userLat);
        const userLngNum = parseFloat(userLng);
        
        filteredCompanions = filteredCompanions.map(companion => ({
          ...companion,
          distance: calculateDistance(userLatNum, userLngNum, companion.lat, companion.lng)
        }));

        // Filter by max distance
        const maxDist = parseInt(maxDistance);
        filteredCompanions = filteredCompanions.filter(companion =>
          companion.distance && companion.distance <= maxDist
        );
      }

      // Sort results
      if (sortBy === 'distance' && userLat && userLng) {
        filteredCompanions.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      } else if (sortBy === 'price') {
        filteredCompanions.sort((a, b) => a.hourlyRate - b.hourlyRate);
      } else if (sortBy === 'rating') {
        filteredCompanions.sort((a, b) => b.rating - a.rating);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(filteredCompanions)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Failed to fetch companions' })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method not allowed' })
  };
};