const SENSITIVE_KEYS = ['password', 'token', 'authorization', 'secret'];

export function safeStringify(value: unknown, space = 2): string {
  const seen = new WeakSet();

  return JSON.stringify(
    value,
    (key, val) => {
      if (SENSITIVE_KEYS.includes(key.toLowerCase())) return '[REDACTED]';
      if (typeof val === 'bigint') return val.toString();
      if (val instanceof Map) return { __type: 'Map', value: [...val] };
      if (val instanceof Set) return { __type: 'Set', value: [...val] };
      if (val instanceof Date)
        return { __type: 'Date', value: val.toISOString() };
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) return '[Circular]';
        seen.add(val);
      }
      return val;
    },
    space,
  );
}
