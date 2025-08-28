// src/layouts/Layout.tsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 font-bold text-xl border-b">OSINT App</div>
        <nav className="flex flex-col p-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-300 font-semibold" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/identidades"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-300 font-semibold" : ""
              }`
            }
          >
            Identidades
          </NavLink>

          <NavLink
            to="/asistente"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-300 font-semibold" : ""
              }`
            }
          >
            Asistente
          </NavLink>
          <NavLink
            to="/ajustes"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-300 font-semibold" : ""
              }`
            }
          >
            Ajustes
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between bg-white p-4 shadow">
          <span className="font-medium">
            {user ? `Hola, ${user.nombre}` : "No autenticado"}
          </span>
          {user && (
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
