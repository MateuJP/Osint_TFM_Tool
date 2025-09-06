import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCuentaFromIdentidad,
  createCuenta,
  updateCuenta,
  deleteCuenta,
  type Cuenta,
} from "../api/cuentas";
import { getRedesSociales, type Opcion } from "../api/catalogos";
import { useForm } from "react-hook-form";

export default function Cuentas() {
  const { id } = useParams();
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [redes, setRedes] = useState<Opcion[]>([]);
  const [editCuenta, setEditCuenta] = useState<Cuenta | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCredenciales, setShowCredenciales] = useState<{ [key: number]: boolean }>({});

  const { register, handleSubmit, reset } = useForm<Partial<Cuenta>>();

  useEffect(() => {
    if (id) getCuentaFromIdentidad(Number(id)).then(setCuentas);
    getRedesSociales().then(setRedes);
  }, [id]);

  const onCreate = async (data: Partial<Cuenta>) => {
    if (!id) return;
    try {
      const nueva = await createCuenta({ ...data, id_identidad: Number(id) });
      setCuentas((prev) => [...prev, nueva]);
      setMessage({ type: "success", text: "Cuenta creada con éxito" })
      reset();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: `Error: ${err.message}` });
    }
  };

  const onUpdate = async (data: Partial<Cuenta>) => {
    if (!editCuenta) return;
    try {
      const updated = await updateCuenta(editCuenta.id_cuenta, data);
      setCuentas((prev) =>
        prev.map((c) => (c.id_cuenta === updated.id_cuenta ? updated : c))
      );
      setMessage({ type: "success", text: "Cuenta actualizada correctamente" });
      setEditCuenta(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: `Error : ${err.message}` });
    }
  };

  const onDelete = async (id_cuenta: number) => {
    try {
      await deleteCuenta(id_cuenta);
      setCuentas((prev) => prev.filter((c) => c.id_cuenta !== id_cuenta));
      setMessage({ type: "success", text: "Cuenta eliminada correctamente" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: `Error: ${err.message}` });
    }
  };

  const toggleCredenciales = (id_cuenta: number) => {
    setShowCredenciales((prev) => ({
      ...prev,
      [id_cuenta]: !prev[id_cuenta],
    }));
  };

  const copyCredenciales = (texto: string | undefined) => {
    if (!texto) return;
    navigator.clipboard.writeText(texto);
    setMessage({ type: "success", text: "Copiado al portapapeles" });
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Cuentas de la Identidad</h1>

      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded text-sm ${message.type === "success"
            ? "bg-green-100 text-green-700 border border-green-300"
            : "bg-red-100 text-red-700 border border-red-300"
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabla */}
      {cuentas.length > 0 ? (
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-3 py-2 text-left">Red Social</th>
                <th className="border px-3 py-2 text-left">Nombre</th>
                <th className="border px-3 py-2 text-left">Correo</th>
                <th className="border px-3 py-2 text-left">Credenciales</th>
                <th className="border px-3 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuentas.map((c, idx) => (
                <tr
                  key={c.id_cuenta}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border px-3 py-2">
                    {redes.find((r) => r.id === c.id_red_social)?.nombre || "—"}
                  </td>
                  <td className="border px-3 py-2">{c.nombre}</td>
                  <td className="border px-3 py-2">{c.correo}</td>
                  <td className="border px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span>
                        {showCredenciales[c.id_cuenta]
                          ? c.credenciales
                          : "••••••••"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleCredenciales(c.id_cuenta)}
                        className="text-blue-600 text-xs hover:underline"
                      >
                        {showCredenciales[c.id_cuenta] ? "Ocultar" : "Ver"}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyCredenciales(c.credenciales)}
                        className="text-gray-600 text-xs hover:underline"
                      >
                        Copiar
                      </button>
                    </div>
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditCuenta(c);
                          reset(c);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(c.id_cuenta)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 mb-8">No hay cuentas registradas todavía.</p>
      )}

      {/* Formulario de creación */}
      <form onSubmit={handleSubmit(onCreate)} className="space-y-4 border-t pt-6">
        <h2 className="text-lg font-semibold mb-2">Crear nueva cuenta</h2>
        <div className="grid grid-cols-2 gap-4">
          <input {...register("nombre")} placeholder="Nombre" className="border rounded px-3 py-2 w-full" />
          <input {...register("correo")} placeholder="Correo" className="border rounded px-3 py-2 w-full" />
          <input {...register("credenciales")} type="password" placeholder="Credenciales" className="border rounded px-3 py-2 w-full" />
          <input {...register("url")} placeholder="URL" className="border rounded px-3 py-2 w-full" />
          <select {...register("id_red_social")} className="border rounded px-3 py-2 w-full col-span-2">
            <option value="">Seleccionar red social</option>
            {redes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Crear cuenta
        </button>
      </form>

      {/* Modal edición */}
      {editCuenta && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Editar cuenta</h2>
            <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
              <input {...register("nombre")} placeholder="Nombre" className="border rounded px-3 py-2 w-full" />
              <input {...register("correo")} placeholder="Correo" className="border rounded px-3 py-2 w-full" />
              <input {...register("credenciales")} placeholder="Credenciales" className="border rounded px-3 py-2 w-full" />
              <input {...register("url")} placeholder="URL" className="border rounded px-3 py-2 w-full" />
              <select {...register("id_red_social")} className="border rounded px-3 py-2 w-full">
                <option value="">Seleccionar red social</option>
                {redes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditCuenta(null);
                    reset();
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
