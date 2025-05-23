# 8E Degrees Frontend

This is the frontend application for the 8E Degrees system. It provides a user interface for inventory management, accounting, and customer management.

## Getting Started

### Prerequisites
- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

- `src/components/shared` - Reusable components used across the application
- `src/layouts` - Layout components that define the structure of pages
- `src/pages` - Page components for different sections of the application

## Notes

- The sidebar navigation is used throughout the application except for the POS subsystem.
- MUI (Material UI) is used for UI components.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
