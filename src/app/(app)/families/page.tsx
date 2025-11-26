"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Users, Plus, LogIn, Crown, ArrowRight, Loader2, Copy, Check, ExternalLink } from "lucide-react";
import { familyService } from "@/services/family.service";
import Modal from "@/components/ui/Modal";
import CreateFamilyForm from "@/components/CreateFamilyForm";
import JoinFamilyForm from "@/components/JoinFamilyForm";
import clsx from "clsx";

export default function FamiliesPage() {
    const router = useRouter();
    const [families, setFamilies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isCreateFamilyModalOpen, setIsCreateFamilyModalOpen] = useState(false);
    const [isJoinFamilyModalOpen, setIsJoinFamilyModalOpen] = useState(false);

    useEffect(() => {
        const loadFamilies = async () => {
            const profileId = Cookies.get("activeProfileId");
            if (!profileId) return router.push("/profiles");

            try {
                const data = await familyService.getMyFamilies(profileId);
                console.log("Families Data Received:", data); // LOGGING
                setFamilies(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadFamilies();
    }, [router]);

    const handleCopyCode = (e: React.MouseEvent, code: string, id: string) => {
        e.stopPropagation(); // Evitar seleccionar la tarjeta al copiar
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleAccessFamily = () => {
        if (selectedFamilyId) {
            router.push(`/families/${selectedFamilyId}`);
        }
    };

    const handleCreateFamilySubmit = async (data: any) => {
        const profileId = Cookies.get("activeProfileId");
        if (!profileId) return;

        try {
            await familyService.create({ ...data, profileId });
            setIsCreateFamilyModalOpen(false);
            // Reload families
            const updatedFamilies = await familyService.getMyFamilies(profileId);
            setFamilies(updatedFamilies);
        } catch (err) {
            console.error("Error creating family:", err);
        }
    };

    const handleJoinFamilySubmit = async (data: any) => {
        const profileId = Cookies.get("activeProfileId");
        if (!profileId) return;

        try {
            await familyService.join({ ...data, profileId });
            setIsJoinFamilyModalOpen(false);
            // Reload families
            const updatedFamilies = await familyService.getMyFamilies(profileId);
            setFamilies(updatedFamilies);
        } catch (err) {
            console.error("Error joining family:", err);
        }
    };

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-teal-600" /></div>;

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto pb-24">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-8 h-8 text-teal-600" /> Mis Familias
                    </h1>
                    <p className="text-slate-500 mt-1">Seleccione la familia a la que desea acceder.</p>
                </div>

                <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => setIsJoinFamilyModalOpen(true)}>
                        <LogIn className="w-4 h-4 mr-2" />
                        Unirse
                    </Button>
                    <Button variant="primary" onClick={() => setIsCreateFamilyModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Familia
                    </Button>
                </div>
            </div>

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

            {/* LISTA DE TARJETAS */}
            {families.length === 0 ? (
                // --- ESTADO VACÍO ---
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300 dark:bg-slate-900 dark:border-slate-800">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm dark:bg-slate-800">
                        <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No perteneces a ninguna familia aún</h3>
                    <p className="text-slate-500 max-w-md mx-auto mt-2 mb-6">
                        Crea un grupo para compartir los gastos de casa, el viaje con amigos o la pareja.
                    </p>
                    <Button variant="primary" onClick={() => setIsCreateFamilyModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear mi primera familia
                    </Button>
                </div>
            ) : (
                // --- TARJETAS DE FAMILIA ---
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {families.map((family) => {
                        const isSelected = selectedFamilyId === family.id;
                        // Fallback para nombre
                        const familyName = family.name || "Familia sin nombre";
                        const initial = familyName.charAt(0).toUpperCase();

                        return (
                            <div
                                key={family.id}
                                onClick={() => setSelectedFamilyId(family.id)}
                                className={clsx(
                                    "group p-6 rounded-2xl shadow-sm border transition-all cursor-pointer relative overflow-hidden",
                                    isSelected
                                        ? "bg-teal-50 border-teal-500 ring-2 ring-teal-500 ring-offset-2 dark:bg-teal-900/20 dark:ring-offset-slate-950"
                                        : "bg-white border-slate-100 hover:shadow-md hover:border-teal-100 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
                                )}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    {/* AVATAR CON INICIAL */}
                                    <div className={clsx(
                                        "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-colors",
                                        isSelected
                                            ? "bg-teal-200 text-teal-800 dark:bg-teal-800 dark:text-teal-100"
                                            : "bg-gradient-to-br from-teal-100 to-emerald-50 text-teal-700 dark:from-slate-800 dark:to-slate-700 dark:text-slate-300"
                                    )}>
                                        {initial}
                                    </div>
                                    {family.isAdmin && (
                                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-bold border border-amber-200">
                                            <Crown className="w-3 h-3" /> Admin
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 truncate">
                                    {familyName}
                                </h3>

                                {/* Invite Code Section */}
                                <div className="flex items-center gap-2 mb-4 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 w-fit">
                                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Código:</span>
                                    <code className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                                        {family.inviteCode || '??????'}
                                    </code>
                                    <button
                                        onClick={(e) => handleCopyCode(e, family.inviteCode || '', family.id)}
                                        className="ml-1 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-teal-600"
                                        title="Copiar código"
                                        disabled={!family.inviteCode}
                                    >
                                        {copiedId === family.id ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                </div>

                                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-4 h-4" /> {family.membersCount || 1} Miembros
                                    </span>
                                    {isSelected && (
                                        <span className="text-teal-600 font-medium flex items-center animate-pulse">
                                            Seleccionado <Check className="w-4 h-4 ml-1" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* FLOATING ACTION BUTTON */}
            <div className={clsx(
                "fixed bottom-8 left-1/2 -translate-x-1/2 transition-all duration-300 z-50",
                selectedFamilyId ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
            )}>
                <Button
                    size="lg"
                    className="shadow-xl rounded-full px-8 py-6 text-lg font-bold bg-teal-600 hover:bg-teal-700 text-white ring-4 ring-white dark:ring-slate-950"
                    onClick={handleAccessFamily}
                >
                    Acceder a la Familia <ExternalLink className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}