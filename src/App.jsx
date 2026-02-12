import { useRoutes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/auth/Login";
import PrivateRoute from "./routes/PrivateRoute";
import AdminLayout from "./layouts/AdminLayout";
import { useAdminRoutes } from "./routes/useAdminRoutes";
import { selectCurrentToken } from "./redux/features/auth/authSlice";
import { Toaster } from 'react-hot-toast';

function AppRoutes() {
  const adminRoutes = useAdminRoutes();
  const token = useSelector(selectCurrentToken);

  const element = useRoutes([
    {
      path: "/",
      element: token ? <Navigate to="/admin" replace /> : <Navigate to="/login" replace />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/auth/login",
      element: <Login />,
    },
    {
      path: "/admin",
      element: <PrivateRoute />,
      children: [
        {
          element: <AdminLayout />,
          children: adminRoutes,
        },
      ],
    },
  ]);

  return element;
}

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
