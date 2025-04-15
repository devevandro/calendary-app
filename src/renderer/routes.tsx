import { Route } from "react-router-dom";

import { Router } from "lib/electron-router-dom";

import CalendarPage from "./screens/main";
import LoginPage from "./screens/login";

export function AppRoutes() {
  return (
    <Router
      main={<Route path="/" element={<CalendarPage />} />}
      about={<Route path="/:login" element={<LoginPage />} />}
    />
  );
}
