function UploadPage({ onUploadStart }) {
    const [isDragging, setIsDragging] = React.useState(false);
    const [hovering, setHovering] = React.useState(false);
    const [parsing, setParsing] = React.useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await processFile(files[0]);
        }
    };

    const handleFileSelect = async (e) => {
        if (e.target.files.length > 0) {
            await processFile(e.target.files[0]);
        }
    };

    const processFile = async (file) => {
        setParsing(true);
        try {
            // Use the global parseFile function we just added
            const data = await parseFile(file);
            // Pass both file object and parsed data
            onUploadStart(file, data);
        } catch (error) {
            console.error("File parsing error:", error);
            alert("Error parsing file. Please check the format.");
        } finally {
            setParsing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pt-8 perspective-1000">
            {/* Hero Section with Float Animation */}
            <div className="text-center mb-16 animate-slide-up">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6 backdrop-blur-md animate-float">
                    <div className="icon-sparkles text-indigo-400 mr-2"></div>
                    <span className="text-indigo-300 font-medium text-sm">Powered by GELEYA LLM Engine</span>
                </div>
                
                <h2 className="text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
                    Data Intelligence, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Reimagined</span>
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Upload your raw data and watch as GELEYA orchestrates the entire analysis pipeline—from cleaning to strategic insights.
                </p>
            </div>

            {/* 3D Upload Card */}
            <div 
                className={`
                    relative group
                    border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-500
                    flex flex-col items-center justify-center min-h-[400px] cursor-pointer
                    backdrop-blur-xl animate-slide-up
                    ${isDragging 
                        ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02] shadow-[0_0_50px_rgba(99,102,241,0.3)]' 
                        : 'border-slate-700 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-slate-800/60'
                    }
                `}
                style={{ animationDelay: '0.1s', transformStyle: 'preserve-3d' }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !parsing && document.getElementById('fileInput').click()}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
            >
                {/* Floating Elements in Background */}
                <div className={`absolute top-10 left-10 w-20 h-20 rounded-full bg-purple-500/10 blur-2xl transition-all duration-1000 ${hovering ? 'translate-x-5 translate-y-5 opacity-80' : 'opacity-40'}`}></div>
                <div className={`absolute bottom-10 right-10 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-1000 ${hovering ? '-translate-x-5 -translate-y-5 opacity-80' : 'opacity-40'}`}></div>

                {/* Content with 3D Pop Effect */}
                <div className="relative z-10 transform transition-transform duration-500 group-hover:translate-z-10 group-hover:scale-105">
                    {parsing ? (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <h3 className="text-xl font-bold text-white">Parsing Data...</h3>
                            <p className="text-slate-400 mt-2">Reading file structure</p>
                        </div>
                    ) : (
                        <>
                            <div className={`
                                w-24 h-24 rounded-3xl flex items-center justify-center mb-8 mx-auto
                                bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl border border-white/5
                                group-hover:shadow-indigo-500/20 transition-all duration-500
                            `}>
                                <div className="icon-cloud-upload text-5xl text-indigo-500 group-hover:text-indigo-400 drop-shadow-lg"></div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {isDragging ? 'Drop to Initialize' : 'Upload Dataset'}
                            </h3>
                            <p className="text-slate-400 mb-10 max-w-sm mx-auto">
                                Support for <span className="text-slate-300 font-semibold">TXT, PDF, CSV, JSON</span>. 
                                <br/>Max file size 50MB.
                            </p>
                            
                            <button className="btn btn-primary px-10 py-4 rounded-2xl text-lg shadow-xl shadow-indigo-900/20 group-hover:shadow-indigo-500/40 border border-white/10">
                                Select Documents or Data
                            </button>
                        </>
                    )}
                </div>

                <input 
                    type="file" 
                    id="fileInput" 
                    className="hidden" 
                    accept=".csv,.json,.txt,.md,.pdf"
                    onChange={handleFileSelect}
                    disabled={parsing}
                />
            </div>

            {/* Feature Cards with 3D Hover */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pb-10">
                {[
                    { title: "Auto-Cleaning", desc: "Intelligent null value imputation and outlier detection.", icon: "icon-sparkles", color: "text-purple-400", bg: "bg-purple-500/10" },
                    { title: "Smart Viz", desc: "Context-aware chart generation based on data distribution.", icon: "icon-chart-pie", color: "text-blue-400", bg: "bg-blue-500/10" },
                    { title: "Deep Insights", desc: "LLM-powered strategic analysis and reporting.", icon: "icon-brain", color: "text-emerald-400", bg: "bg-emerald-500/10" }
                ].map((feature, idx) => (
                    <div 
                        key={idx} 
                        className="card-3d p-8 text-center group animate-slide-up"
                        style={{ animationDelay: `${0.2 + (idx * 0.1)}s` }}
                    >
                        <div className={`w-14 h-14 mx-auto rounded-2xl ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                            <div className={`${feature.icon} text-2xl ${feature.color}`}></div>
                        </div>
                        <h4 className="font-bold text-lg text-slate-100 mb-3">{feature.title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}