import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const categoryService = {
    // Trae las categorías globales + las del perfil
    async getAll(profileId: string) {
        const token = Cookies.get('token');

        // Ruta: GET /categories/:profileId
        const res = await fetch(`${API_URL}/categories/${profileId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) return [];
        return await res.json();
    }
};