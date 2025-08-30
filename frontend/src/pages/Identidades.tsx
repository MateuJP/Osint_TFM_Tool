import { useEffect, useState } from "react";
import {
  getIdentidades,
  deleteIdentidad,
  type Identidad,
} from "../api/identidad";
import { useNavigate } from "react-router-dom";

export default function Identidades() {
  const [identidades, setIdentidades] = useState<Identidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getIdentidades();
      setIdentidades(data);
    } catch (err) {
      setError("No se pudieron cargar las identidades");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que quieres eliminar esta identidad?")) {
      await deleteIdentidad(id);
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Identidades</h1>
        <button
          onClick={() => navigate("/identidades/nueva")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Nueva Identidad
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Apellido</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {identidades.map((idn) => (
              <tr key={idn.id_identidad} className="border-t">
                <td className="p-3">{idn.id_identidad}</td>
                <td className="p-3">{idn.nombre}</td>
                <td className="p-3">{idn.apellido}</td>
                <td className="p-3">
                  {idn.estado_nombre || (
                    <span className="text-gray-400 italic">N/A</span>
                  )}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => navigate(`/identidad/${idn.id_identidad}`)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(idn.id_identidad)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {identidades.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No hay identidades creadas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
