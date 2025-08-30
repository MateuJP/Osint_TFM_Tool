import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createIdentidad, type Identidad } from "../api/identidad";
import {
    getEstados,
    getGeneros,
    getSituacionesSentimentales,
    getOrientacionesSexuales,
    getOrientacionesPoliticas,
    getNacionalidades,
    getPais as getPaisesResidencia,
    type Opcion,
} from "../api/catalogos";
import { useNavigate } from "react-router-dom";

export default function IdentidadNueva() {
    const { register, handleSubmit, reset } = useForm<Partial<Identidad>>();
    const navigate = useNavigate();

    const [estados, setEstados] = useState<Opcion[]>([]);
    const [generos, setGeneros] = useState<Opcion[]>([]);
    const [situaciones, setSituaciones] = useState<Opcion[]>([]);
    const [orientacionesSexuales, setOrientacionesSexuales] = useState<Opcion[]>([]);
    const [orientacionesPoliticas, setOrientacionesPoliticas] = useState<Opcion[]>([]);
    const [nacionalidades, setNacionalidades] = useState<Opcion[]>([]);
    const [paises, setPaises] = useState<Opcion[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        getEstados().then(setEstados);
        getGeneros().then(setGeneros);
        getSituacionesSentimentales().then(setSituaciones);
        getOrientacionesSexuales().then(setOrientacionesSexuales);
        getOrientacionesPoliticas().then(setOrientacionesPoliticas);
        getNacionalidades().then(setNacionalidades);
        getPaisesResidencia().then(setPaises);
    }, []);

    const onSubmit = async (data: Partial<Identidad>) => {
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
            const nueva = await createIdentidad(payload);
            setMessage("✅ Identidad creada correctamente");
            reset();
            setTimeout(() => {
                setMessage(null);
                navigate(`/identidad/${nueva.id_identidad}`);
            }, 1500);
        } catch (err) {
            console.error(err);
            setMessage("❌ Error al crear la identidad");
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Nueva Identidad</h1>

            {message && (
                <div className="mb-4 text-sm p-2 rounded border bg-gray-100">{message}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Nombre y apellido obligatorios */}
                <div className="grid grid-cols-2 gap-4">
                    <input {...register("nombre", { required: true })} placeholder="Nombre *" className="border rounded px-3 py-2" />
                    <input {...register("apellido", { required: true })} placeholder="Apellido *" className="border rounded px-3 py-2" />
                </div>

                {/* Otros datos */}
                <input type="number" {...register("edad")} placeholder="Edad" className="border rounded px-3 py-2 w-full" />
                <input type="date" {...register("fecha_nacimiento")} className="border rounded px-3 py-2 w-full" />
                <input {...register("profesion")} placeholder="Profesión" className="border rounded px-3 py-2 w-full" />
                <input {...register("nivel_educativo")} placeholder="Nivel educativo" className="border rounded px-3 py-2 w-full" />

                {/* Familia */}
                <div className="grid grid-cols-2 gap-4">
                    <input {...register("nombre_padre")} placeholder="Nombre del padre" className="border rounded px-3 py-2" />
                    <input {...register("nombre_madre")} placeholder="Nombre de la madre" className="border rounded px-3 py-2" />
                </div>
                <input type="number" {...register("numero_hermanos")} placeholder="Número de hermanos" className="border rounded px-3 py-2 w-full" />

                {/* Contexto */}
                <div className="grid grid-cols-2 gap-4">
                    <select {...register("id_estado")} className="border rounded px-3 py-2">
                        <option value="">Estado</option>
                        {estados.map((e) => (
                            <option key={e.id} value={e.id}>{e.nombre}</option>
                        ))}
                    </select>

                    <select {...register("id_genero")} className="border rounded px-3 py-2">
                        <option value="">Género</option>
                        {generos.map((g) => (
                            <option key={g.id} value={g.id}>{g.nombre}</option>
                        ))}
                    </select>

                    <select {...register("id_situacion_sentimental")} className="border rounded px-3 py-2">
                        <option value="">Situación sentimental</option>
                        {situaciones.map((s) => (
                            <option key={s.id} value={s.id}>{s.nombre}</option>
                        ))}
                    </select>

                    <select {...register("id_orientacion_sexual")} className="border rounded px-3 py-2">
                        <option value="">Orientación sexual</option>
                        {orientacionesSexuales.map((o) => (
                            <option key={o.id} value={o.id}>{o.nombre}</option>
                        ))}
                    </select>

                    <select {...register("id_orientacion_politica")} className="border rounded px-3 py-2">
                        <option value="">Orientación política</option>
                        {orientacionesPoliticas.map((o) => (
                            <option key={o.id} value={o.id}>{o.nombre}</option>
                        ))}
                    </select>

                    <select {...register("id_nacionalidad")} className="border rounded px-3 py-2">
                        <option value="">Nacionalidad</option>
                        {nacionalidades.map((n) => (
                            <option key={n.id} value={n.id}>{n.nombre}</option>
                        ))}
                    </select>

                    <select {...register("id_pais_residencia")} className="border rounded px-3 py-2">
                        <option value="">País de residencia</option>
                        {paises.map((p) => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Notas */}
                <textarea {...register("bibliografia")} placeholder="Bibliografía" className="border rounded px-3 py-2 w-full" />
                <textarea {...register("observaciones")} placeholder="Observaciones" className="border rounded px-3 py-2 w-full" />

                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Crear Identidad
                </button>
            </form>
        </div>
    );
}
