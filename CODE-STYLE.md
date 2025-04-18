# TracTube Code Style Guide

## JavaScript Conventions

### General

- Use ES6+ features (const/let, arrow functions, etc.)
- Strict mode enabled (`'use strict'`)
- Module pattern with `window.TracTube` namespace
- Avoid global variables except for the namespace

### Formatting

- 2 space indentation
- Semicolons
- Single quotes for strings
- Braces on same line for control structures
- Max line length: 100 characters

### Naming

- `PascalCase` for constructor functions
- `camelCase` for variables and functions
- `UPPER_CASE` for constants
- `_prefix` for private members
- Descriptive names avoiding abbreviations

### Comments

- JSDoc for public functions
- Single-line comments for complex logic
- Avoid obvious comments
- Group related code with section comments

## CSS Conventions

### Structure

- BEM-like naming: `.block__element--modifier`
- Component-scoped classes prefixed with `tractube-`
- Group related properties
- Mobile-first approach

### Formatting

- 2 space indentation
- One selector per line
- One property per line
- Space after colon
- No space before opening brace
- Closing brace on new line

## File Structure

### JavaScript

- One feature per file in `features/` directory
- Main files in root:
  - `content.js`: Main content script
  - `popup.js`: Popup logic
- Feature files named descriptively (`hide-comments.js`)

### HTML

- Semantic HTML5
- Minimal markup
- Accessibility attributes
- Data attributes for JS hooks

### CSS

- `styles.css`: Global styles
- `popup.css`: Popup-specific styles
- Feature styles in main CSS files

## Best Practices

### JavaScript

- Use strict equality (`===`)
- Avoid `eval()` and `with`
- Prefer template literals
- Handle errors gracefully
- Debounce DOM operations

### CSS

- Avoid `!important`
- Use variables for colors
- Prefer flexbox/grid
- Mobile-responsive
- Comment complex layouts

### Performance

- Efficient selectors
- Minimize reflows
- Throttle event handlers
- Lazy load when possible
- Cache DOM references

## Linting

- ESLint with recommended rules
- Prettier for formatting
- EditorConfig for consistency
