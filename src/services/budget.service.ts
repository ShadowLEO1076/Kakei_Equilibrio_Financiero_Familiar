import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const budgetService = {

    // Obtener los presupuestos actuales (Ya lo tenías)
    async getAllByProfile(profileId: string) {
        const token = Cookies.get('token');
        // Asegúrate que tu backend tenga esta ruta: GET /budgets/:profileId
        const res = await fetch(`${API_URL}/budgets/${profileId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return [];
        return await res.json();
    },

    // GUARDAR O ACTUALIZAR (El que falta)
    async saveBudgets(data: { profileId: string, budgets: any[] }) {
        const token = Cookies.get('token');

        // Asumimos ruta: POST /budgets/batch (o donde decidas procesar el array)
        const res = await fetch(`${API_URL}/budgets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error al guardar presupuestos');
        return json;
    }
};