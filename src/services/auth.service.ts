// src/services/auth.service.ts
import Cookies from 'js-cookie';

// Usamos la variable de entorno que definiste en .env.local
// Asegúrate de que sea: NEXT_PUBLIC_API_URL=http://localhost:3001
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// CHIVATO DE INICIO
console.log(" SENPAI DEBUG - Auth Service iniciado. API:", API_URL);

export const authService = {

    // --- REGISTRO ---
    async register(data: { username: string; email: string; password: string; age?: number }) {

        const targetUrl = `${API_URL}/users/register`;

        console.log(" SENPAI DEBUG - Registrando en:", targetUrl);

        const res = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        // Verificación de seguridad por si devuelve HTML (Error 404/500)
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") === -1) {
            console.error(" ERROR CRÍTICO: Recibí HTML.");
            throw new Error("El servidor devolvió un error HTML. Revisa la consola y la URL.");
        }

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.message || json.error || 'Error al registrarse');
        }

        // Si el registro devuelve token y usuario, los guardamos de una vez
        if (json.token) {
            Cookies.set('token', json.token, { expires: 7 });

            // Intentamos guardar el ID si viene en el registro
            const userId = json.user?.id || json.user?._id;
            if (userId) {
                Cookies.set('currentUserId', userId, { expires: 7 });
            }
        }

        return json;
    },

    // --- LOGIN ---
    async login(data: { email: string; password: string }) {

        const targetUrl = `${API_URL}/users/login`;
        console.log(" SENPAI DEBUG - Login en:", targetUrl);

        const res = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        // Verificación de HTML
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") === -1) {
            throw new Error("El servidor devolvió HTML (posiblemente 404). Revisa la URL.");
        }

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.message || json.error || 'Credenciales inválidas');
        }

        // AQUÍ ESTÁ LA MAGIA PARA TUS PERFILES
        if (json.token) {
            // 1. Guardamos el Token
            Cookies.set('token', json.token, { expires: 7 });

            // 2. Buscamos el ID del usuario en la respuesta
            // Puede venir como json.user._id o json.user.id dependiendo de tu mapper
            const userId = json.user?.id || json.user?._id || json.id;

            if (userId) {
                Cookies.set('currentUserId', userId, { expires: 7 });
                console.log("  DEBUG - User ID guardado en cookie:", userId);
            } else {
                console.warn("  WARNING - No encontré el ID del usuario en la respuesta del login. Revisa tu backend.");
                console.log(" Respuesta recibida:", json);
            }
        }

        return json;
    },

    // --- LOGOUT ---
    logout() {
        // Limpiamos TODAS las cookies importantes
        Cookies.remove('token');
        Cookies.remove('currentUserId');
        Cookies.remove('activeProfileId'); // Por si acaso ya seleccionó un perfil
        window.location.href = '/login';
    }
};