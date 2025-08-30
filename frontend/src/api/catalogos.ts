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

export const getSituacionesSentimentales = async (): Promise<Opcion[]> => {
    const res = await api.get("/situaciones_sentimentales/list");
    return res.data.map((s: any) => ({ id: s.id_situacion_sentimental, nombre: s.nombre }));
}
export const getOrientacionesSexuales = async (): Promise<Opcion[]> => {
    const res = await api.get("/orientacion_sexual/list");
    return res.data.map((o: any) => ({ id: o.id_orientacion, nombre: o.nombre }));
}
export const getOrientacionesPoliticas = async (): Promise<Opcion[]> => {
    const res = await api.get("/orientacion_politica/list");
    return res.data.map((o: any) => ({ id: o.id_orientacion_politica, nombre: o.nombre }));
}
export const getNacionalidades = async (): Promise<Opcion[]> => {
    const res = await api.get("/nacionalidad/list");
    return res.data.map((n: any) => ({ id: n.id_nacionalidad, nombre: n.nombre }));
}
export const getPais = async (): Promise<Opcion[]> => {
    const res = await api.get("/pais/list");
    return res.data.map((n: any) => ({ id: n.id_pais, nombre: n.nombre }));
}

export const getRedesSociales = async (): Promise<Opcion[]> => {
    const res = await api.get('/redes-sociales/lista')
    return res.data.map((n: any) => ({ id: n.id_red_social, nombre: n.nombre }));
}

