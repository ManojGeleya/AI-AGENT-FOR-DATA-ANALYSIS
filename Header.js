function Header({ title }) {
    const handleNotification = () => {
        alert("No new notifications");
    };

    const handleHelp = () => {
        alert("Help Center: \n1. Upload CSV/JSON files on 'New Analysis'.\n2. View insights on Dashboard.\n3. Check raw data in 'Data View'.\n4. Train models in 'Models'.");
    };

    return (
        <header className="h-[var(--header-height)] fixed top-0 right-0 left-[var(--sidebar-width)] z-10 px-8 flex items-center justify-between backdrop-blur-sm bg-[var(--bg-color)]/50 transition-all duration-300">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">{title}</h1>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">GELEYA.AI Autonomous Platform</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/10 text-xs text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    System Operational
                </div>

                <div className="h-8 w-[1px] bg-white/10 mx-1"></div>

                <button 
                    onClick={handleNotification}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95"
                    title="Notifications"
                >
                    <div className="icon-bell text-xl"></div>
                </button>
                <button 
                    onClick={handleHelp}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95"
                    title="Help"
                >
                    <div className="icon-circle-help text-xl"></div>
                </button>
            </div>
        </header>
    );
}