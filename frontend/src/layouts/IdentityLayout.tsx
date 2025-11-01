import { Outlet, NavLink, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getIdentidad, deleteIdentidad, uploadAvatar } from "../api/identidad";
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

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!id || !event.target.files || !event.target.files[0]) return;
        const file = event.target.files[0];
        try {
            setUploading(true);
            await uploadAvatar(Number(id), file);
            const updatedIdentidad = await getIdentidad(Number(id));
            setIdentidad(updatedIdentidad);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
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
                            identidad.avatar
                                ? `http://localhost:8000/api/v1${identidad.avatar}`
                                : `https://ui-avatars.com/api/?name=${identidad.nombre}+${identidad.apellido}`
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

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadAvatar}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-3 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={uploading}
                    >
                        {uploading ? "Subiendo..." : "Cambiar avatar"}
                    </button>
                </div>

                <div className="p-4 space-y-2">
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
