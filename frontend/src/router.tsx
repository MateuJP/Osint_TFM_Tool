// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";
import Identidades from "./pages/Identidades";
import Cuentas from "./pages/Cuentas";
import Diario from "./pages/Diario";
import Asistente from "./pages/Asistente";
import Ajustes from "./pages/Ajustes";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "identidades", element: <Identidades /> },
      { path: "cuentas", element: <Cuentas /> },
      { path: "diario", element: <Diario /> },
      { path: "asistente", element: <Asistente /> },
      { path: "ajustes", element: <Ajustes /> },
    ],
  },
  { path: "/login", element: <Login /> },
]);

export default router;
