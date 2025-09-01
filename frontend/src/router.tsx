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
import IdentidadNueva from "./pages/IdentidadNueva.tsx";
import AccionNueva from "./pages/AccionNueva.tsx";
import AccionDetalle from "./pages/AccionDetalle.tsx";
import RegistroInicial from "./pages/NuevoUsuario.tsx";

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
    path: '/registro-inicial',
    element: <RegistroInicial />
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
          { path: "identidades/nueva", element: <IdentidadNueva /> }
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
          { path: "diario/nueva", element: <AccionNueva /> },
          { path: "diario/:accionId", element: <AccionDetalle /> }

        ],
      },

    ],
  },

]);

export default router;
