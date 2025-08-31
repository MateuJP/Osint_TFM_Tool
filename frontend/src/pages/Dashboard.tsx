import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getIdentidades, type Identidad } from "../api/identidad";
import { getCuentaFromIdentidad } from "../api/cuentas.ts";
import { getAccionById, getAccionesByCuenta } from "../api/acciones.ts";

export default function Dashboard() {
  const [identidades, setIdentidades] = useState<Identidad[]>([]);
  const [stats, setStats] = useState<{ identidades: number; cuentas: number; acciones: number }>({
    identidades: 0,
    cuentas: 0,
    acciones: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const ids = await getIdentidades();
      setIdentidades(ids.slice(-3).reverse());

      let totalCuentas = 0;
      let totalAcciones = 0;
      for (const ident of ids) {
        const cuentas = await getCuentaFromIdentidad(ident.id_identidad);
        totalCuentas += cuentas.length;
        await Promise.all(
          cuentas.map(async (e) => {
            const acciones = await getAccionesByCuenta(e.id_cuenta);
            totalAcciones += acciones.length;
          })
        );

      }

      setStats({
        identidades: ids.length,
        cuentas: totalCuentas,
        acciones: totalAcciones,
      });
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Mostramos las métricas */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.identidades}</p>
          <p className="text-sm text-blue-600">Identidades</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-700">{stats.cuentas}</p>
          <p className="text-sm text-green-600">Cuentas</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-purple-700">{stats.acciones}</p>
          <p className="text-sm text-purple-600">Acciones</p>
        </div>
      </div>

      {/* Mostramos las últimas identidades */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Últimas identidades</h2>
        {identidades.length > 0 ? (
          <ul className="space-y-3">
            {identidades.map((i) => (
              <li
                key={i.id_identidad}
                className="flex justify-between items-center bg-white border p-4 rounded shadow-sm"
              >
                <div>
                  <p className="font-medium">
                    {i.nombre} {i.apellido}
                  </p>
                  {i.profesion && <p className="text-sm text-gray-500">{i.profesion}</p>}
                </div>
                <Link
                  to={`/identidad/${i.id_identidad}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Ver
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Todavía no hay identidades registradas.</p>
        )}
      </div>

      {/* accesos rápidos */}
      <div className="flex justify-between">
        <Link
          to="/identidades"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Ver todas las identidades
        </Link>
        <Link
          to="/identidades/nueva"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          ➕ Nueva identidad
        </Link>
      </div>
    </div>
  );
}
