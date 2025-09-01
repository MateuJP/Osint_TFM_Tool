import api from "./client";

export interface Usuario {
    nombre: string;
    password: string;
    apikey: string;
}

export const getUserInfo = async (): Promise<Usuario> => {
    const result = await api.get('/user/me')
    return result.data;
}
export const updateUserInfo = async (data: Partial<Usuario>): Promise<Usuario> => {
    const result = await api.put('/user/update', data)
    return result.data;
}