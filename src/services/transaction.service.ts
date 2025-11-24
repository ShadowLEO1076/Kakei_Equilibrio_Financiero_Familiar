import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const transactionService = {

    // --- GASTOS (Expenses) ---
    async createExpense(data: any) {
        const token = Cookies.get('token');
        const res = await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error al guardar gasto');
        return json;
    },

    async getExpenses(profileId: string) {
        const token = Cookies.get('token');
        // GET /expenses/:profileId
        const res = await fetch(`${API_URL}/expenses/${profileId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.ok ? await res.json() : [];
    },

    // --- INGRESOS (Incomes) - ¡NUEVO! ---
    async createIncome(data: any) {
        const token = Cookies.get('token');
        const res = await fetch(`${API_URL}/incomes`, { // Asegúrate de tener esta ruta en tu backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error al guardar ingreso');
        return json;
    },

    async getIncomes(profileId: string) {
        const token = Cookies.get('token');
        // GET /incomes/:profileId
        const res = await fetch(`${API_URL}/incomes/${profileId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.ok ? await res.json() : [];
    }
};