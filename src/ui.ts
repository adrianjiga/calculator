/**
 * UI module — owns all DOM reads/writes.
 * Business logic lives in calculator.ts; this module only renders state.
 */

export interface UIElements {
  display: HTMLInputElement;
  calculator: HTMLElement;
}

/**
 * Resolves and validates the required DOM elements.
 * Throws if any element is missing (programming error, not runtime error).
 */
export function resolveElements(): UIElements {
  const display = document.getElementById('result') as HTMLInputElement | null;
  const calculator = document.querySelector('.calculator') as HTMLElement | null;

  if (!display) throw new Error('Missing #result element');
  if (!calculator) throw new Error('Missing .calculator element');

  return { display, calculator };
}

/**
 * Renders a new expression value into the display.
 * Clears any error state.
 */
export function renderExpression(display: HTMLInputElement, expression: string): void {
  display.value = expression;
  display.classList.remove('display--error');
  display.removeAttribute('aria-invalid');
}

/**
 * Renders an error message into the display.
 */
export function renderError(display: HTMLInputElement, message: string): void {
  display.value = message;
  display.classList.add('display--error');
  display.setAttribute('aria-invalid', 'true');
}
