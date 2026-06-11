function RAGVisualizer({ currentStep, vectorCount }) {
    // Steps: 'idle', 'chunking', 'embedding', 'ready', 'retrieving'
    
    const steps = [
        { id: 'data', label: 'Raw Data', icon: 'icon-file-text', color: 'slate' },
        { id: 'chunking', label: 'Chunking', icon: 'icon-scissors', color: 'blue' },
        { id: 'embedding', label: 'Embeddings', icon: 'icon-cpu', color: 'purple' },
        { id: 'vector_db', label: 'Vector DB', icon: 'icon-database', color: 'emerald' }
    ];

    const getStatusColor = (stepIdx) => {
        const currentIdx = steps.findIndex(s => s.id === currentStep);
        if (currentStep === 'ready' || currentStep === 'retrieving') return 'text-green-400 bg-green-500/10 border-green-500/50';
        if (stepIdx < currentIdx) return 'text-green-400 bg-green-500/10 border-green-500/20'; // Completed
        if (stepIdx === currentIdx) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/50 animate-pulse-glow'; // Active
        return 'text-slate-600 bg-slate-800/50 border-white/5'; // Pending
    };

    return (
        <div className="card-glass p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="icon-network text-indigo-400"></div>
                    RAG Pipeline Status
                </h3>
                {vectorCount > 0 && (
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        {vectorCount} Vectors Indexed
                    </span>
                )}
            </div>

            <div className="relative flex items-center justify-between px-4 py-8">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 transform -translate-y-1/2"></div>
                <div 
                    className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 -z-10 transform -translate-y-1/2 transition-all duration-1000"
                    style={{ 
                        width: currentStep === 'idle' ? '0%' : 
                               currentStep === 'chunking' ? '33%' : 
                               currentStep === 'embedding' ? '66%' : '100%' 
                    }}
                ></div>

                {steps.map((step, idx) => (
                    <div key={step.id} className="flex flex-col items-center gap-3 relative z-10 group">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${getStatusColor(idx)}`}>
                            <div className={`${step.icon} text-xl`}></div>
                        </div>
                        <div className="text-xs font-medium text-slate-400 bg-slate-900/80 px-2 py-1 rounded backdrop-blur-sm border border-white/5">
                            {step.label}
                        </div>
                        
                        {/* Tooltip for flow explanation */}
                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[10px] p-2 rounded w-32 text-center pointer-events-none border border-white/10">
                            {step.id === 'embedding' ? 'Converting text to vector representations' : 
                             step.id === 'vector_db' ? 'Storing vectors for semantic search' : step.label}
                        </div>
                    </div>
                ))}
            </div>
            
            {currentStep === 'retrieving' && (
                <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center gap-3 animate-slide-up">
                    <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-indigo-300">Retrieving relevant context from Vector DB...</span>
                </div>
            )}
        </div>
    );
}