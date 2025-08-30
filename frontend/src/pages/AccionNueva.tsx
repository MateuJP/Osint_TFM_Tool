import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { getCuentaFromIdentidad, type Cuenta } from "../api/cuentas";
import { createAccion, type Accion } from "../api/acciones";
import { createMuestraExterna, createMuestraUpload, type MuestraGrafica } from "../api/muestras.ts";

interface MuestraInput {
    titulo: string;
    url?: string;
    formato: string;
    file?: File | null;
    tipo: "url" | "file";
}

export default function AccionNueva() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm<Partial<Accion>>();
    const [cuentas, setCuentas] = useState<Cuenta[]>([]);
    const [muestras, setMuestras] = useState<MuestraInput[]>([]);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [preview, setPreviewUrl] = useState<string | null>(null)
    useEffect(() => {
        if (id) getCuentaFromIdentidad(Number(id)).then(setCuentas);
    }, [id]);

    const addMuestra = () => {
        setMuestras((prev) => [
            ...prev,
            { titulo: "", url: "", formato: "", file: null, tipo: "url" },
        ]);
    };

    const updateMuestra = (
        index: number,
        field: keyof MuestraInput,
        value: any
    ) => {
        setMuestras((prev) =>
            prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
        );
    };

    const onSubmit = async (data: Partial<Accion>) => {
        if (!id) return;
        try {
            const nueva = await createAccion({
                ...data,
                id_identidad: Number(id),
                id_cuenta: Number(data.id_cuenta),
            });

            for (const m of muestras) {
                if (m.tipo === "file" && m.file) {
                    await createMuestraUpload(
                        { titulo: m.titulo, formato: m.formato, id_accion: nueva.id_accion ?? 0 },
                        m.file
                    );
                } else {
                    await createMuestraExterna({
                        titulo: m.titulo,
                        url: m.url || "",
                        formato: m.formato,
                        id_accion: nueva.id_accion,
                    } as any);
                }
            }
            setMessage({ type: "success", text: "Acción creada correctamente" });
            setTimeout(() => navigate(`/identidad/${id}/diario`), 1500);

        } catch (err: any) {
            setMessage({ type: "success", text: `${err.message}` });
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Nueva acción</h1>
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input {...register("titulo")} placeholder="Titulo" className="border rounded px-3 py-2 w-full" />
                <input {...register("resumen")} placeholder="Resumen" className="border rounded px-3 py-2 w-full" />
                <input type="date" {...register("fecha")} className="border rounded px-3 py-2 w-full" />
                <textarea {...register("observaciones")} placeholder="Observaciones" className="border rounded px-3 py-2 w-full" />

                <select {...register("id_cuenta")} className="border rounded px-3 py-2 w-full">
                    <option value="">Seleccionar cuenta</option>
                    {cuentas.map((c) => (
                        <option key={c.id_cuenta} value={c.id_cuenta}>
                            {c.nombre} - {c.red_social_nombre}
                        </option>
                    ))}
                </select>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Muestras gráficas</h2>
                    {muestras.map((m, idx) => (
                        <div key={idx} className="border rounded p-3 mb-3 bg-gray-50 space-y-2 relative">
                            <button
                                type="button"
                                onClick={() => setMuestras((prev) => prev.filter((_, i) => i !== idx))}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                            >
                                x
                            </button>
                            <input
                                value={m.titulo}
                                onChange={(e) => updateMuestra(idx, "titulo", e.target.value)}
                                placeholder="Título"
                                className="border rounded px-3 py-2 w-full"
                            />
                            <select
                                value={m.tipo}
                                onChange={(e) => updateMuestra(idx, "tipo", e.target.value as "url" | "file")}
                                className="border rounded px-3 py-2 w-full"
                            >
                                <option value="url">URL externa</option>
                                <option value="file">Subir archivo</option>
                            </select>
                            {m.tipo === "url" ? (
                                <input
                                    value={m.url}
                                    onChange={(e) => updateMuestra(idx, "url", e.target.value)}
                                    placeholder="https://ejemplo.com/imagen.png"
                                    className="border rounded px-3 py-2 w-full"
                                />
                            ) : (
                                <input
                                    type="file"
                                    onChange={(e) => updateMuestra(idx, "file", e.target.files?.[0] || null)}
                                    className="border rounded px-3 py-2 w-full"
                                />
                            )}
                            <input
                                value={m.formato}
                                onChange={(e) => updateMuestra(idx, "formato", e.target.value)}
                                placeholder="Formato (jpg, png, pdf...)"
                                className="border rounded px-3 py-2 w-full"
                            />
                            {m.file && m.file.type.startsWith("image/") && (
                                <img
                                    src={URL.createObjectURL(m.file)}
                                    alt="preview"
                                    className="mt-2 max-h-40 rounded border cursor-pointer"
                                    onClick={() => {
                                        if (m.file) setPreviewUrl(URL.createObjectURL(m.file));
                                    }}
                                />
                            )}
                            <input
                                value={m.formato}
                                onChange={(e) => updateMuestra(idx, "formato", e.target.value)}
                                placeholder="Formato (jpg,png,pdf)"
                                className="border rounded px-3 py-2 w-full"

                            >
                            </input>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addMuestra}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                    >
                        Añadir muestra
                    </button>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={() => navigate(-1)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                        Cancelar
                    </button>
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                        Guardar acción
                    </button>
                </div>
            </form>
        </div>
    );
}
