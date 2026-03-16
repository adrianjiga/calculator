/**
 * Entry point — wires together UI, events, and calculator logic.
 */

import { evaluate, formatResult } from './calculator.js';
import { resolveElements, renderExpression, renderError } from './ui.js';
import { bindButtons, bindKeyboard, type Action } from './events.js';

interface CalcState {
  expression: string;
  /** True immediately after a successful = press, until the next input. */
  justEvaluated: boolean;
}

const state: CalcState = {
  expression: '',
  justEvaluated: false,
};

function handleAction(action: Action, display: HTMLInputElement): void {
  switch (action.type) {
    case 'clear':
      state.expression = '';
      state.justEvaluated = false;
      renderExpression(display, '');
      break;

    case 'backspace':
      if (state.justEvaluated) {
        state.expression = '';
        state.justEvaluated = false;
      } else {
        state.expression = state.expression.slice(0, -1);
      }
      renderExpression(display, state.expression);
      break;

    case 'calculate': {
      const result = evaluate(state.expression);
      if (result.error !== null) {
        renderError(display, result.error);
        state.expression = '';
        state.justEvaluated = false;
      } else {
        const formatted = formatResult(result.value);
        state.expression = formatted;
        state.justEvaluated = true;
        renderExpression(display, formatted);
      }
      break;
    }

    case 'input': {
      const { value } = action;
      const isOperator = ['+', '-', '*', '/', '%'].includes(value);

      if (state.justEvaluated) {
        // After evaluation: digit starts fresh; operator continues from result
        state.expression = isOperator ? state.expression + value : value;
        state.justEvaluated = false;
      } else {
        state.expression += value;
      }

      renderExpression(display, state.expression);
      break;
    }
  }
}

function init(): void {
  const { display, calculator } = resolveElements();

  bindButtons(calculator, (action) => handleAction(action, display));
  bindKeyboard((action) => handleAction(action, display));
}

init();
