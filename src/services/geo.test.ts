import { describe, expect, it } from 'vitest';
import {
  distanceBetween,
  fromGeoJsonCoordinates,
  isValidCoordinates,
  parseCoordinates,
  toLeafletLatLng,
  toOsrmCoordinate,
} from './geo';
import {
  getDistrictOptions,
  getWardOptions,
  matchesLocationFilter,
  type LocationSelection,
} from './location';

describe('coordinate conversions', () => {
  const canTho = { lat: 10.0452, lng: 105.7469 };

  it('keeps Leaflet coordinates in latitude, longitude order', () => {
    expect(toLeafletLatLng(canTho)).toEqual([10.0452, 105.7469]);
  });

  it('returns district and ward choices for the selected province', () => {
    expect(getDistrictOptions('Cần Thơ')).toContain('Ninh Kiều');
    expect(getWardOptions('Cần Thơ', 'Ninh Kiều')).toContain('Cái Khế');
  });

  it('matches restaurant addresses against selected location filters', () => {
    const selection: LocationSelection = {
      province: 'Cần Thơ',
      district: 'Ninh Kiều',
      ward: 'An Hòa',
      point: 'Đường 3/2',
    };

    expect(matchesLocationFilter('123 Đường 3/2, Ninh Kiều, Cần Thơ', selection)).toBe(true);
    expect(matchesLocationFilter('221 Võ Văn Kiệt, Ô Môn, Cần Thơ', {
      province: 'Cần Thơ',
      district: 'Ninh Kiều',
      ward: 'An Hòa',
      point: 'Đường 3/2',
    })).toBe(false);
    expect(matchesLocationFilter('67 Trần Hưng Đạo, Bình Thủy, Cần Thơ', {
      province: 'Cần Thơ',
      district: 'Bình Thủy',
      ward: 'Thới An',
      point: 'Đường Trần Hưng Đạo',
    })).toBe(true);
  });

  it('converts GeoJSON longitude, latitude coordinates', () => {
    expect(fromGeoJsonCoordinates([105.7469, 10.0452])).toEqual(canTho);
  });

  it('converts OSRM points to longitude, latitude order', () => {
    expect(toOsrmCoordinate(canTho)).toBe('105.7469,10.0452');
  });

  it('rejects missing, non-finite, and out-of-range coordinates', () => {
    expect(isValidCoordinates({ lat: Number.NaN, lng: 105 })).toBe(false);
    expect(isValidCoordinates({ lat: 91, lng: 105 })).toBe(false);
    expect(fromGeoJsonCoordinates([105, Number.NaN])).toBeNull();
    expect(parseCoordinates('91, 181')).toBeNull();
  });

  it('parses valid typed coordinates and measures distance in meters', () => {
    expect(parseCoordinates('10.0452, 105.7469')).toEqual(canTho);
    expect(distanceBetween(canTho, canTho)).toBe(0);
    expect(distanceBetween(canTho, { lat: 10.0462, lng: 105.7469 })).toBeGreaterThan(100);
  });
});
