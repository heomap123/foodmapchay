export interface LocationSelection {
  province: string;
  district: string;
  ward: string;
  point: string;
}

export const LOCATION_TREE: Record<string, Record<string, string[]>> = {
  'Cần Thơ': {
    'Ninh Kiều': ['An Hòa', 'An Khánh', 'Cái Khế', 'Thới Bình', 'Tân An', 'Xuân Khánh'],
    'Bình Thủy': ['An Thới', 'Bình Thủy', 'Thới An', 'Thới Nhựt', 'Trà Nóc'],
    'Ô Môn': ['Châu Văn Liêm', 'Thới Hòa', 'Trường Lạc', 'Thới An', 'Thạnh Phú'],
    'Cái Răng': ['Ba Láng', 'Hưng Phú', 'Lê Bình', 'Tân Hưng', 'Thường Thạnh'],
    'Thốt Nốt': ['Thốt Nốt', 'Trung Nhứt', 'Thường Thạnh', 'Vĩnh Trinh'],
  },
};

export function normalizeLocationToken(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function getProvinceOptions(): string[] {
  return Object.keys(LOCATION_TREE);
}

export function getDistrictOptions(province: string): string[] {
  return Object.keys(LOCATION_TREE[province] ?? {});
}

export function getWardOptions(province: string, district: string): string[] {
  return LOCATION_TREE[province]?.[district] ?? [];
}

export function buildLocationLabel(selection: LocationSelection): string {
  const parts = [selection.province, selection.district, selection.ward, selection.point].filter(Boolean);
  return parts.length ? parts.join(' / ') : 'Toàn thành phố';
}

export function matchesLocationFilter(address: string, selection: LocationSelection): boolean {
  const normalizedAddress = normalizeLocationToken(address);
  const selectedValues = [selection.point, selection.ward, selection.district].filter(Boolean).map((value) => normalizeLocationToken(value));

  if (selectedValues.length === 0) {
    const province = normalizeLocationToken(selection.province);
    return !province || normalizedAddress.includes(province) || normalizedAddress.includes(province.replace(/\s+/g, ''));
  }

  return selectedValues.some((value) => {
    if (!value) return false;
    return normalizedAddress.includes(value) || normalizedAddress.includes(value.replace(/\s+/g, ''));
  });
}
