# Design System

Shared design foundations for the projects in this workspace. The first release defines the common color tokens and includes a visual catalog for inspecting them.

## Consume the tokens

Install from the Git repository after it is accessible to the consuming project:

```sh
npm install github:<owner>/design-system
```

Import the stylesheet once from the app entry point:

```ts
import "design-system/tokens.css";
```

Then reference variables in app styles:

```css
.panel {
  color: var(--ds-color-text-primary);
  background: var(--ds-color-surface);
  border: 1px solid var(--ds-color-border);
}
```

The catalog reads the same `tokens.css` file. App-specific layouts and typography should stay local unless they become shared conventions.

## Run the catalog

```sh
npm install
npm run dev
```

`npm run build` creates the static catalog in `dist/`. Only `tokens.css` is exported to consuming apps.
