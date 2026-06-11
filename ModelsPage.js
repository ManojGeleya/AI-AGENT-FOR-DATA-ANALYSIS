function ModelsPage({ project, user }) {
    const [training, setTraining] = React.useState(false);
    const [models, setModels] = React.useState([]);

    React.useEffect(() => {
        if (project && project.objectData.models_data) {
            try {
                const parsed = JSON.parse(project.objectData.models_data);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setModels(parsed);
                } else {
                    // Default/Initial state if no models yet
                    setModels([]);
                }
            } catch (e) {
                console.error("Failed to parse models data", e);
            }
        }
    }, [project]);

    const handleTrain = async () => {
        setTraining(true);
        try {
            // Use LLM to generate realistic context-aware models
            const newModels = await generateAIModels(project, user);

            setModels(newModels);
            
            // Save to DB
            if (project) {
                await updateProjectModels(project.objectId, newModels);
            }

        } catch (error) {
            console.error("Training error:", error);
        } finally {
            setTraining(false);
        }
    };

    if (!project) {
        return (
           <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-slide-up">
               <div className="icon-brain text-4xl mb-4 text-slate-600"></div>
               <p>No active project. Please upload data to train models.</p>
           </div>
       );
   }

   return (
       <div className="h-full overflow-y-auto no-scrollbar animate-slide-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                        <div className="icon-brain text-xl"></div>
                    </div>
                    Predictive Models
                </h2>
                <button 
                    onClick={handleTrain} 
                    disabled={training}
                    className="btn btn-primary flex items-center gap-2"
                >
                    {training ? (
                        <>
                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                            Training with GELEYA...
                        </>
                    ) : (
                        <>
                            <div className="icon-play text-sm"></div>
                            Train New Models
                        </>
                    )}
                </button>
            </div>

            {models.length === 0 && !training && (
                 <div className="text-center py-20 card-glass border-dashed">
                    <div className="icon-cpu text-4xl text-slate-600 mb-4 mx-auto"></div>
                    <h3 className="text-slate-300 font-bold mb-2">No Models Trained Yet</h3>
                    <p className="text-slate-500 text-sm">Click the button above to let GELEYA train optimal models on your dataset.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Models */}
                {models.length > 0 && (
                    <div className="col-span-1 lg:col-span-2 grid gap-4">
                        {models.map((model, idx) => (
                            <div key={idx} className="card-glass p-6 flex items-center justify-between group hover:border-indigo-500/30 transition-all animate-slide-up">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-${model.color}-500/10 flex items-center justify-center text-${model.color}-400 group-hover:scale-110 transition-transform`}>
                                        <div className="icon-cpu text-2xl"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{model.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-${model.color}-500/10 text-${model.color}-400 border border-${model.color}-500/20`}>
                                                {model.status}
                                            </span>
                                            <span className="text-xs text-slate-500">Just now</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Accuracy</div>
                                        <div className="text-xl font-bold text-white">{model.accuracy}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">F1 Score</div>
                                        <div className="text-xl font-bold text-white">{model.f1}</div>
                                    </div>
                                    <button className="btn btn-glass p-2 rounded-lg hover:bg-indigo-500/20 hover:text-indigo-400">
                                        <div className="icon-chevron-right text-lg"></div>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
       </div>
   );
}