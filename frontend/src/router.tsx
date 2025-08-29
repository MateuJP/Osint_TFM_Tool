import { createBrowserRouter } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";
import GlobalLayout from "./layouts/GlobalLayout.tsx";
import IdentityLayout from "./layouts/IdentityLayout.tsx";
import { useAuth } from "./context/AuthContext.tsx";

import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard";
import Identidades from "./pages/Identidades";
import Ajustes from "./pages/Ajustes";
import Cuentas from "./pages/Cuentas";
import Diario from "./pages/Diario";
import Asistente from "./pages/Asistente";
import IdentidadDetalle from "./pages/IdentidadDetalle.tsx";

function PrivateRoute() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" />;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <GlobalLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "identidades", element: <Identidades /> },
          { path: "ajustes", element: <Ajustes /> },
        ],
      },
      {
        path: "/identidad/:id",
        element: <IdentityLayout />,
        children: [
          { index: true, element: <IdentidadDetalle /> },
          { path: "cuentas", element: <Cuentas /> },
          { path: "diario", element: <Diario /> },
          { path: "asistente", element: <Asistente /> },
        ],
      },
    ],
  },

]);

export default router;
