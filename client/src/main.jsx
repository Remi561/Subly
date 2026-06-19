import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router";
// import Home from "./pages/Home.jsx";
import Auth from "./pages/auth/Auth.jsx";
import { register, login } from "./lib/action.js";
import Overview from "./pages/dashboard/Overview.jsx";
import Settings from "./pages/dashboard/Settings.jsx";
import Notification from "./pages/dashboard/Notification.jsx";
import History from "./pages/dashboard/History.jsx";
import Subscriptions from "./pages/dashboard/Subscriptions.jsx";
import Dashboard from "./layout/Dashboard.jsx";
import Add from "./pages/dashboard/subscription/Add";
import Edit from "./pages/dashboard/subscription/Edit";
import Error from "./pages/Error";

import { dashboardLoader } from "./lib/loader.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/auth",

    children: [
      { path: "login", element: <Auth />, action: login },
      { path: "register", element: <Auth />, action: register },
    ],
  },

  {
    element: <Dashboard />,
    path: "/dashboard",
    loader: dashboardLoader,
    shouldRevalidate: ({ currentUrl, nextUrl }) => {
      return currentUrl.hostname !== nextUrl.hostname;
    },
    id: "dashboard",
    hydrateFallbackElement: <div>Loading...</div>,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Overview />,

        hydrateFallbackElement: <div>Loading...</div>,
      },
      {
        path: "subscriptions",
        element: <Subscriptions />,
      },
      { path: "subscriptions/add", element: <Add /> },
      { path: "subscriptions/:id/edit", element: <Edit /> },
      { path: "notifications", element: <Notification /> },
      { path: "history", element: <History /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  </StrictMode>,
);
