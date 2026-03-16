import { describe, it, expect } from 'vitest';
import { evaluate, formatResult } from '../src/calculator';

describe('evaluate', () => {
  // Basic arithmetic
  it('adds two integers', () => {
    expect(evaluate('1+2')).toEqual({ value: 3, error: null });
  });

  it('subtracts two integers', () => {
    expect(evaluate('10-4')).toEqual({ value: 6, error: null });
  });

  it('multiplies two integers', () => {
    expect(evaluate('3*4')).toEqual({ value: 12, error: null });
  });

  it('divides two integers', () => {
    expect(evaluate('8/2')).toEqual({ value: 4, error: null });
  });

  // Operator precedence
  it('respects multiplication over addition', () => {
    expect(evaluate('2+3*4')).toEqual({ value: 14, error: null });
  });

  it('respects division over subtraction', () => {
    expect(evaluate('10-6/2')).toEqual({ value: 7, error: null });
  });

  // Parentheses
  it('handles parentheses overriding precedence', () => {
    expect(evaluate('(2+3)*4')).toEqual({ value: 20, error: null });
  });

  it('handles nested parentheses', () => {
    expect(evaluate('((2+3)*2)+1')).toEqual({ value: 11, error: null });
  });

  // Decimals
  it('handles decimal addition', () => {
    const result = evaluate('0.1+0.2');
    expect(result.error).toBeNull();
    expect(result.value).toBeCloseTo(0.3, 9);
  });

  it('handles decimal multiplication', () => {
    expect(evaluate('2.5*4')).toEqual({ value: 10, error: null });
  });

  // Unary minus
  it('handles unary minus on a number', () => {
    expect(evaluate('-5+10')).toEqual({ value: 5, error: null });
  });

  it('handles double negation', () => {
    expect(evaluate('--5')).toEqual({ value: 5, error: null });
  });

  // Whitespace
  it('ignores surrounding whitespace', () => {
    expect(evaluate('  3 + 4  ')).toEqual({ value: 7, error: null });
  });

  // Edge cases — errors
  it('returns error for empty expression', () => {
    expect(evaluate('')).toEqual({ value: null, error: 'Empty expression' });
  });

  it('returns error for whitespace-only expression', () => {
    expect(evaluate('   ')).toEqual({ value: null, error: 'Empty expression' });
  });

  it('returns Division by zero error', () => {
    expect(evaluate('1/0')).toEqual({ value: null, error: 'Division by zero' });
  });

  it('returns Division by zero error for expression that resolves to zero divisor', () => {
    expect(evaluate('5/(2-2)')).toEqual({ value: null, error: 'Division by zero' });
  });

  it('returns error for invalid expression (letters)', () => {
    expect(evaluate('abc')).toMatchObject({ value: null, error: expect.any(String) });
  });

  it('returns error for trailing operator', () => {
    expect(evaluate('5+')).toMatchObject({ value: null, error: expect.any(String) });
  });

  it('returns error for mismatched parentheses', () => {
    expect(evaluate('(2+3')).toMatchObject({ value: null, error: expect.any(String) });
  });

  it('returns error for multiple decimal points in one number', () => {
    expect(evaluate('1.2.3')).toMatchObject({ value: null, error: expect.any(String) });
  });

  // Large numbers
  it('handles large integer multiplication', () => {
    expect(evaluate('999999*999999')).toEqual({ value: 999998000001, error: null });
  });

  // Negative results
  it('handles subtraction yielding negative result', () => {
    expect(evaluate('3-10')).toEqual({ value: -7, error: null });
  });
});

describe('formatResult', () => {
  it('formats integers without decimals', () => {
    expect(formatResult(5)).toBe('5');
    expect(formatResult(-3)).toBe('-3');
    expect(formatResult(0)).toBe('0');
  });

  it('formats floating-point numbers', () => {
    expect(formatResult(3.14)).toBe('3.14');
    expect(formatResult(-0.5)).toBe('-0.5');
  });

  it('rounds floating-point noise', () => {
    // 0.1 + 0.2 in IEEE 754 = 0.30000000000000004
    // toPrecision(10) → '0.3000000000' → parseFloat → 0.3
    expect(formatResult(0.1 + 0.2)).toBe('0.3');
  });
});
