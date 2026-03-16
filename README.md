# Calculator

A safe, accessible calculator built with **TypeScript** and **Vite**.

## Features

- Basic arithmetic: `+`, `-`, `×`, `÷`, `%`
- Safe expression evaluation — no `eval()`, uses a recursive-descent parser
- Full keyboard support
- Accessible: ARIA labels, `aria-live` display, `:focus-visible` styles
- Responsive layout, dark/light mode via `prefers-color-scheme`
- Error handling: division by zero, invalid expressions

## Keyboard Shortcuts

| Key                     | Action                |
| ----------------------- | --------------------- |
| `0`–`9`, `.`            | Digit / decimal       |
| `+`, `-`, `*`, `/`, `%` | Operators             |
| `Enter` or `=`          | Evaluate              |
| `Backspace`             | Delete last character |
| `Escape` or `Delete`    | Clear                 |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Stack

- **TypeScript** — type safety
- **Vite** — dev server + bundler
- **Vitest** — unit testing
- **ESLint** + **Prettier** — linting and formatting
- **Husky** + **lint-staged** — pre-commit quality checks

## Authors

- [@adrianjiga](https://github.com/adrianjiga)
