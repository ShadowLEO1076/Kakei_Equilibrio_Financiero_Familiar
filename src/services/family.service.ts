import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const familyService = {

    // Crear una familia
    async create(data: { name: string; adminProfileId: string }) {
        const token = Cookies.get('token');

        const res = await fetch(`${API_URL}/families`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error al crear familia');
        return json;
    },

    // Unirse a una familia
    async join(data: { profileId: string; inviteCode: string }) {
        const token = Cookies.get('token');

        const res = await fetch(`${API_URL}/families/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error al unirse a la familia');
        return json;
    }
};