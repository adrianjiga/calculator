import { describe, it, expect, beforeEach } from 'vitest';
import { resolveElements, renderExpression, renderError } from '../src/ui';

function createDOM(): void {
  document.body.innerHTML = `
    <main class="calculator">
      <input type="text" id="result" readonly />
    </main>
  `;
}

describe('resolveElements', () => {
  beforeEach(createDOM);

  it('resolves display and calculator elements', () => {
    const { display, calculator } = resolveElements();
    expect(display).toBeInstanceOf(HTMLInputElement);
    expect(calculator).toBeInstanceOf(HTMLElement);
  });

  it('throws when #result is missing', () => {
    document.body.innerHTML = '<main class="calculator"></main>';
    expect(() => resolveElements()).toThrow('Missing #result element');
  });

  it('throws when .calculator is missing', () => {
    document.body.innerHTML = '<input type="text" id="result" />';
    expect(() => resolveElements()).toThrow('Missing .calculator element');
  });
});

describe('renderExpression', () => {
  beforeEach(createDOM);

  it('sets the display value', () => {
    const { display } = resolveElements();
    renderExpression(display, '42');
    expect(display.value).toBe('42');
  });

  it('removes error class when rendering a normal expression', () => {
    const { display } = resolveElements();
    display.classList.add('display--error');
    display.setAttribute('aria-invalid', 'true');
    renderExpression(display, '5');
    expect(display.classList.contains('display--error')).toBe(false);
    expect(display.getAttribute('aria-invalid')).toBeNull();
  });
});

describe('renderError', () => {
  beforeEach(createDOM);

  it('sets the error message as display value', () => {
    const { display } = resolveElements();
    renderError(display, 'Division by zero');
    expect(display.value).toBe('Division by zero');
  });

  it('adds error CSS class', () => {
    const { display } = resolveElements();
    renderError(display, 'Error');
    expect(display.classList.contains('display--error')).toBe(true);
  });

  it('sets aria-invalid="true"', () => {
    const { display } = resolveElements();
    renderError(display, 'Error');
    expect(display.getAttribute('aria-invalid')).toBe('true');
  });
});
