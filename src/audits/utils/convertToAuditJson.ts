export function toAuditJson<T>(data: T) {
  return JSON.parse(JSON.stringify(data));
}
