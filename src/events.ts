/**
 * Events module — binds all user interactions (mouse + keyboard).
 * Uses event delegation on the calculator container: one listener for all buttons.
 */

export type Action =
  | { type: 'input'; value: string }
  | { type: 'calculate' }
  | { type: 'clear' }
  | { type: 'backspace' };

export type ActionHandler = (action: Action) => void;

const KEY_MAP: Record<string, Action> = {
  Enter: { type: 'calculate' },
  '=': { type: 'calculate' },
  Escape: { type: 'clear' },
  Backspace: { type: 'backspace' },
  Delete: { type: 'clear' },
  '0': { type: 'input', value: '0' },
  '1': { type: 'input', value: '1' },
  '2': { type: 'input', value: '2' },
  '3': { type: 'input', value: '3' },
  '4': { type: 'input', value: '4' },
  '5': { type: 'input', value: '5' },
  '6': { type: 'input', value: '6' },
  '7': { type: 'input', value: '7' },
  '8': { type: 'input', value: '8' },
  '9': { type: 'input', value: '9' },
  '.': { type: 'input', value: '.' },
  '+': { type: 'input', value: '+' },
  '-': { type: 'input', value: '-' },
  '*': { type: 'input', value: '*' },
  '/': { type: 'input', value: '/' },
  '%': { type: 'input', value: '%' },
};

/**
 * Binds click events on the calculator container via event delegation.
 * Each button must have a `data-action` attribute.
 */
export function bindButtons(container: HTMLElement, handler: ActionHandler): void {
  container.addEventListener('click', (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
    if (!target) return;

    const dataAction = target.dataset.action;
    if (!dataAction) return;

    switch (dataAction) {
      case 'calculate':
        handler({ type: 'calculate' });
        break;
      case 'clear':
        handler({ type: 'clear' });
        break;
      case 'backspace':
        handler({ type: 'backspace' });
        break;
      default:
        handler({ type: 'input', value: dataAction });
    }
  });
}

/**
 * Binds keyboard events on the document for full keyboard support.
 */
export function bindKeyboard(handler: ActionHandler): void {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    // Ignore modifier-key combos (Ctrl+C, Alt+F4, etc.)
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const action = KEY_MAP[e.key];
    if (!action) return;

    // Prevent '/' from triggering browser quick-find
    e.preventDefault();
    handler(action);
  });
}
