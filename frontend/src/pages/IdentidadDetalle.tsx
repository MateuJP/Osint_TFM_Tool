import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getIdentidad,
    updateIdentidad,
    type Identidad,
} from "../api/identidad";
import { getGeneros, getEstados, type Opcion } from "../api/catalogos";
import { useForm } from "react-hook-form";

export default function IdentidadDetalle() {
    const { id } = useParams();
    const [identidad, setIdentidad] = useState<Identidad | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [generos, setGeneros] = useState<Opcion[]>([]);
    const [estados, setEstados] = useState<Opcion[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    const { register, handleSubmit, reset } = useForm<Partial<Identidad>>();

    useEffect(() => {
        if (id) {
            getIdentidad(Number(id)).then((data) => {
                setIdentidad(data);
                reset(data); // precargar valores en el form
            });
        }
    }, [id, reset]);

    useEffect(() => {
        getGeneros().then(setGeneros);
        getEstados().then(setEstados);
    }, []);

    const onSubmit = async (data: Partial<Identidad>) => {
        if (!id) return;
        try {
            const payload = {
                ...data,
                id_estado: data.id_estado ? Number(data.id_estado) : null,
                id_genero: data.id_genero ? Number(data.id_genero) : null,
            };
            const updated = await updateIdentidad(Number(id), payload);
            setIdentidad(updated);
            setEditMode(false);
            setMessage("✅ Cambios guardados correctamente");
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            console.error(err);
            setMessage("❌ Error al guardar los cambios");
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (!identidad) return <p>Cargando detalles...</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
            {!editMode ? (
                <div>
                    <h1 className="text-2xl font-bold mb-4">
                        {identidad.nombre} {identidad.apellido}
                    </h1>

                    {/* Datos básicos */}
                    <h2 className="text-xl font-semibold mb-2">Datos Básicos</h2>
                    <p><strong>Edad:</strong> {identidad.edad ?? "—"}</p>
                    <p><strong>Fecha nacimiento:</strong> {identidad.fecha_nacimiento ?? "—"}</p>
                    <p><strong>Profesión:</strong> {identidad.profesion ?? "—"}</p>
                    <p><strong>Nivel educativo:</strong> {identidad.nivel_educativo ?? "—"}</p>

                    {/* Familia */}
                    <h2 className="text-xl font-semibold mt-4 mb-2">Familia</h2>
                    <p><strong>Padre:</strong> {identidad.nombre_padre ?? "—"}</p>
                    <p><strong>Madre:</strong> {identidad.nombre_madre ?? "—"}</p>
                    <p><strong>Número de hermanos:</strong> {identidad.numero_heramanos ?? "—"}</p>

                    {/* Contexto */}
                    <h2 className="text-xl font-semibold mt-4 mb-2">Contexto</h2>
                    <p><strong>Estado:</strong> {identidad.estado_nombre ?? "—"}</p>
                    <p><strong>Género:</strong> {identidad.genero_nombre ?? "—"}</p>
                    <p><strong>Situación sentimental:</strong> {identidad.situacion_sentimental_nombre ?? "—"}</p>
                    <p><strong>Orientación sexual:</strong> {identidad.orientacion_sexual_nombre ?? "—"}</p>
                    <p><strong>Orientación política:</strong> {identidad.orientacion_politica_nombre ?? "—"}</p>
                    <p><strong>Nacionalidad:</strong> {identidad.nacionalidad_nombre ?? "—"}</p>
                    <p><strong>País de residencia:</strong> {identidad.pais_residencia_nombre ?? "—"}</p>

                    {/* Notas */}
                    <h2 className="text-xl font-semibold mt-4 mb-2">Notas</h2>
                    <p><strong>Bibliografía:</strong> {identidad.bibliografia ?? "—"}</p>
                    <p><strong>Observaciones:</strong> {identidad.observaciones ?? "—"}</p>

                    <button
                        onClick={() => setEditMode(true)}
                        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Editar
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <h2 className="text-xl font-semibold">Editar Identidad</h2>

                    {/* Datos básicos */}
                    <input {...register("nombre")} placeholder="Nombre" className="input w-full" />
                    <input {...register("apellido")} placeholder="Apellido" className="input w-full" />
                    <input type="number" {...register("edad")} placeholder="Edad" className="input w-full" />
                    <input type="date" {...register("fecha_nacimiento")} className="input w-full" />
                    <input {...register("profesion")} placeholder="Profesión" className="input w-full" />
                    <input {...register("nivel_educativo")} placeholder="Nivel educativo" className="input w-full" />

                    {/* Familia */}
                    <input {...register("nombre_padre")} placeholder="Nombre padre" className="input w-full" />
                    <input {...register("nombre_madre")} placeholder="Nombre madre" className="input w-full" />
                    <input type="number" {...register("numero_heramanos")} placeholder="Nº hermanos" className="input w-full" />

                    {/* Contexto */}
                    <label>Estado</label>
                    <select {...register("id_estado")} defaultValue={identidad.id_estado ?? ""} className="input w-full">
                        <option value="">—</option>
                        {estados.map((e) => (
                            <option key={e.id} value={e.id}>{e.nombre}</option>
                        ))}
                    </select>

                    <label>Género</label>
                    <select {...register("id_genero")} defaultValue={identidad.id_genero ?? ""} className="input w-full">
                        <option value="">—</option>
                        {generos.map((g) => (
                            <option key={g.id} value={g.id}>{g.nombre}</option>
                        ))}
                    </select>

                    {/* Notas */}
                    <textarea {...register("bibliografia")} placeholder="Bibliografía" className="input w-full" />
                    <textarea {...register("observaciones")} placeholder="Observaciones" className="input w-full" />

                    {/* Botones */}
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
                    {message && <p className="mt-2 text-sm">{message}</p>}
                </form>
            )}
        </div>
    );
}
