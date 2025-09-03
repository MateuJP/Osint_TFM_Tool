import api from "./client";
import { type Identidad } from "./identidad";

export interface Query {
    objetivo: string;
}
export const generateIdentidad = async (data: Query): Promise<Identidad> => {
    const response = await api.post('/asistente/generar-identidad', data);
    return response.data
}