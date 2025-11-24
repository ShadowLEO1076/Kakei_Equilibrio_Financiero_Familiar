import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const budgetService = {

    // --- 1. LECTURA (GET) ---
    // Trae la configuración actual para llenar los inputs
    async getAllByProfile(profileId: string) {
        const token = Cookies.get('token');

        // OJO AQUÍ: 
        // Si en tu Router backend pusiste: router.get('/:profileId') -> Usa la línea de abajo.
        // Si dejaste: router.get('/profile/:profileId') -> Agrega '/profile' a la URL.
        const res = await fetch(`${API_URL}/budgets/${profileId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            // Si no hay presupuestos aún o falla, devolvemos array vacío para no romper la UI
            return [];
        }

        return await res.json();
    },

    // --- 2. ESCRITURA EN LOTE (POST) ---
    // Envía el array completo de categorías configuradas
    async saveBudgets(data: { profileId: string; budgets: { categoryId: string; amount: number }[] }) {
        const token = Cookies.get('token');

        // Conecta con tu BudgetController.createBatch
        const res = await fetch(`${API_URL}/budgets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            // El backend espera: { "profileId": "...", "budgets": [...] }
            // Al pasar 'data' tal cual, cumplimos el contrato.
            body: JSON.stringify(data)
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.error || json.message || 'Error al guardar presupuestos');
        }

        return json;
    }
};