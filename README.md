# WeatherNow — React Weather UI

A responsive React + Vite weather dashboard with city search, current conditions, weather details, a Celsius/Fahrenheit toggle, and a 5-day forecast.

## Requirements
- Node.js (LTS recommended)
- An OpenWeather API key

## Setup
1. Extract the ZIP file.
2. Open the extracted `weather-app-ui` folder in VS Code.
3. Open a terminal in that folder and run:

   ```bash
   npm install
   ```

4. Copy `.env.example` to a new file named `.env`.
5. Add your API key:

   ```env
   VITE_WEATHER_API_KEY=your_actual_api_key
   ```

6. Start the app:

   ```bash
   npm run dev
   ```

7. Open the local URL Vite prints, usually `http://localhost:5173`.

## Notes
- This is the frontend UI only; no backend or database is included.
- Weather data comes from OpenWeather's Current Weather and 5 Day / 3 Hour Forecast APIs.
- The API key in a Vite frontend is visible to browser users. For a public production deployment, proxy requests through a backend.
- If your key has just been created, it may take time to become active.
