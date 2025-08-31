import api from "./client.ts";

export interface IdentidadAficiones {
    id_identidad: number;
    id_aficion: number;
    aficion_nombre: string | null,
    identidad_nombre: string | null
}

export const getAficionesByIdentidad = async (id_identidad: number): Promise<IdentidadAficiones[]> => {
    const response = await api.get(`/identidad_aficiones/listar/${id_identidad}`)
    return response.data
}

export const AddAficionesToIdentidad = async (data: Partial<IdentidadAficiones>): Promise<IdentidadAficiones> => {
    const response = await api.post('/identidad_aficiones/crear', data)
    return response.data;
}

export const RemoveAficionesByIdentidad = async (id_identidad: number, id_aficion: number): Promise<IdentidadAficiones> => {
    const response = await api.delete(`/identidad_aficiones/eliminar/${id_identidad}/${id_aficion}`)
    return response.data
}
