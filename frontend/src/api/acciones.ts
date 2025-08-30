import api from './client.ts';

export interface Accion {
    id_accion: number | null;
    id_identidad: number | null;
    id_cuenta: number | null;
    titulo: string
    notas: string | null;
    observaciones: string | null;
    url: string | null;
    resumen: string | null;
    fecha: string | null

}

export const getAccionesByCuenta = async (id_cuenta: number): Promise<Accion[]> => {
    const response = await api.get(`/acciones/listar/${id_cuenta}`);
    return response.data
}


export const getAccionById = async (id_accion: number): Promise<Accion> => {
    const response = await api.get(`/acciones/${id_accion}`);
    return response.data
}
export const createAccion = async (data: Partial<Accion>): Promise<Accion> => {
    const response = await api.post('/acciones/crear', data);
    return response.data
}

export const updateAccion = async (id_accion: number, data: Partial<Accion>): Promise<Accion> => {
    const response = await api.put(`/acciones/actualizar/${id_accion}`, data);
    return response.data;
}
export const deleteAccion = async (id_accion: number): Promise<Accion> => {
    const response = await api.delete(`/acciones/eliminar/${id_accion}`);
    return response.data
}