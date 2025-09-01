import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function RegistroInicial() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/user/new", {
                nombre,
                password,
            });
            setMessage({ type: "success", text: "Usuario creado correctamente. Ahora puedes iniciar sesión." });
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            console.error(err);
            if (err.message === 'Ya existe un usuario en el sistema') {
                setMessage({ type: "error", text: `Error : ${err.message}` });
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMessage({ type: "error", text: `Error : ${err.message}` });
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Registro Inicial</h1>

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
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                    className="border rounded px-3 py-2 w-full"
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                >
                    Crear Usuario
                </button>
            </form>
        </div>
    );
}
