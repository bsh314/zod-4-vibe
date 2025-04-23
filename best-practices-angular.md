# Angular 19 Best Practices Guide

## Table of Contents
1. [Performance Optimization](#performance-optimization)
2. [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
3. [Component Architecture](#component-architecture)
4. [State Management](#state-management)
5. [Security](#security)
6. [Development Workflow](#development-workflow)
7. [Testing](#testing)
8. [Styling and Theming](#styling-and-theming)

## Performance Optimization

### Incremental Hydration
- Use the `@defer` directive for lazy loading components
- Implement incremental hydration for SSR applications:
```typescript
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';

// In your bootstrap
provideClientHydration(withIncrementalHydration());

// In your templates
@defer (hydrate on viewport) {
  <heavy-component/>
}
```

### Route-Level Rendering
- Configure render modes per route based on content type:
```typescript
export const serverRouteConfig: ServerRoute[] = [
  { path: '/login', mode: RenderMode.Server },
  { path: '/dashboard', mode: RenderMode.Client },
  { path: '/**', mode: RenderMode.Prerender }
];
```

## Server-Side Rendering (SSR)

### Event Replay
- Enable event replay for better user experience during hydration:
```typescript
bootstrapApplication(App, {
  providers: [
    provideClientHydration(withEventReplay())
  ]
});
```

### Route Parameters Resolution
- Use the new route configuration for prerendering with parameters:
```typescript
export const routeConfig: ServerRoute = [{
  path: '/product/:id',
  mode: 'prerender',
  async getPrerenderPaths() {
    const dataService = inject(ProductService);
    const ids = await dataService.getIds();
    return ids.map(id => ({ id }));
  }
}];
```

## Component Architecture

### Standalone Components
- Use standalone components by default (now the standard in Angular 19)
- Enable strict standalone enforcement:
```json
{
  "angularCompilerOptions": {
    "strictStandalone": true
  }
}
```

### Modern Input/Output Pattern
- Use the new signal-based input syntax
- Migrate existing components using the CLI:
```bash
ng generate @angular/core:signal-input-migration
ng generate @angular/core:signal-queries-migration
ng generate @angular/core:output-migration
```

## State Management

### Signals for Local State
- Use signals for component-level state management:
```typescript
const options = signal(['apple', 'banana', 'fig']);
const choice = linkedSignal(() => options()[0]);
```

### Resource API for Async Operations
- Implement the new resource API for data fetching:
```typescript
@Component({})
export class UserProfile {
  userId = input<number>();
  userService = inject(UserService);
  
  user = resource({
    request: this.userId,
    loader: async ({request: id}) => await userService.getUser(id)
  });
}
```

## Security

### Content Security Policy
- Enable automatic CSP generation:
```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "autoCSP": true
          }
        }
      }
    }
  }
}
```

## Development Workflow

### Hot Module Replacement (HMR)
- Enable HMR for faster development:
```bash
# For styles (enabled by default)
ng serve

# For templates (experimental)
NG_HMR_TEMPLATES=1 ng serve
```

### Environment Variables
- Use the new CLI flag for environment variables:
```bash
ng build --define "apiKey='$API_KEY'"
```

### Unused Imports
- Enable unused imports checking:
```json
{
  "angularCompilerOptions": {
    "extendedDiagnostics": {
      "checks": {
        "unusedStandaloneImports": "warning"
      }
    }
  }
}
```

## Testing

### Modern Testing Approach
- Use real browser testing for unit tests
- Leverage the new application builder for Karma tests:
```json
{
  "test": {
    "builder": "@angular-devkit/build-angular:karma",
    "options": {
      "builderMode": "application"
    }
  }
}
```

## Styling and Theming

### Material Design
- Use the simplified theming API:
```scss
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: (
      primary: mat.$violet-palette,
      tertiary: mat.$orange-palette,
      theme-type: light
    ),
    typography: Roboto,
    density: 0
  ));
}
```

### Component Style Overrides
- Implement component-specific overrides:
```scss
@include mat.sidenav-overrides((
  'content-background-color': purple,
  'container-divider-color': orange
));
```

---

These best practices are based on Angular 19's latest features and recommendations. Always refer to the official Angular documentation for the most up-to-date information and detailed implementation guides.