import api from './client.ts'

export interface Identidad {
    id_identidad: number;
    nombre: string;
    apellido: string;
    edad?: number | null;
    avatar?: string | null
    fecha_nacimiento?: string | null;
    profesion?: string | null;
    nivel_educativo?: string | null;
    nombre_padre?: string | null;
    nombre_madre?: string | null;
    numero_hermanos?: number | null;
    bibliografia?: string | null;
    observaciones?: string | null;
    estado_nombre?: string | null;
    genero_nombre?: string | null;
    situacion_sentimental_nombre?: string | null;
    orientacion_sexual_nombre?: string | null;
    orientacion_politica_nombre?: string | null;
    nacionalidad_nombre?: string | null;
    pais_residencia_nombre?: string | null;
    id_estado?: number | null;
    id_genero?: number | null;
    id_situacion_sentimental?: number | null;
    id_orientacion_sexual?: number | null;
    id_orientacion_politica?: number | null;
    id_nacionalidad?: number | null;
    id_pais_residencia?: number | null;

}

export const getIdentidades = async (): Promise<Identidad[]> => {
    const response = await api.get('/identidad/list');
    return response.data;
}

export const getIdentidad = async (id: number): Promise<Identidad> => {
    const response = await api.get(`/identidad/${id}`);
    return response.data;
}
export const createIdentidad = async (data: Partial<Identidad>) => {
    const res = await api.post('(identidad/crear', data);
    return res.data;
}
export const updateIdentidad = async (id: number, data: Partial<Identidad>) => {
    const res = await api.post(`/identidad/actualizar/${id}`, data);
    return res.data;
}
export const deleteIdentidad = async (id: number) => {
    await api.delete(`/identidad/eliminar/${id}`);
}