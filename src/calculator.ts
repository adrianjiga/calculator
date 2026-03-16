/**
 * Safe recursive-descent math expression evaluator.
 * Supports: +, -, *, /, unary minus, parentheses, integers, decimals.
 * No eval() or Function() — all parsing is done explicitly.
 *
 * Grammar:
 *   expr   → term   (('+' | '-') term)*
 *   term   → factor (('*' | '/') factor)*
 *   factor → '-' factor | '+' factor | '(' expr ')' | number
 */

export type EvalSuccess = { value: number; error: null };
export type EvalFailure = { value: null; error: string };
export type EvalResult = EvalSuccess | EvalFailure;

// ---------------------------------------------------------------------------
// Tokeniser
// ---------------------------------------------------------------------------

type TokenType = 'number' | '+' | '-' | '*' | '/' | '(' | ')';

interface Token {
  type: TokenType;
  value?: number;
}

const OPERATOR_CHARS = new Set(['+', '-', '*', '/', '(', ')']);

function tokenise(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    if (ch === ' ' || ch === '\t') {
      i++;
      continue;
    }

    if (ch >= '0' && ch <= '9') {
      let raw = '';
      let dotCount = 0;

      while (i < expr.length && ((expr[i] >= '0' && expr[i] <= '9') || expr[i] === '.')) {
        if (expr[i] === '.') {
          dotCount++;
          if (dotCount > 1) throw new SyntaxError('Invalid number: multiple decimal points');
        }
        raw += expr[i];
        i++;
      }

      tokens.push({ type: 'number', value: parseFloat(raw) });
      continue;
    }

    if (OPERATOR_CHARS.has(ch)) {
      tokens.push({ type: ch as TokenType });
      i++;
      continue;
    }

    throw new SyntaxError(`Unexpected character: "${ch}"`);
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

class Parser {
  private readonly tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): number {
    if (this.tokens.length === 0) throw new SyntaxError('Empty expression');
    const result = this.parseExpr();
    if (this.pos < this.tokens.length) {
      throw new SyntaxError('Unexpected token after expression');
    }
    return result;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    const tok = this.tokens[this.pos++];
    if (tok === undefined) throw new SyntaxError('Unexpected end of expression');
    return tok;
  }

  private match(type: TokenType): boolean {
    return this.peek()?.type === type;
  }

  private parseExpr(): number {
    let left = this.parseTerm();

    while (this.match('+') || this.match('-')) {
      const op = this.consume().type;
      const right = this.parseTerm();
      left = op === '+' ? left + right : left - right;
    }

    return left;
  }

  private parseTerm(): number {
    let left = this.parseFactor();

    while (this.match('*') || this.match('/')) {
      const op = this.consume().type;
      const right = this.parseFactor();

      if (op === '/') {
        if (right === 0) throw new RangeError('Division by zero');
        left /= right;
      } else {
        left *= right;
      }
    }

    return left;
  }

  private parseFactor(): number {
    // Unary minus
    if (this.match('-')) {
      this.consume();
      return -this.parseFactor();
    }

    // Unary plus (no-op)
    if (this.match('+')) {
      this.consume();
      return this.parseFactor();
    }

    // Grouped expression
    if (this.match('(')) {
      this.consume();
      const val = this.parseExpr();
      if (!this.match(')')) throw new SyntaxError('Missing closing parenthesis');
      this.consume();
      return val;
    }

    // Number literal
    const tok = this.peek();
    if (tok?.type === 'number') {
      this.consume();
      return tok.value!;
    }

    throw new SyntaxError('Expected a number or "("');
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Safely evaluates a math expression string.
 * Returns { value: number, error: null } on success,
 * or { value: null, error: string } on failure.
 */
export function evaluate(expr: string): EvalResult {
  const trimmed = expr.trim();

  if (trimmed === '') {
    return { value: null, error: 'Empty expression' };
  }

  try {
    const tokens = tokenise(trimmed);
    const parser = new Parser(tokens);
    const value = parser.parse();

    if (!isFinite(value)) {
      return { value: null, error: 'Math error' };
    }

    return { value, error: null };
  } catch (err) {
    if (err instanceof RangeError) {
      return { value: null, error: 'Division by zero' };
    }
    return { value: null, error: 'Invalid expression' };
  }
}

/**
 * Formats a number result for display:
 * - Integers are shown without decimals.
 * - Floating-point results are rounded to avoid floating-point noise.
 */
export function formatResult(value: number): string {
  if (Number.isInteger(value)) return String(value);
  // Round to 10 significant digits to avoid floating-point noise (e.g. 0.1+0.2)
  return parseFloat(value.toPrecision(10)).toString();
}
