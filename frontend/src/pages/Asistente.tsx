import { useState } from "react";
import { type Query, generateIdentidad } from "../api/asistente";
import { useNavigate } from "react-router-dom";

export default function Asistente() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [query, setQuery] = useState<Query>({ objetivo: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [identidad, setIdentidad] = useState<any>(null);

  const generarIdentidad = async () => {
    if (!query.objetivo.trim()) {
      setError("El objetivo de investigación es requerido.");
      return;
    }
    setLoading(true);
    setError(null);
    setIdentidad(null);

    try {
      const response = await generateIdentidad(query);
      setIdentidad(response);
      setMessage({ type: "success", text: "Identidad generada" });

      // Opcional: mostrar mensaje 2s y luego navegar
      setTimeout(() => navigate(`/identidad/${response.id_identidad}`), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Asistente IA</h1>

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

      <div className="space-y-4">
        <textarea
          value={query.objetivo}
          onChange={(e) => setQuery({ objetivo: e.target.value })}
          placeholder="Escribe aquí el objetivo de investigación..."
          rows={4}
          className="w-full border rounded px-3 py-2"
        />

        <button
          onClick={generarIdentidad}
          disabled={loading || !query.objetivo.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generando..." : "Generar Identidad"}
        </button>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {identidad && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Identidad generada</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(identidad, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
