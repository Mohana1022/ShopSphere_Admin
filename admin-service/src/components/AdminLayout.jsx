import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import {
    PanelLeftClose,
    PanelLeftOpen,
    Menu,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { logout } from '../api/axios';

/**
 * AdminLayout — shared responsive layout wrapper for all admin pages.
 *
 * Props:
 *  - activePage: string (sidebar highlight)
 *  - title: string (header title)
 *  - subtitle?: string (header subtitle)
 *  - badge?: string (small badge next to title, e.g. "Live")
 *  - badgeColor?: string ("emerald" | "blue" | default)
 *  - headerRight?: ReactNode (right side of header)
 *  - children: ReactNode (main content)
 */
const AdminLayout = ({
    activePage,
    title,
    subtitle,
    badge,
    badgeColor = 'emerald',
    headerRight,
    children
}) => {
    const { isDarkMode } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setIsSidebarOpen(false);
            else if (window.innerWidth >= 1024) setIsSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const badgeColors = {
        emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activePage={activePage}
                onLogout={logout}
            />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Responsive Header */}
                <header className={`border-b px-4 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-20 flex items-center justify-between sticky top-0 z-20 transition-all duration-300 shrink-0 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`p-2 rounded-xl border transition-all shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm'}`}
                        >
                            <span className="md:hidden"><Menu className="w-5 h-5" /></span>
                            <span className="hidden md:block">
                                {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                            </span>
                        </button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h1 className={`text-sm sm:text-base lg:text-lg font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h1>
                                {badge && (
                                    <span className={`text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase border tracking-normal leading-none shrink-0 hidden sm:inline-flex ${badgeColors[badgeColor] || badgeColors.emerald}`}>
                                        {badge}
                                    </span>
                                )}
                            </div>
                            {subtitle && (
                                <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-normal hidden sm:block truncate">{subtitle}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        {headerRight}
                    </div>
                </header>

                {/* Responsive Main Content */}
                <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 transition-all">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
