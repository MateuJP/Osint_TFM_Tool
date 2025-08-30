import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getIdentidad,
    updateIdentidad,
    type Identidad,
} from "../api/identidad";
import {
    getGeneros,
    getEstados,
    getNacionalidades,
    getOrientacionesPoliticas,
    getOrientacionesSexuales,
    getSituacionesSentimentales,
    getPais as getPaisesResidencia,
    type Opcion,
} from "../api/catalogos";
import { useForm } from "react-hook-form";

export default function IdentidadDetalle() {
    const { id } = useParams();
    const [identidad, setIdentidad] = useState<Identidad | null>(null);
    const [editMode, setEditMode] = useState(false);

    // catálogos
    const [generos, setGeneros] = useState<Opcion[]>([]);
    const [estados, setEstados] = useState<Opcion[]>([]);
    const [orientacionesPoliticas, setOrientacionesPoliticas] = useState<Opcion[]>([]);
    const [situacionesSentimentales, setSituacionesSentimentales] = useState<Opcion[]>([]);
    const [orientacionesSexuales, setOrientacionesSexuales] = useState<Opcion[]>([]);
    const [nacionalidades, setNacionalidades] = useState<Opcion[]>([]);
    const [paisesResidencia, setPaisesResidencia] = useState<Opcion[]>([]);

    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const { register, handleSubmit, reset } = useForm<Partial<Identidad>>();

    useEffect(() => {
        if (id) {
            getIdentidad(Number(id)).then((data) => {
                setIdentidad(data);
                reset(data);
            });
        }
    }, [id, reset]);

    useEffect(() => {
        getGeneros().then(setGeneros);
        getEstados().then(setEstados);
        getOrientacionesPoliticas().then(setOrientacionesPoliticas);
        getSituacionesSentimentales().then(setSituacionesSentimentales);
        getOrientacionesSexuales().then(setOrientacionesSexuales);
        getNacionalidades().then(setNacionalidades);
        getPaisesResidencia().then(setPaisesResidencia);

    }, []);

    const onSubmit = async (data: Partial<Identidad>) => {
        if (!id) return;
        try {
            const payload = {
                ...data,
                id_estado: data.id_estado ? Number(data.id_estado) : null,
                id_genero: data.id_genero ? Number(data.id_genero) : null,
                id_situacion_sentimental: data.id_situacion_sentimental ? Number(data.id_situacion_sentimental) : null,
                id_orientacion_sexual: data.id_orientacion_sexual ? Number(data.id_orientacion_sexual) : null,
                id_orientacion_politica: data.id_orientacion_politica ? Number(data.id_orientacion_politica) : null,
                id_nacionalidad: data.id_nacionalidad ? Number(data.id_nacionalidad) : null,
                id_pais_residencia: data.id_pais_residencia ? Number(data.id_pais_residencia) : null,
            };
            console.log("PAYLOAD", payload)
            const updated = await updateIdentidad(Number(id), payload);
            console.log("UPDATED", updated)
            setIdentidad(updated);
            setEditMode(false);
            setMessage({ type: "success", text: "Cambios guardados correctamente" });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Error al guardar los cambios" });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (!identidad) return <p>Cargando detalles...</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
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

            {!editMode ? (
                <div>
                    <h1 className="text-2xl font-bold mb-6">
                        {identidad.nombre} {identidad.apellido}
                    </h1>

                    {/* Datos básicos */}
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold border-b pb-1 mb-2">Datos Básicos</h2>
                        <p><strong>Edad:</strong> {identidad.edad ?? "—"}</p>
                        <p><strong>Fecha nacimiento:</strong> {identidad.fecha_nacimiento ?? "—"}</p>
                        <p><strong>Profesión:</strong> {identidad.profesion ?? "—"}</p>
                        <p><strong>Nivel educativo:</strong> {identidad.nivel_educativo ?? "—"}</p>
                    </div>

                    {/* Familia */}
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold border-b pb-1 mb-2">Familia</h2>
                        <p><strong>Padre:</strong> {identidad.nombre_padre ?? "—"}</p>
                        <p><strong>Madre:</strong> {identidad.nombre_madre ?? "—"}</p>
                        <p><strong>Número de hermanos:</strong> {identidad.numero_hermanos ?? "—"}</p>
                    </div>

                    {/* Contexto */}
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold border-b pb-1 mb-2">Contexto</h2>
                        <p><strong>Estado:</strong> {identidad.estado_nombre ?? "—"}</p>
                        <p><strong>Género:</strong> {identidad.genero_nombre ?? "—"}</p>
                        <p><strong>Situación sentimental:</strong> {identidad.situacion_sentimental_nombre ?? "—"}</p>
                        <p><strong>Orientación sexual:</strong> {identidad.orientacion_sexual_nombre ?? "—"}</p>
                        <p><strong>Orientación política:</strong> {identidad.orientacion_politica_nombre ?? "—"}</p>
                        <p><strong>Nacionalidad:</strong> {identidad.nacionalidad_nombre ?? "—"}</p>
                        <p><strong>País de residencia:</strong> {identidad.pais_residencia_nombre ?? "—"}</p>
                    </div>

                    {/* Notas */}
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold border-b pb-1 mb-2">Notas</h2>
                        <p><strong>Bibliografía:</strong> {identidad.bibliografia ?? "—"}</p>
                        <p><strong>Observaciones:</strong> {identidad.observaciones ?? "—"}</p>
                    </div>

                    <button
                        onClick={() => setEditMode(true)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Editar
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Editar Identidad</h2>

                    {/* Datos básicos */}
                    <div>
                        <h3 className="text-md font-semibold mb-2">Datos Básicos</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input {...register("nombre")} placeholder="Nombre" className="border rounded px-3 py-2 w-full" />
                            <input {...register("apellido")} placeholder="Apellido" className="border rounded px-3 py-2 w-full" />
                            <input type="number" {...register("edad")} placeholder="Edad" className="border rounded px-3 py-2 w-full" />
                            <input type="date" {...register("fecha_nacimiento")} className="border rounded px-3 py-2 w-full" />
                            <input {...register("profesion")} placeholder="Profesión" className="border rounded px-3 py-2 w-full" />
                            <input {...register("nivel_educativo")} placeholder="Nivel educativo" className="border rounded px-3 py-2 w-full" />
                        </div>
                    </div>

                    {/* Familia */}
                    <div>
                        <h3 className="text-md font-semibold mb-2">Familia</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input {...register("nombre_padre")} placeholder="Nombre padre" className="border rounded px-3 py-2 w-full" />
                            <input {...register("nombre_madre")} placeholder="Nombre madre" className="border rounded px-3 py-2 w-full" />
                            <input type="number" {...register("numero_hermanos")} placeholder="Nº hermanos" className="border rounded px-3 py-2 w-full" />
                        </div>
                    </div>

                    {/* Contexto */}
                    <div>
                        <h3 className="text-md font-semibold mb-2">Contexto</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm">Estado</label>
                                <select {...register("id_estado")} defaultValue={identidad.id_estado ?? ""} className="border rounded px-3 py-2 w-full">
                                    <option value="">—</option>
                                    {estados.map((e) => (
                                        <option key={e.id} value={e.id}>{e.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm">Género</label>
                                <select {...register("id_genero")} defaultValue={identidad.id_genero ?? ""} className="border rounded px-3 py-2 w-full">
                                    <option value="">—</option>
                                    {generos.map((g) => (
                                        <option key={g.id} value={g.id}>{g.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm">Situación sentimental</label>
                                <select {...register("id_situacion_sentimental")} defaultValue={identidad.id_situacion_sentimental ?? ""} className="border rounded px-3 py-2 w-full">
                                    <option value="">—</option>
                                    {situacionesSentimentales.map((s) => (
                                        <option key={s.id} value={s.id}>{s.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm">Orientación sexual</label>
                                <select {...register("id_orientacion_sexual")} defaultValue={identidad.id_orientacion_sexual ?? ""} className="border rounded px-3 py-2 w-full">
                                    <option value="">—</option>
                                    {orientacionesSexuales.map((o) => (
                                        <option key={o.id} value={o.id}>{o.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm">Orientación política</label>
                                <select {...register("id_orientacion_politica")} defaultValue={identidad.id_orientacion_politica ?? ""} className="border rounded px-3 py-2 w-full">
                                    <option value="">—</option>
                                    {orientacionesPoliticas.map((o) => (
                                        <option key={o.id} value={o.id}>{o.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm">Nacionalidad</label>
                                <select {...register("id_nacionalidad")} defaultValue={identidad.id_nacionalidad ?? ""} className="border rounded px-3 py-2 w-full">
                                    <option value="">—</option>
                                    {nacionalidades.map((n) => (
                                        <option key={n.id} value={n.id}>{n.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm">País de residencia</label>
                                <select {...register("id_pais_residencia")} defaultValue={identidad.id_pais_residencia ?? ""} className="border rounded px-3 py-2 w-full">
                                    <option value="">—</option>
                                    {paisesResidencia.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notas */}
                    <div>
                        <h3 className="text-md font-semibold mb-2">Notas</h3>
                        <textarea {...register("bibliografia")} placeholder="Bibliografía" className="border rounded px-3 py-2 w-full" />
                        <textarea {...register("observaciones")} placeholder="Observaciones" className="border rounded px-3 py-2 w-full" />
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditMode(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
