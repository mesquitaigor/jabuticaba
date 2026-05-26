import { safeStringify } from './serialize';

describe('safeStringify', () => {
  describe('dado um objeto com dados sensíveis', () => {
    it('precisa redactar valores de chaves sensíveis', () => {
      const input = { password: '1234', token: 'abc', user: 'igor' };
      const result = safeStringify(input);
      const parsed = JSON.parse(result);

      expect(parsed.password).toBe('[REDACTED]');
      expect(parsed.token).toBe('[REDACTED]');
      expect(parsed.user).toBe('igor');
    });

    it('precisa redactar chaves sensíveis independente de capitalização', () => {
      const input = {
        Password: 'pass',
        AUTHORIZATION: 'bearer xyz',
        Secret: 'shh',
      };
      const result = safeStringify(input);
      const parsed = JSON.parse(result);

      expect(parsed.Password).toBe('[REDACTED]');
      expect(parsed.AUTHORIZATION).toBe('[REDACTED]');
      expect(parsed.Secret).toBe('[REDACTED]');
    });
  });

  describe('dado um objeto com tipos especiais', () => {
    it('precisa serializar BigInt como string', () => {
      const input = { value: BigInt(9007199254740991) };
      const result = safeStringify(input);
      const parsed = JSON.parse(result);

      expect(parsed.value).toBe('9007199254740991');
    });

    it('precisa serializar Map com __type e entradas', () => {
      const input = { data: new Map([['key', 'val']]) };
      const result = safeStringify(input);
      const parsed = JSON.parse(result);

      expect(parsed.data.__type).toBe('Map');
      expect(parsed.data.value).toEqual([['key', 'val']]);
    });

    it('precisa serializar Set com __type e valores', () => {
      const input = { data: new Set([1, 2, 3]) };
      const result = safeStringify(input);
      const parsed = JSON.parse(result);

      expect(parsed.data.__type).toBe('Set');
      expect(parsed.data.value).toEqual([1, 2, 3]);
    });

    it('precisa serializar Date como ISO string', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const input = { createdAt: date };
      const result = safeStringify(input);
      const parsed = JSON.parse(result);

      expect(parsed.createdAt).toBe('2024-01-15T12:00:00.000Z');
    });
  });

  describe('dado um objeto com referências circulares', () => {
    it('precisa substituir referências circulares por [Circular]', () => {
      const obj: Record<string, unknown> = { name: 'test' };
      obj['self'] = obj;
      const result = safeStringify(obj);
      const parsed = JSON.parse(result);

      expect(parsed.self).toBe('[Circular]');
      expect(parsed.name).toBe('test');
    });
  });

  describe('dado o parâmetro space', () => {
    it('precisa usar indentação padrão de 2 espaços', () => {
      const result = safeStringify({ a: 1 });

      expect(result).toBe(JSON.stringify({ a: 1 }, null, 2));
    });

    it('precisa respeitar o parâmetro space customizado', () => {
      const result = safeStringify({ a: 1 }, 4);

      expect(result).toBe(JSON.stringify({ a: 1 }, null, 4));
    });
  });
});
