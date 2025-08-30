import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCuentaFromIdentidad, type Cuenta } from "../api/cuentas";
import { getAccionesByCuenta, type Accion } from "../api/acciones.ts";

export default function Diario() {
  const { id } = useParams(); // id de identidad
  const navigate = useNavigate();
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [acciones, setAcciones] = useState<Accion[]>([]);
  const [selectedCuenta, setSelectedCuenta] = useState<number | "all">("all");
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    if (!id) return;
    getCuentaFromIdentidad(Number(id)).then(async (cuentasData) => {
      setCuentas(cuentasData);

      // juntar todas las acciones de las cuentas
      let all: Accion[] = [];
      for (const c of cuentasData) {
        const acts = await getAccionesByCuenta(c.id_cuenta);
        all = [...all, ...acts];
      }
      // orden descendente por fecha
      all.sort((a, b) => {
        if (!a.fecha && !b.fecha) return 0;
        if (!a.fecha) return 1;
        if (!b.fecha) return -1;
        return a.fecha < b.fecha ? 1 : -1;
      });
      setAcciones(all);
    });
  }, [id]);


  const filtered =
    selectedCuenta === "all"
      ? acciones
      : acciones.filter((a) => a.id_cuenta === selectedCuenta);

  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Diario de acciones</h1>
        <button
          onClick={() => navigate(`/identidad/${id}/diario/nueva`)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Nueva acción
        </button>
      </div>

      {/* filtro por cuenta */}
      <div className="mb-6">
        <select
          value={selectedCuenta}
          onChange={(e) =>
            setSelectedCuenta(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
          className="border rounded px-3 py-2"
        >
          <option value="all">Todas las cuentas</option>
          {cuentas.map((c) => (
            <option key={c.id_cuenta} value={c.id_cuenta}>
              {c.nombre} - {c.red_social_nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Acciones en tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.map((a) => {
          const cuenta = cuentas.find((c) => c.id_cuenta === a.id_cuenta);
          return (
            <div
              key={a.id_accion}
              className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {a.titulo || "(Sin título)"}
                </h3>
                <p className="text-sm text-gray-500">{a.fecha}</p>
                <p className="text-sm text-gray-700 mt-2">
                  Cuenta: {cuenta?.nombre || "—"}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    navigate(`/identidad/${id}/diario/${a.id_accion}`)
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Ver / Editar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ⬅ Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente ➡
          </button>
        </div>
      )}
    </div>
  );
}
