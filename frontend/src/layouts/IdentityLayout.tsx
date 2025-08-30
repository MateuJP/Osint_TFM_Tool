import { Outlet, NavLink, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getIdentidad, deleteIdentidad } from "../api/identidad";
import type { Identidad } from "../api/identidad";

export default function IdentityLayout() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [identidad, setIdentidad] = useState<Identidad | null>(null);

    useEffect(() => {
        if (id) {
            getIdentidad(Number(id)).then(setIdentidad);
        }
    }, [id]);

    const handleDelete = async () => {
        if (id && confirm("¿Seguro que quieres eliminar esta identidad?")) {
            await deleteIdentidad(Number(id));
            navigate("/identidades");
        }
    };

    if (!identidad) {
        return <p className="p-6">Cargando identidad...</p>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar izquierdo */}
            <aside className="w-56 bg-white shadow-md">
                <div className="p-4 font-bold text-xl border-b">Identidad</div>
                <nav className="flex flex-col p-4 space-y-2">
                    <NavLink
                        to={'/identidades'}
                        className={({ isActive }) =>
                            `px-3 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-300 font-semibold" : ""
                            }`
                        }
                    >
                        Identidades
                    </NavLink>
                    <NavLink
                        to={`/identidad/${id}/cuentas`}
                        className={({ isActive }) =>
                            `px-3 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-300 font-semibold" : ""
                            }`
                        }
                    >
                        Cuentas
                    </NavLink>
                    <NavLink
                        to={`/identidad/${id}/diario`}
                        className={({ isActive }) =>
                            `px-3 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-300 font-semibold" : ""
                            }`
                        }
                    >
                        Diario
                    </NavLink>
                    <NavLink
                        to={`/identidad/${id}/asistente`}
                        className={({ isActive }) =>
                            `px-3 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-300 font-semibold" : ""
                            }`
                        }
                    >
                        Asistente
                    </NavLink>
                </nav>
            </aside>

            {/* Contenido central */}
            <main className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </main>

            {/* Panel derecho */}
            <aside className="w-72 bg-white border-l shadow-lg flex flex-col">
                <div className="p-4 flex flex-col items-center text-center border-b">
                    <img
                        src={
                            identidad.avatar ||
                            "https://ui-avatars.com/api/?name=" +
                            identidad.nombre +
                            "+" +
                            identidad.apellido
                        }
                        alt="avatar"
                        className="w-24 h-24 rounded-full mb-3"
                    />
                    <h2 className="text-lg font-bold">
                        {identidad.nombre} {identidad.apellido}
                    </h2>
                    {identidad.edad && (
                        <p className="text-sm text-gray-600">{identidad.edad} años</p>
                    )}
                </div>

                <div className="p-4 space-y-2">

                    <button className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600">
                        Dormir
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                    >
                        Eliminar
                    </button>
                </div>
            </aside>
        </div>
    );
}
