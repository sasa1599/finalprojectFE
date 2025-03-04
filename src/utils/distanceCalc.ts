/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first point in decimal degrees
 * @param lon1 Longitude of first point in decimal degrees
 * @param lat2 Latitude of second point in decimal degrees
 * @param lon2 Longitude of second point in decimal degrees
 * @returns Distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    // Earth's radius in kilometers
    const R = 6371;
    
    // Convert latitude and longitude from degrees to radians
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    
    // Haversine formula
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  }
  
  /**
   * Safely parse coordinate values
   * @param value The coordinate value which might be a string or number
   * @returns Parsed number or 0 if invalid
   */
  export function parseCoordinate(value: string | number | null | undefined): number {
    if (value === null || value === undefined) return 0;
    
    if (typeof value === 'number') return value;
    
    return parseFloat(value) || 0;
  }
  
  /**
   * Sort an array of items by their distance from a reference location
   * @param items Array of items with latitude and longitude properties
   * @param userLat User's latitude
   * @param userLon User's longitude
   * @param getCoords Function to extract coordinates from an item
   * @returns New array of items with distances added, sorted by proximity
   */
  export function sortByDistance<T>(
    items: T[],
    userLat: number,
    userLon: number,
    getCoords: (item: T) => { lat: number | string | null | undefined, lon: number | string | null | undefined }
  ): (T & { distance: number })[] {
    // Add distance to each item
    const itemsWithDistance = items.map(item => {
      const coords = getCoords(item);
      const itemLat = parseCoordinate(coords.lat);
      const itemLon = parseCoordinate(coords.lon);
      
      const distance = calculateDistance(
        userLat,
        userLon,
        itemLat,
        itemLon
      );
      
      return { ...item, distance };
    });
    
    // Sort by distance
    return itemsWithDistance.sort((a, b) => a.distance - b.distance);
  }