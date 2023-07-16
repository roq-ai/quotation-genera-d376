const mapping: Record<string, string> = {
  customers: 'customer',
  'printing-requests': 'printing_request',
  quotations: 'quotation',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
