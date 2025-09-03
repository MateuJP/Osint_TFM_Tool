import { useEffect, useState } from "react";
import { getUserInfo, updateUserInfo, type Usuario } from "../api/configuracion";

export default function Ajustes() {
  const [userInfo, setUserInfo] = useState<Usuario | null>(null);
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [apikey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getUserInfo()
      .then((info) => {
        setUserInfo(info);
        setNombre(info.nombre || "");
        setApiKey(info.apikey || "");
      })
      .catch((err) => console.error("Error al cargar usuario", err));
  }, []);

  const copyApiKey = () => {
    if (!apikey) return;
    navigator.clipboard.writeText(apikey);
    setMessage({ type: "success", text: "API Key copiada al portapapeles" });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserInfo({
        nombre,
        password: password || undefined,
        apikey,
      });
      setMessage({ type: "success", text: "Ajustes guardados correctamente" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: `Error al guardar cambios: ${err.message}` });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!userInfo) return <p className="text-center mt-10">Cargando usuario...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Ajustes de usuario</h1>

      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded text-sm text-center ${message.type === "success"
            ? "bg-green-100 text-green-700 border border-green-300"
            : "bg-red-100 text-red-700 border border-red-300"
            }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full"
        />

        <input
          type="password"
          placeholder="Nueva contraseña (opcional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={password ? 8 : undefined}
          className="border rounded px-3 py-2 w-full"
        />

        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <div className="flex items-center gap-2 border rounded px-3 py-2">
            <input
              type={showApiKey ? "text" : "password"}
              value={apikey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Introduce tu API Key"
              className="flex-1 outline-none"
            />
            {apikey && (
              <>
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-blue-600 text-xs hover:underline"
                >
                  {showApiKey ? "Ocultar" : "Ver"}
                </button>
                <button
                  type="button"
                  onClick={copyApiKey}
                  className="text-gray-600 text-xs hover:underline"
                >
                  Copiar
                </button>
              </>
            )}
          </div>
        </div>


        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
