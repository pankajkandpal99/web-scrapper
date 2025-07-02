import React, { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
// const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));  // This is in for Future, if required...
const NotFound = lazy(() => import("../pages/NotFound"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));

const ScrapeNow = lazy(() => import("../pages/ScrapeNow"));
const ScrapedData = lazy(() => import("../pages/ScrapedData"));
const SavedUrls = lazy(() => import("../pages/SavedUrls"));
const Settings = lazy(() => import("../pages/Settings"));

interface RouteConfig {
  path: string;
  element: React.ComponentType;
  fullWidth?: boolean;
}

export const publicRoutes: RouteConfig[] = [
  { path: "/", element: Home, fullWidth: true },
  { path: "/about", element: About },
];

export const authRoutes: RouteConfig[] = [
  { path: "/login", element: Login },
  { path: "/register", element: Register },
];

export const protectedRoutes: RouteConfig[] = [
  // { path: "/admin-dashboard", element: AdminDashboard },
  { path: "/scrape", element: ScrapeNow },
  { path: "/data", element: ScrapedData },
  { path: "/urls", element: SavedUrls },
  { path: "/settings", element: Settings },
];

export const notFoundRoute: RouteConfig = { path: "*", element: NotFound };
