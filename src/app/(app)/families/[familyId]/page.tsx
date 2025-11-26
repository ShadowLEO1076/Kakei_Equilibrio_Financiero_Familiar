"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
    Users, UserPlus, Trash2, Copy, Check,
    MoreVertical, Trophy, Loader2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import clsx from "clsx";

// Servicios
import { familyService } from "@/services/family.service";

const AVATAR_COLORS = [
    "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
];

export default function FamilyDetailsPage() {
    const params = useParams();
    const router = useRouter();

    // Capturamos el ID de la URL con seguridad
    const familyId = (params?.familyId || params?.id) as string;

    const [family, setFamily] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

    const myProfileId = Cookies.get("activeProfileId");

    useEffect(() => {
        const fetchDetails = async () => {
            if (!familyId) return; // Esperar a que Next.js cargue el ID
            if (!myProfileId) return router.push("/profiles");

            try {
                setIsLoading(true);
                const data = await familyService.getFamilyDetails(familyId);
                setFamily(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "No se pudo cargar la familia.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [familyId, myProfileId, router]);

    const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : "??";
    const isAdmin = family?.adminProfileId === myProfileId;

    const rankedMembers = family?.members ? family.members.map((m: any) => {
        const budget = m.budget || 0;
        const spent = m.spent || 0;
        const savings = budget - spent;
        const savingsRate = budget > 0 ? (savings / budget) * 100 : 0;
        return { ...m, budget, spent, savings, savingsRate };
    }).sort((a: any, b: any) => b.savingsRate - a.savingsRate) : [];

    const champion = rankedMembers.length > 0 ? rankedMembers[0] : null;

    const handleRemoveMember = async (memberProfileId: string) => {
        if (!confirm("¿Estás seguro de expulsar a este miembro?")) return;
        try {
            await familyService.removeMember(familyId, memberProfileId);
            setFamily((prev: any) => ({
                ...prev,
                members: prev.members.filter((m: any) => m.profileId !== memberProfileId)
            }));
            setMenuOpenId(null);
        } catch (e) {
            alert("Error al eliminar miembro");
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(family.inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!familyId || isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-500 w-8 h-8" /></div>;
    if (error) return <div className="text-center py-20 text-slate-500 flex flex-col items-center gap-2"><AlertCircle className="w-10 h-10 text-red-400" /> {error}</div>;
    if (!family) return null;

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 pb-20">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-200 dark:border-slate-800 pb-8">
                <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg dark:bg-slate-800">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{family.name}</h1>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                            <span>{family.members.length} Miembros</span>
                            <span>•</span>
                            {isAdmin && <span className="font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded text-xs border border-teal-100 dark:bg-teal-900/20 dark:border-teal-900">Eres Admin</span>}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Código</div>
                    <code className="text-lg font-mono font-bold text-slate-800 dark:text-white">{family.inviteCode}</code>
                    <button onClick={copyCode} className="ml-2 p-1.5 hover:bg-slate-200 rounded-md transition-colors dark:hover:bg-slate-800">
                        {copied ? <Check size={16} className="text-teal-600" /> : <Copy size={16} className="text-slate-400" />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* IZQUIERDA: LÍDER */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Trophy className="text-amber-500" size={20} /> Mejor Desempeño
                    </h2>
                    {champion && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-amber-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 dark:bg-amber-900/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-50 border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg mb-4 text-2xl font-bold text-amber-700 dark:text-amber-400">
                                    {getInitials(champion.name)}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{champion.name}</h3>
                                <p className="text-slate-500 text-sm mb-6">Liderando el equipo</p>
                            </div>
                        </div>
                    )}
                    {isAdmin && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Gestión</h4>
                            <Button variant="ghost" className="w-full justify-start text-sm h-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" onClick={copyCode}>
                                <UserPlus size={16} className="mr-2" /> Copiar invitación
                            </Button>
                        </div>
                    )}
                </div>

                {/* DERECHA: MIEMBROS */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Users size={20} className="text-slate-400" /> Miembros
                    </h2>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
                            {rankedMembers.map((member: any, index: number) => {
                                const isChampion = index === 0;
                                const isMe = member.profileId === myProfileId;
                                const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
                                const isCritical = member.budget > 0 && member.spent > member.budget;

                                return (
                                    <div key={member.profileId} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-4 group">
                                        <div className="w-6 text-center text-sm font-bold text-slate-300">{index + 1}</div>
                                        <div className={clsx("h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0", colorClass)}>
                                            {getInitials(member.name)}
                                        </div>
                                        <div className="flex-1 min-w-0 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate flex items-center gap-2">
                                                    {member.name}
                                                    {isChampion && <Trophy size={14} className="text-amber-500" />}
                                                    {isMe && <span className="text-slate-400 font-normal text-xs">(Tú)</span>}
                                                </h4>
                                                <p className="text-xs text-slate-500">
                                                    {member.role === 'admin' ? 'Administrador' : 'Miembro'}
                                                </p>
                                            </div>
                                            {member.budget > 0 ? (
                                                <div className="text-right text-xs">
                                                    <span className={isCritical ? "text-rose-500 font-bold" : "text-teal-600"}>
                                                        {isCritical ? "Excedido" : "Sano"}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="text-right text-xs text-slate-400">--</div>
                                            )}
                                        </div>
                                        {isAdmin && member.profileId !== myProfileId && (
                                            <div className="relative">
                                                <button onClick={() => setMenuOpenId(menuOpenId === member.profileId ? null : member.profileId)} className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-white rounded-lg transition-opacity">
                                                    <MoreVertical size={16} />
                                                </button>
                                                {menuOpenId === member.profileId && (
                                                    <div className="absolute right-0 top-8 z-20 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 py-1 overflow-hidden">
                                                        <button onClick={() => handleRemoveMember(member.profileId)} className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2">
                                                            <Trash2 size={14} /> Expulsar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {menuOpenId && <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)}></div>}
        </div>
    );
}