import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { useAppStore } from "./store/useAppStore";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Profile from "./pages/Profile/Profile";
import PostJob from "./pages/PostJob/PostJob";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard/Dashboard";
import JobDetails from "./pages/JobDetails/JobDetails";
import SavedJobs from "./pages/SavedJobs/SavedJobs";

const RootLayout = () => {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content-area">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-container">
          <p className="footer-text">
            © 2026 CareerPulse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  const queryClient = new QueryClient();
  const user = useAppStore((state) => state.user);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "login",
          element: user ? <Navigate to={"/"} replace /> : <Login />,
        },
        {
          path: "signup",
          element: user ? <Navigate to={"/"} replace /> : <Signup />,
        },
        {
          path: "job/:id",
          element: <JobDetails />,
        },
        {
          path: "profile",
          element: (
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          ),
        },

        {
          path: "dashboard",
          element: (
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          ),
        },
        {
          path: "saved-jobs",
          element: (
            <PrivateRoute role="SEEKER">
              <SavedJobs />
            </PrivateRoute>
          ),
        },
        {
          path: "post-job",
          element: (
            <PrivateRoute role="RECRUITER">
              <PostJob />
            </PrivateRoute>
          ),
        },
        {
          path: "*",
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer autoClose={2000} />
    </QueryClientProvider>
  );
}

export default App;
