# Carbon Footprint Awareness Platform

A React + Node.js app built for PromptWars Challenge 3.

## Features

- Interactive carbon footprint calculator
- Personalized insights and tiered recommendations
- Local history tracking via browser storage
- Backend API for action recommendations
- Clean responsive design with intuitive controls

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start in development mode:

```bash
npm run dev
```

3. Open the frontend at `http://localhost:5173`.

## Build for production

```bash
npm run build
npm start
```

The production server will serve the built frontend and the API on `http://localhost:4000`.

## Notes

- The app stores saved entries in local storage so you can revisit progress without a database.
- The backend provides a simple `/api/actions` endpoint for dynamic climate recommendations.
