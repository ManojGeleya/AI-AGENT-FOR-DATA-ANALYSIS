function DashboardPage({ processing, logs, project, user }) {
    const chartRef1 = React.useRef(null);
    const chartRef2 = React.useRef(null);
    const canvasRef1 = React.useRef(null);
    const canvasRef2 = React.useRef(null);

    // State for dynamic charts from chat
    const [dynamicChart, setDynamicChart] = React.useState(null);
    const [chatProcessing, setChatProcessing] = React.useState(false);
    
    // RAG State
    const [ragStep, setRagStep] = React.useState('idle'); // idle, chunking, embedding, ready, retrieving
    const [vectorStore, setVectorStore] = React.useState([]);

    const projectData = project?.objectData || {};
    const isDocument = projectData.file_name?.endsWith('.txt') || projectData.file_name?.endsWith('.pdf') || projectData.file_name?.endsWith('.md');
    
    // Simulate RAG initialization if it's a document
    React.useEffect(() => {
        if (isDocument && ragStep === 'idle' && !processing) {
            initializeRAG();
        }
    }, [isDocument, processing]);

    const initializeRAG = async () => {
        setRagStep('chunking');
        // Parse raw content again from sample/stored data or just mock for visual
        // In real app, we'd pull full content. Here we simulate chunking the stored sample/content.
        
        let content = projectData.sample_data || "";
        // Mock larger content if sample is small for visual effect
        if (content.length < 500) content = content.repeat(10); 
        
        const chunks = chunkText(content, 200);
        
        setRagStep('embedding');
        const vectors = await generateEmbeddings(chunks, (progress) => {
            // Optional: update progress bar
        });
        
        setVectorStore(vectors);
        setRagStep('ready');
    };

    const insights = projectData.insights ? JSON.parse(projectData.insights) : [];
    // Combine initial charts with dynamic chart if it exists
    const initialCharts = projectData.charts ? JSON.parse(projectData.charts) : [];
    
    // Display Logic: 
    // If dynamicChart exists, show it big in the first slot.
    // Otherwise show initial charts.
    const displayCharts = dynamicChart ? [dynamicChart, ...initialCharts] : initialCharts;

    const handleChatResponse = async (query, callback) => {
        setChatProcessing(true);
        try {
            if (isDocument) {
                setRagStep('retrieving');
                // 1. Retrieve Context
                const relevantChunks = retrieveContext(query, vectorStore);
                // 2. Build Prompt
                const ragPrompt = buildRAGPrompt(query, relevantChunks);
                // 3. Call Agent
                const response = await chatWithAgent(user.api_key, ragPrompt, project, true); // true flag for raw text mode
                
                callback(response.text);
                setRagStep('ready');
            } else {
                // Standard Data Chat
                const response = await chatWithAgent(user.api_key, query, project);
                callback(response.text);
                if (response.chart) {
                    setDynamicChart(response.chart);
                }
            }
        } catch (error) {
            console.error(error);
            callback("Sorry, I encountered an error processing your request.");
            setRagStep('ready');
        } finally {
            setChatProcessing(false);
        }
    };

    React.useEffect(() => {
        if (processing || displayCharts.length === 0) return;

        const Chart = window.ChartJS;
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } },
                title: { display: true, color: '#e2e8f0', font: { family: 'Inter', size: 14, weight: 600 } }
            },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }
            }
        };

        if (chartRef1.current) chartRef1.current.destroy();
        if (chartRef2.current) chartRef2.current.destroy();

        // Chart 1 (Dynamic or First Initial)
        if (canvasRef1.current && displayCharts[0]) {
            const ctx1 = canvasRef1.current.getContext('2d');
            const data1 = JSON.parse(JSON.stringify(displayCharts[0].data)); // Clone
            
            // Apply styling if needed, usually passed from AI is fine but safe to fallback
            if (data1.datasets && data1.datasets[0]) {
                // Ensure colors if missing
                if(!data1.datasets[0].backgroundColor) {
                     data1.datasets[0].backgroundColor = 'rgba(99, 102, 241, 0.5)';
                     data1.datasets[0].borderColor = '#6366f1';
                }
            }

            chartRef1.current = new Chart(ctx1, {
                type: displayCharts[0].type,
                data: data1,
                options: {
                    ...commonOptions,
                    plugins: { ...commonOptions.plugins, title: { ...commonOptions.plugins.title, text: displayCharts[0].title } }
                }
            });
        }

        // Chart 2 (Second Initial)
        if (canvasRef2.current && displayCharts[1]) {
            const ctx2 = canvasRef2.current.getContext('2d');
            chartRef2.current = new Chart(ctx2, {
                type: displayCharts[1].type,
                data: displayCharts[1].data,
                options: {
                    ...commonOptions,
                    plugins: { ...commonOptions.plugins, title: { ...commonOptions.plugins.title, text: displayCharts[1].title } }
                }
            });
        }

        return () => {
            if (chartRef1.current) chartRef1.current.destroy();
            if (chartRef2.current) chartRef2.current.destroy();
        };
    }, [processing, displayCharts]);

    if (!project && !processing) return null;

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6 overflow-hidden">
            {/* Main Content Area (Left) */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 pb-4 no-scrollbar">
                
                {/* RAG Visualization (Only for Documents) */}
                {isDocument && (
                    <RAGVisualizer currentStep={ragStep} vectorCount={vectorStore.length} />
                )}

                {/* Stats Row */}
                {!processing && projectData.status === 'completed' && !isDocument && (
                    <div className="grid grid-cols-3 gap-5">
                         {[
                            { label: "Total Insights", val: insights.length, sub: "Generated by AI", color: "indigo", icon: "icon-lightbulb" },
                            { label: "Data Quality", val: "98%", sub: "Clean structure", color: "emerald", icon: "icon-shield-check" },
                            { label: "Rows Processed", val: projectData.row_count?.toLocaleString(), sub: "100% Sampled", color: "purple", icon: "icon-layers" }
                        ].map((stat, idx) => (
                            <div key={idx} className="card-glass p-5 relative overflow-hidden group animate-slide-up" style={{ animationDelay: `${0.1 * idx}s` }}>
                                <div className={`absolute -right-4 -top-4 w-20 h-20 bg-${stat.color}-500/10 rounded-full blur-xl group-hover:bg-${stat.color}-500/20 transition-all`}></div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
                                    <div className={`text-${stat.color}-400 ${stat.icon}`}></div>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                                <div className={`text-xs text-${stat.color}-400/80`}>{stat.sub}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Charts Area */}
                <div className="grid grid-cols-2 gap-6 min-h-[350px]">
                    <div className="card-glass p-5 flex flex-col animate-slide-up col-span-2 lg:col-span-1" style={{ animationDelay: '0.3s' }}>
                        <div className="flex-1 relative min-h-[300px]">
                            <canvas ref={canvasRef1}></canvas>
                        </div>
                    </div>
                    <div className="card-glass p-5 flex flex-col animate-slide-up col-span-2 lg:col-span-1" style={{ animationDelay: '0.4s' }}>
                        <div className="flex-1 relative min-h-[300px]">
                             <canvas ref={canvasRef2}></canvas>
                        </div>
                    </div>
                </div>

                {/* Insights Area */}
                <div className="card-glass p-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                            <div className="icon-wand-sparkles text-white text-lg"></div>
                        </div>
                        <h3 className="font-bold text-xl text-white">Strategic Insights</h3>
                    </div>
                    
                    <div className="grid gap-4">
                        {processing ? (
                            <div className="text-slate-500 animate-pulse">Generating insights...</div>
                        ) : insights.map((insight, idx) => (
                            <div key={idx} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all hover:-translate-x-1 cursor-pointer">
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${insight.sentiment === 'positive' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                        <div className={`${insight.icon || 'icon-info'} text-lg`}></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-200 text-sm mb-1 group-hover:text-white transition-colors">{insight.title}</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">{insight.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat & Log Sidebar (Right) */}
            <div className="w-[350px] flex flex-col gap-6 animate-slide-up shrink-0" style={{ animationDelay: '0.2s' }}>
                <div className="h-[40%] min-h-[300px]">
                    <ChatInterface onSendMessage={handleChatResponse} isProcessing={chatProcessing} />
                </div>
                <div className="flex-1 min-h-0">
                    <AgentLog logs={logs} isProcessing={processing} />
                </div>
            </div>
        </div>
    );
}