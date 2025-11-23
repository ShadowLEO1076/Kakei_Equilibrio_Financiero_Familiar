// src/services/profile.service.ts
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const profileService = {

    // Obtener todos los perfiles del usuario logueado
    async getMyProfiles(userId: string) {
        const token = Cookies.get('token'); // Recuperamos el token para tener permiso

        const res = await fetch(`${API_URL}/profiles/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // ¡Tu pase VIP!
            },
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.message || 'Error al obtener perfiles');
        }

        return json; // Esto debería ser un array de perfiles []
    },

    // Crear un perfil nuevo (lo usaremos pronto)
    // Agrega esto dentro de profileService en src/services/profile.service.ts

    async createProfile(data: { name: string; userId: string; preferences?: any }) {
        const token = Cookies.get('token');

        const res = await fetch(`${API_URL}/profiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Error al crear perfil');
        return json;
    }
};