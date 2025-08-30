import api from "./client";

export interface MuestraGrafica {
    id_muestra: number;
    id_accion: number;
    titulo: string;
    url: string;
    formato: string;
}

export const getMuestrasByAccion = async (id_accion: number): Promise<MuestraGrafica[]> => {
    const res = await api.get(`/muestras_graficas/listar/${id_accion}`);
    return res.data;
};

export const createMuestraExterna = async (data: Omit<MuestraGrafica, "id_muestra">): Promise<MuestraGrafica> => {
    const res = await api.post("/muestras_graficas/crear/externo", data);
    return res.data;
};

export const createMuestraUpload = async (
    muestra: { titulo: string; formato: string; id_accion: number },
    file: File
): Promise<MuestraGrafica> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("titulo", muestra.titulo);
    formData.append("formato", muestra.formato);
    formData.append("id_accion", muestra.id_accion.toString());
    formData.append("url", "")

    const res = await api.post("/muestras_graficas/crear/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const updateMuestra = async (id_muestra: number, data: Partial<MuestraGrafica>): Promise<MuestraGrafica> => {
    const res = await api.put(`/muestras_graficas/actualizar/${id_muestra}`, data);
    return res.data;
};

export const deleteMuestra = async (id_muestra: number): Promise<void> => {
    await api.delete(`/muestras_graficas/eliminar/${id_muestra}`);
};
