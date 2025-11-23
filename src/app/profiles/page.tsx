"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Componentes UI
import ProfileCard from "@/components/ui/ProfileCard";
import AddProfileCard from "@/components/ui/AddProfileCard";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

// Formularios
import CreateProfileForm from "@/components/CreateProfileForm";
import CreateFamilyForm from "@/components/CreateFamilyForm";
import JoinFamilyForm from "@/components/JoinFamilyForm";

// Servicios
import { profileService } from "@/services/profile.service";
import { familyService } from "@/services/family.service";

// Tipos
type ProfileData = {
  id: string; // Mongo ID
  name: string;
  avatarInitial?: string;
};

export default function ProfileSelectionPage() {
  const router = useRouter();

  // Estados de Datos
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de Modales
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState(false);
  const [isCreateFamilyModalOpen, setIsCreateFamilyModalOpen] = useState(false);
  const [isJoinFamilyModalOpen, setIsJoinFamilyModalOpen] = useState(false);

  // --- 1. CARGA INICIAL (useEffect) ---
  useEffect(() => {
    const currentUserId = Cookies.get("currentUserId");
    const token = Cookies.get("token");

    if (!currentUserId || !token) {
      router.push("/login"); // Si no hay sesión, fuera.
      return;
    }

    setUserId(currentUserId);

    const fetchProfiles = async () => {
      try {
        const data = await profileService.getMyProfiles(currentUserId);
        // Mapeamos los datos del backend a tu interfaz visual
        const formattedProfiles = data.map((p: any) => ({
          id: p.id || p._id,
          name: p.name,
          avatarInitial: p.name.charAt(0).toUpperCase()
        }));
        setProfiles(formattedProfiles);
      } catch (error) {
        console.error("Error cargando perfiles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, [router]);


  // --- MANEJADORES DE EVENTOS ---

  // Cuando se selecciona un perfil existente
  const handleSelectProfile = (profileId: string) => {
    // 1. Efecto visual de selección
    setSelectedProfileId(profileId);

    // 2. Guardamos la cookie del perfil activo (IMPORTANTE para el Dashboard)
    Cookies.set("activeProfileId", profileId);

    // NOTA: No redirigimos inmediatamente para darte tiempo a ver 
    // que aparecieron los botones de familia abajo.
    // Si quisieras entrar directo, descomenta la línea de abajo:
    // router.push("/dashboard"); 
  };

  const handleEnterDashboard = () => {
    if (selectedProfileId) {
      router.push("/dashboard");
    }
  };

  // --- LOGICA: CREAR PERFIL ---
  const handleCreateProfileSubmit = async (name: string) => {
    if (!userId) return;

    try {
      // Llamada a la API
      const newProfile = await profileService.createProfile({
        name: name,
        userId: userId,
        preferences: { currency: 'USD' } // Default
      });

      // Actualizamos la lista visualmente sin recargar
      const newProfileData: ProfileData = {
        id: newProfile.id || newProfile._id,
        name: newProfile.name,
        avatarInitial: newProfile.name.charAt(0).toUpperCase()
      };

      setProfiles((prev) => [...prev, newProfileData]);
      setIsCreateProfileModalOpen(false);
      handleSelectProfile(newProfileData.id); // Seleccionamos el nuevo

    } catch (error) {
      console.error(error);
      alert("Error al crear perfil");
    }
  };

  // --- LOGICA: CREAR FAMILIA ---
  const handleCreateFamilySubmit = async (familyName: string) => {
    if (!selectedProfileId) {
      alert("Por favor selecciona un perfil primero.");
      return;
    }

    try {
      // Llamada a la API (Doble Impacto: Crea Familia y Membresía Admin)
      const family = await familyService.create({
        name: familyName,
        adminProfileId: selectedProfileId
      });

      alert(`¡Familia "${family.name}" creada! Código de invitación: ${family.inviteCode}`);
      setIsCreateFamilyModalOpen(false);
      // Aquí podrías redirigir al dashboard ya
      router.push("/dashboard");

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error al crear familia");
    }
  };

  // --- LOGICA: UNIRSE A FAMILIA ---
  const handleJoinFamilySubmit = async (inviteCode: string) => {
    if (!selectedProfileId) {
      alert("Por favor selecciona un perfil primero.");
      return;
    }

    try {
      // Llamada a la API
      await familyService.join({
        profileId: selectedProfileId,
        inviteCode: inviteCode
      });

      alert("¡Te has unido a la familia exitosamente!");
      setIsJoinFamilyModalOpen(false);
      router.push("/dashboard");

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error al unirse. Verifica el código.");
    }
  };


  if (isLoading) return <div className="flex h-screen items-center justify-center">Cargando tus perfiles... ⏳</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 dark:bg-slate-950">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          ¿Quién está usando Kakei?
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Selecciona tu perfil o crea uno nuevo para empezar a gestionar tus finanzas.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-12">
        {/* Mapeo de perfiles reales */}
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            id={profile.id}
            name={profile.name}
            avatarInitial={profile.avatarInitial}
            isSelected={selectedProfileId === profile.id}
            onClick={() => handleSelectProfile(profile.id)}
          />
        ))}

        {/* Botón para abrir modal de crear perfil */}
        <div onClick={() => setIsCreateProfileModalOpen(true)}>
          <AddProfileCard />
        </div>
      </div>

      {/* Sección de Acciones de Familia (SOLO VISIBLE SI SELECCIONAS UN PERFIL) */}
      {selectedProfileId && (
        <div className="mt-12 w-full max-w-lg text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Gestionar Familias con "{profiles.find(p => p.id === selectedProfileId)?.name}"
          </h2>

          <div className="flex flex-col gap-4">
            {/* Botón principal para entrar */}
            <Button
              variant="primary"
              className="w-full py-4 text-xl shadow-lg hover:scale-105 transition-transform"
              onClick={handleEnterDashboard}
            >
              ➡️ ENTRAR AL DASHBOARD
            </Button>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-2">
              <Button
                variant="ghost"
                className="px-6 py-2 border-2 border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400"
                onClick={() => setIsCreateFamilyModalOpen(true)}
              >
                CREAR FAMILIA
              </Button>
              <Button
                variant="default"
                className="px-6 py-2"
                onClick={() => setIsJoinFamilyModalOpen(true)}
              >
                UNIRSE A FAMILIA
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bloque de Información Importante */}
      <div className="mt-12 max-w-lg text-left bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-lg p-4 text-blue-800 dark:text-blue-200">
        <p className="font-semibold mb-2">Información Importante:</p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Cada PERFIL es personal. Tienes control total sobre él.</li>
          <li>Si un PERFIL se une a una FAMILIA, sus gastos SÍ se suman al total de la familia para los ADMINes.</li>
          <li>Solo los ADMINes pueden ver el detalle de toda la familia. Los miembros solo ven sus propios datos.</li>
        </ul>
      </div>


      {/* --- Modales --- */}

      <Modal
        isOpen={isCreateProfileModalOpen}
        onClose={() => setIsCreateProfileModalOpen(false)}
        title="Crear Nuevo Perfil"
      >
        {/* Asegúrate de que este componente reciba las props correctas */}
        <CreateProfileForm
          onClose={() => setIsCreateProfileModalOpen(false)}
          onFormSubmit={handleCreateProfileSubmit}
        />
      </Modal>

      <Modal
        isOpen={isCreateFamilyModalOpen}
        onClose={() => setIsCreateFamilyModalOpen(false)}
        title="Crear Nueva Familia"
      >
        <CreateFamilyForm
          onClose={() => setIsCreateFamilyModalOpen(false)}
          onFormSubmit={handleCreateFamilySubmit}
        />
      </Modal>

      <Modal
        isOpen={isJoinFamilyModalOpen}
        onClose={() => setIsJoinFamilyModalOpen(false)}
        title="Unirse a una Familia"
      >
        <JoinFamilyForm
          onClose={() => setIsJoinFamilyModalOpen(false)}
          onFormSubmit={handleJoinFamilySubmit}
        />
      </Modal>
    </main>
  );
}