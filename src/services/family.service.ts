import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const familyService = {

    // --- 1. CREACIÓN Y UNIÓN ---

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

    // Unirse a una familia con código
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
    },

    // --- 2. LECTURA ---

    // Obtener la lista de familias a las que pertenezco (Para /families)
    async getMyFamilies(profileId: string) {
        const token = Cookies.get('token');

        // GET /families/my-families/:profileId
        const res = await fetch(`${API_URL}/families/my-families/${profileId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        // Si no hay familias o falla levemente, devolvemos array vacío para no romper la UI
        if (!res.ok) return [];
        return await res.json();
    },

    // Obtener el detalle completo con miembros y finanzas (Para el Dashboard Familiar)
    async getFamilyDetails(familyId: string) {
        const token = Cookies.get('token');

        // 1. Imprimimos qué estamos pidiendo para verificar la URL
        console.log(`📡 Fetching: ${API_URL}/families/${familyId}/details`);

        const res = await fetch(`${API_URL}/families/${familyId}/details`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        // 2. Leemos el JSON una sola vez
        const json = await res.json();

        if (!res.ok) {
            //  DIAGNÓSTICO PROFUNDO 
            console.error("ERROR REAL DEL BACKEND:", json);

            // Priorizamos 'error' (lo que usa tu controller), luego 'message', luego el objeto entero
            const realErrorMessage = json.error || json.message || JSON.stringify(json);

            throw new Error(realErrorMessage);
        }

        return json;
    },

    // --- 3. ADMINISTRACIÓN ---

    // Expulsar miembro (Solo Admin)
    async removeMember(familyId: string, memberProfileId: string) {
        const token = Cookies.get('token');

        // DELETE /families/:familyId/members/:memberProfileId
        const res = await fetch(`${API_URL}/families/${familyId}/members/${memberProfileId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            throw new Error(json.message || 'No se pudo eliminar al miembro');
        }
        return true;
    }
};