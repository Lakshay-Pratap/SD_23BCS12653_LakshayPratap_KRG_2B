const EARTH_RADIUS_KM = 6371;

export function createGeoBucket(latitude: number, longitude: number, precision = 2): string {
  const latBucket = Math.round(latitude * Math.pow(10, precision));
  const lonBucket = Math.round(longitude * Math.pow(10, precision));
  return `${latBucket}:${lonBucket}:${precision}`;
}

export function haversineDistanceKm(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number
): number {
  const dLat = toRadians(latitudeB - latitudeA);
  const dLon = toRadians(longitudeB - longitudeA);
  const lat1 = toRadians(latitudeA);
  const lat2 = toRadians(latitudeB);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}
