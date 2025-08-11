# Shorter URL

A modern web application for creating and managing shortened URLs with analytics and tracking capabilities.

## Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Analytics Dashboard**: Track clicks, visits, and performance metrics
- **Custom Short Codes**: Generate custom short codes for your URLs
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Statistics**: Monitor your shortened URLs in real-time

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with modern design principles
- **State Management**: React hooks and context
- **Routing**: React Router for navigation

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd shorter-url
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ResultsList.tsx # Displays shortened URLs
│   └── ShortenForm.tsx # URL shortening form
├── pages/              # Page components
│   ├── HomePage.tsx    # Main landing page
│   ├── StatsPage.tsx   # Analytics dashboard
│   ├── RedirectPage.tsx # URL redirection logic
│   └── ErrorPage.tsx   # Error handling
├── services/           # API and external services
│   └── shorten.ts     # URL shortening service
├── storage/            # Data persistence
│   └── repo.ts        # Storage repository
├── utils/              # Utility functions
│   ├── analytics.ts   # Analytics utilities
│   ├── shortCode.ts   # Short code generation
│   ├── time.ts        # Time-related utilities
│   └── validation.ts  # Input validation
└── logger/             # Logging functionality
    └── logger.ts      # Logger implementation
```

## Usage

1. **Shorten a URL**: Enter a long URL in the form and click "Shorten"
2. **View Statistics**: Check the Stats page to see analytics for your shortened URLs
3. **Share Links**: Copy and share your shortened URLs with others
4. **Track Performance**: Monitor click-through rates and visitor analytics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and TypeScript
- Styled with modern CSS principles
- Powered by Vite for fast development and building
