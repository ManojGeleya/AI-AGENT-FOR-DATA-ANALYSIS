function AgentLog({ logs, isProcessing }) {
    const scrollRef = React.useRef(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="card-glass h-full flex flex-col overflow-hidden bg-black/40 border-slate-700/50 shadow-inner shadow-black/50">
            {/* Terminal Header */}
            <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
                    <div className="flex items-center gap-2 text-xs font-mono text-indigo-300">
                        <div className="icon-terminal text-sm"></div>
                        <span>AGENT_CORE.exe</span>
                    </div>
                </div>
                {isProcessing && (
                    <div className="flex items-center gap-2 text-[10px] text-green-400 font-mono bg-green-900/20 px-2 py-1 rounded border border-green-500/20 animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
                        PROCESSING
                    </div>
                )}
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-sm relative" ref={scrollRef}>
                {/* Background Grid Line Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,22,41,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,6px_100%]"></div>

                {logs.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600 z-10 relative opacity-50">
                        <div className="icon-cpu text-4xl mb-3 animate-pulse"></div>
                        <p className="text-xs tracking-widest uppercase">System Standby</p>
                    </div>
                )}

                {logs.map((log, index) => (
                    <div 
                        key={index} 
                        className="relative z-10 flex gap-4 animate-slide-up"
                        style={{ animationDelay: '0.05s' }}
                    >
                        {/* Timeline Connector */}
                        <div className="absolute left-[19px] top-6 bottom-[-20px] w-[1px] bg-white/5 last:hidden"></div>

                        <div className={`
                            mt-1 min-w-[32px] h-[32px] rounded-lg flex items-center justify-center border
                            ${log.step === 'Thought' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : ''}
                            ${log.step === 'Action' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : ''}
                            ${log.step === 'Observation' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : ''}
                            ${log.step === 'Success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : ''}
                            ${log.step === 'Error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : ''}
                        `}>
                            {log.step === 'Thought' && <div className="icon-brain text-sm"></div>}
                            {log.step === 'Action' && <div className="icon-hammer text-sm"></div>}
                            {log.step === 'Observation' && <div className="icon-eye text-sm"></div>}
                            {log.step === 'Success' && <div className="icon-check text-sm"></div>}
                            {log.step === 'Error' && <div className="icon-circle-x text-sm"></div>}
                        </div>
                        
                        <div className="flex-1 pb-2">
                            <span className={`
                                text-[10px] font-bold tracking-widest uppercase mb-1 block flex items-center gap-2
                                ${log.step === 'Thought' ? 'text-purple-400' : ''}
                                ${log.step === 'Action' ? 'text-orange-400' : ''}
                                ${log.step === 'Observation' ? 'text-blue-400' : ''}
                                ${log.step === 'Success' ? 'text-green-400' : ''}
                                ${log.step === 'Error' ? 'text-red-400' : ''}
                            `}>
                                {log.step}
                                <span className="h-[1px] flex-1 bg-white/10"></span>
                            </span>
                            <p className="text-slate-300 leading-relaxed text-xs opacity-90">{log.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}