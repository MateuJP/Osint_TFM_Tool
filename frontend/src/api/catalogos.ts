import api from "./client";

export interface Opcion {
    id: number;
    nombre: string;
}

export const getGeneros = async (): Promise<Opcion[]> => {
    const res = await api.get("/generos/listar");
    return res.data.map((g: any) => ({ id: g.id_genero, nombre: g.nombre }));
};

export const getEstados = async (): Promise<Opcion[]> => {
    const res = await api.get("/estados/list");
    return res.data.map((e: any) => ({ id: e.id_estado, nombre: e.nombre }));
};

