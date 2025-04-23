# Zod4Vibe - Angular 19 Product & Posts Viewer

A modern Angular 19 application that demonstrates best practices in type safety, state management, and UI implementation using Angular Material. The application integrates with DummyAPI to display products and posts with pagination and sorting capabilities.

## Features

- 🚀 Built with Angular 19 and Zod4 for type safety
- 📱 Responsive Material Design UI
- 🔄 Real-time data fetching with type validation
- 📊 Pagination and sorting for both Products and Posts
- 🎨 Angular Material Icons integration
- 🛡️ Strong TypeScript typing throughout the application

## Tech Stack

- Angular 19
- Zod4 for runtime type validation
- Angular Material for UI components
- DummyAPI for mock data
- TypeScript for type safety

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Angular CLI (v19)

## Local Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd zod-4-vibe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## Project Structure

- `/src/app/components` - Reusable UI components
- `/src/app/pages` - Main page components (Home and Posts)
- `/src/app/services` - API services and data fetching
- `/src/app/models` - TypeScript interfaces and Zod schemas
- `/src/app/shared` - Shared utilities and constants

## API Integration

The application uses DummyAPI endpoints:
- Products: `https://dummyjson.com/products`
- Posts: `https://dummyjson.com/posts`

All API responses are validated using Zod4 schemas to ensure type safety.

## Development

### Available Scripts

- `ng serve` - Start development server
- `ng build` - Build the application
- `ng test` - Run unit tests
- `ng lint` - Run linting

### Code Style

This project follows Angular's official style guide and best practices. Make sure to:
- Use standalone components
- Implement proper type safety with Zod4
- Follow Angular Material design patterns
- Write clean, maintainable code

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.