import api from './client.ts';

export interface Cuenta {
    id_cuenta: number;
    nombre: string;
    correo: string;
    credenciales: string;
    url: string;
    id_identidad: number;
    id_red_social: number;
    red_social_nombre: string;
}

export const getCuentaFromIdentidad = async (id_identidad: number): Promise<Cuenta[]> => {
    const response = await api.get(`/cuentas/list/${id_identidad}`);
    return response.data;
}

export const getCuenta = async (id_cuenta: number): Promise<Cuenta> => {
    const response = await api.get(`/cuentas/${id_cuenta}`);
    return response.data
}
export const createCuenta = async (data: Partial<Cuenta>) => {
    const res = await api.post('/cuentas/crear', data);
    return res.data;
}
export const updateCuenta = async (id_cuenta: number, data: Partial<Cuenta>): Promise<Cuenta> => {
    const response = await api.put(`/cuentas/actualizar/${id_cuenta}`, data);
    return response.data
}

export const deleteCuenta = async (id_cuenta: number): Promise<Cuenta> => {
    const response = await api.delete(`/cuentas/eliminar/${id_cuenta}`);
    return response.data
}



