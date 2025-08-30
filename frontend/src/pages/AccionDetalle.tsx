import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { getAccionById, updateAccion, deleteAccion, type Accion } from "../api/acciones";
import {
    getMuestrasByAccion,
    createMuestraExterna,
    createMuestraUpload,
    deleteMuestra,
    type MuestraGrafica,
} from "../api/muestras";

interface MuestraInput {
    titulo: string;
    url?: string;
    formato: string;
    file?: File | null;
    tipo: "url" | "file";
}

export default function AccionDetalle() {
    const { id, accionId } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm<Partial<Accion>>();

    const [accion, setAccion] = useState<Accion | null>(null);
    const [muestras, setMuestras] = useState<MuestraGrafica[]>([]);
    const [newMuestras, setNewMuestras] = useState<MuestraInput[]>([]);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (accionId) {
            getAccionById(Number(accionId)).then((a) => {
                setAccion(a);
                reset(a);
            });
            getMuestrasByAccion(Number(accionId)).then(setMuestras);
        }
    }, [accionId, reset]);

    const onSubmit = async (data: Partial<Accion>) => {
        if (!accionId) return;
        try {
            const updated = await updateAccion(Number(accionId), data);
            setAccion(updated);

            // añadir muestras nuevas
            for (const m of newMuestras) {
                if (m.tipo === "file" && m.file) {
                    await createMuestraUpload(
                        { titulo: m.titulo, formato: m.formato, id_accion: updated.id_accion ?? 0 },
                        m.file
                    );
                } else {
                    await createMuestraExterna({
                        titulo: m.titulo,
                        url: m.url || "",
                        formato: m.formato,
                        id_accion: updated.id_accion,
                    } as any);
                }
            }
            const refreshedAccion = await getAccionById(Number(accionId));
            setAccion(refreshedAccion);
            const refreshedMuestras = await getMuestrasByAccion(Number(accionId));
            setMuestras(refreshedMuestras)
            setNewMuestras([]);

            setMessage({ type: "success", text: "Cambios guardados" });
            setTimeout(() => setMessage(null), 1500);
        } catch (err: any) {
            console.error(err);
            setMessage({ type: "error", text: `Error al guardar: ${err.message}` });
        }
    };

    const onDeleteAccion = async () => {
        if (!accionId) return;
        try {
            await deleteAccion(Number(accionId));
            setMessage({ type: "success", text: "Acción eliminada con sus muestras" });
            setTimeout(() => setMessage(null), 1500);
        } catch (err: any) {
            console.error(err);
            setMessage({ type: "error", text: `Error al eliminar: ${err.message}` });
        }
    };

    const addMuestra = () => {
        setNewMuestras((prev) => [
            ...prev,
            { titulo: "", url: "", formato: "", file: null, tipo: "url" },
        ]);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
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


            <h1 className="text-2xl font-bold mb-6">Editar acción</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input {...register("titulo")} placeholder="Titulo" className="border rounded px-3 py-2 w-full" />
                <input {...register("resumen")} placeholder="Resumen" className="border rounded px-3 py-2 w-full" />
                <input type="date" {...register("fecha")} className="border rounded px-3 py-2 w-full" />
                <textarea {...register("observaciones")} placeholder="Observaciones" className="border rounded px-3 py-2 w-full" />

                {/* muestras actuales */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Muestras actuales</h2>
                    {muestras.map((m) => (
                        <div key={m.id_muestra} className="flex justify-between items-center border p-2 mb-2">
                            <div className="flex flex-col">
                                <span>{m.titulo} ({m.formato})</span>
                                {m.url && (m.url.endsWith(".jpg") || m.url.endsWith(".png")) && (
                                    <img
                                        src={`http://localhost:8000/api/v1${m.url}`}
                                        alt="preview"
                                        className="mt-1 max-h-24 rounded border cursor-pointer"
                                        onClick={() => setPreviewUrl(`http://localhost:8000/api/v1${m.url}`)}
                                    />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    deleteMuestra(m.id_muestra);
                                    setMuestras((prev) => prev.filter((x) => x.id_muestra !== m.id_muestra));
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>

                {/* añadir nuevas muestras */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Añadir nuevas muestras</h2>
                    {newMuestras.map((m, idx) => (
                        <div key={idx} className="border rounded p-3 mb-3 bg-gray-50 space-y-2 relative">
                            {/* Botón para eliminar la muestra temporal */}
                            <button
                                type="button"
                                onClick={() => setNewMuestras((prev) => prev.filter((_, i) => i !== idx))}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                title="Quitar muestra"
                            >
                                ✕
                            </button>

                            <input
                                value={m.titulo}
                                onChange={(e) => {
                                    const copy = [...newMuestras];
                                    copy[idx].titulo = e.target.value;
                                    setNewMuestras(copy);
                                }}
                                placeholder="Título"
                                className="border rounded px-3 py-2 w-full"
                            />

                            <select
                                value={m.tipo}
                                onChange={(e) => {
                                    const copy = [...newMuestras];
                                    copy[idx].tipo = e.target.value as "url" | "file";
                                    copy[idx].file = null;
                                    copy[idx].url = "";
                                    setNewMuestras(copy);
                                }}
                                className="border rounded px-3 py-2 w-full"
                            >
                                <option value="url">URL externa</option>
                                <option value="file">Subir archivo</option>
                            </select>

                            {m.tipo === "url" ? (
                                <div>
                                    <input
                                        value={m.url}
                                        onChange={(e) => {
                                            const copy = [...newMuestras];
                                            copy[idx].url = e.target.value;
                                            setNewMuestras(copy);
                                        }}
                                        placeholder="https://ejemplo.com/imagen.png"
                                        className="border rounded px-3 py-2 w-full"
                                    />
                                    {m.url && (m.url.endsWith(".jpg") || m.url.endsWith(".png")) && (
                                        <img
                                            src={m.url}
                                            alt="preview"
                                            className="mt-2 max-h-40 rounded border cursor-pointer"
                                            onClick={() => setPreviewUrl(`http://localhost:8000/api/v1${m.url}`)}
                                        />
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            const copy = [...newMuestras];
                                            copy[idx].file = file;
                                            setNewMuestras(copy);
                                        }}
                                        className="border rounded px-3 py-2 w-full"
                                    />
                                    {m.file && m.file.type.startsWith("image/") && (
                                        <img
                                            src={m.file ? URL.createObjectURL(m.file) : ""}
                                            alt="preview"
                                            className="mt-2 max-h-40 rounded border cursor-pointer"
                                            onClick={() => {
                                                if (m.file) setPreviewUrl(URL.createObjectURL(m.file));
                                            }}
                                        />
                                    )}
                                </div>
                            )}

                            <input
                                value={m.formato}
                                onChange={(e) => {
                                    const copy = [...newMuestras];
                                    copy[idx].formato = e.target.value;
                                    setNewMuestras(copy);
                                }}
                                placeholder="Formato (jpg, png, pdf...)"
                                className="border rounded px-3 py-2 w-full"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addMuestra}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                    >
                        ➕ Añadir muestra
                    </button>
                </div>

                <div className="flex justify-between items-center pt-6">
                    <button
                        type="button"
                        onClick={onDeleteAccion}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Eliminar acción
                    </button>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </form>

            {/* Modal de preview */}
            {previewUrl && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setPreviewUrl(null)}
                >
                    <div className="relative">
                        <img
                            src={previewUrl}
                            alt="Preview grande"
                            className="max-h-[90vh] max-w-[90vw] rounded"
                        />
                        <button
                            onClick={() => setPreviewUrl(null)}
                            className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
