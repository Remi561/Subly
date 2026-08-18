import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router";
// import Home from "./pages/Home.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgetPwd from "./pages/auth/ForgetPwd.jsx";

import Overview from "./pages/dashboard/Overview.jsx";
import Settings from "./pages/dashboard/Settings.jsx";
import AccountInfo from "./pages/dashboard/settings/AccountInfo.jsx";
import Security from "./pages/dashboard/settings/Security.jsx";
import Notification from "./pages/dashboard/Notification.jsx";
import History from "./pages/dashboard/History.jsx";
import Admin from "./pages/dashboard/Admin.jsx";
import Subscriptions from "./pages/dashboard/Subscriptions.jsx";
import Dashboard from "./layout/Dashboard.jsx";
import Add from "./pages/dashboard/subscription/Add";
import Edit from "./pages/dashboard/subscription/Edit";
import Error from "./pages/Error";
import Protected from './components/dashboard/Protected'
import Public from './components/dashboard/Public'
import NotFound from "./pages/NotFound";




import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from '@clerk/react';
import { Login } from './pages/auth/Login';
import Loading from './components/Loading';
import Renew from './pages/dashboard/subscription/Renew';

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
    element: <Public/>,
    children: [
      {
        path: "/",
        element: <App />,
      },
    
      {
        path: "/auth",
    
        children: [
          { path: "login", element: <Login/> },
          { path: "register", element: <Register /> },
          { path: "forgot-password", element: <ForgetPwd /> },
      
        ],
      },
    ]
  },
  

  {
    element: <Protected/>,
    children: [
      {
        element: <Dashboard />,
        path: "/dashboard",
        
    
        hydrateFallbackElement: <Loading/>,
        errorElement: <Error />,
        children: [
          {
            index: true,
            element: <Overview />,
          },
          {
            path: "subscriptions",
            element: <Subscriptions />,
          },
          { path: "subscriptions/add", element: <Add /> }, 
          { path: "subscriptions/:id/edit", element: <Edit /> },
          {path: "subscriptions/:id/renew", element: <Renew/>},
          { path: "notifications", element: <Notification /> },
          { path: "history", element: <History /> },
          { path: "admin", element: <Admin /> },
          {
            path: "settings",
            element: <Settings />,
            children: [
              { index: true, element: <AccountInfo /> },
              { path: "security", element: <Security /> },
            ],
          },
          { path: "*", element: <NotFound /> },
        ],
      },
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={key}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      <Analytics />
    </QueryClientProvider>
    </ClerkProvider>
   
  </StrictMode>,
);
