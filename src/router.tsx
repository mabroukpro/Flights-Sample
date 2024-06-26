import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import HomePage from "./pages/home";
import LoggedOutLayout from "./layouts/loggedOut";
import LoggedInLayout from "./layouts/loggedIn";

export const router = createBrowserRouter([
  {
    element: <LoggedOutLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    element: <LoggedInLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />,
      },
      // More routes go here
    ],
  },
]);
