function Sidebar({ currentPage, setCurrentPage, user, onLogout }) {
    const menuItems = [
        { id: 'upload', label: 'New Analysis', icon: 'icon-plus' },
        { id: 'dashboard', label: 'Dashboard', icon: 'icon-layout-dashboard' },
        { id: 'data', label: 'Data View', icon: 'icon-table' },
        { id: 'models', label: 'Models', icon: 'icon-brain' },
        { id: 'settings', label: 'Settings', icon: 'icon-settings' },
    ];

    return (
        <aside className="w-[var(--sidebar-width)] h-screen fixed left-0 top-0 flex flex-col z-20 bg-slate-900/80 backdrop-blur-xl border-r border-white/5">
            {/* Logo Area */}
            <div className="h-[var(--header-height)] flex items-center px-6 border-b border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                        <div className="icon-bot text-white text-xl"></div>
                    </div>
                    <div>
                        <span className="font-bold text-lg tracking-tight text-white block leading-tight">GELEYA.AI</span>
                        <span className="text-[10px] text-indigo-400 font-semibold tracking-widest uppercase">Autonomous Agent</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-4 overflow-y-auto space-y-8">
                <div>
                    <div className="px-2 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        Main Menu
                    </div>
                    <nav className="space-y-2">
                        {menuItems.slice(0, 3).map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentPage(item.id)}
                                className={`w-full sidebar-link group ${currentPage === item.id ? 'active' : ''}`}
                            >
                                <div className={`${item.icon} transition-colors group-hover:text-white ${currentPage === item.id ? 'text-indigo-400' : ''}`}></div>
                                <span className="font-medium">{item.label}</span>
                                {currentPage === item.id && (
                                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div>
                    <div className="px-2 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        Configuration
                    </div>
                    <nav className="space-y-2">
                        {menuItems.slice(3).map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentPage(item.id)}
                                className={`w-full sidebar-link group ${currentPage === item.id ? 'active' : ''}`}
                            >
                                <div className={`${item.icon} transition-colors group-hover:text-white ${currentPage === item.id ? 'text-indigo-400' : ''}`}></div>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-white/5 mx-2 mb-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group relative">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow-lg uppercase">
                        {user.name.substring(0, 2)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-medium text-white truncate">{user.name}</div>
                        <div className="text-xs text-slate-400 truncate">{user.email}</div>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="opacity-0 group-hover:opacity-100 absolute right-2 bg-slate-800 p-1.5 rounded hover:bg-slate-700 transition-all text-slate-400 hover:text-white"
                        title="Logout"
                    >
                        <div className="icon-log-out text-xs"></div>
                    </button>
                </div>
            </div>
        </aside>
    );
}