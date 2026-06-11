function DataPage({ project }) {
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        if (project && project.objectData) {
            try {
                // If we have real sample data, use it
                if (project.objectData.sample_data) {
                    const parsed = JSON.parse(project.objectData.sample_data);
                    setData(parsed);
                } else {
                    setData([]);
                }
            } catch (e) {
                console.error("Error parsing sample data", e);
                setData([]);
            }
        }
    }, [project]);

    const handleExport = () => {
        if (data.length === 0) return;
        
        // Simple CSV Export
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `geleta_export_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!project) {
         return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-slide-up">
                <div className="icon-database text-4xl mb-4 text-slate-600"></div>
                <p>No dataset loaded. Please start a new analysis.</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col gap-6 animate-slide-up">
            {/* Toolbar */}
            <div className="flex justify-between items-center p-4 card-glass">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <div className="icon-table text-indigo-400"></div>
                        Data Preview
                    </h2>
                    <span className="text-xs px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {project.objectData.row_count?.toLocaleString()} Rows
                    </span>
                    <span className="text-xs text-slate-500">
                        (Showing first {data.length} rows)
                    </span>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-glass text-xs px-3 py-1.5 flex items-center gap-2 hover:bg-white/20 active:scale-95 transition-all">
                        <div className="icon-list-filter text-sm"></div> Filter
                    </button>
                    <button 
                        onClick={handleExport}
                        className="btn btn-glass text-xs px-3 py-1.5 flex items-center gap-2 hover:bg-white/20 active:scale-95 transition-all"
                    >
                        <div className="icon-download text-sm"></div> Export CSV
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-hidden card-glass p-0">
                <div className="h-full overflow-auto">
                    {data.length > 0 ? (
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-900/50 text-slate-200 uppercase text-xs font-bold sticky top-0 backdrop-blur-md z-10">
                                <tr>
                                    {Object.keys(data[0]).map((key) => (
                                        <th key={key} className="px-6 py-4 border-b border-white/5 whitespace-nowrap bg-slate-900/80">
                                            {key.replace(/_/g, ' ')}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        {Object.values(row).map((val, vIdx) => (
                                            <td key={vIdx} className="px-6 py-3 whitespace-nowrap font-mono text-xs">
                                                {val === null ? <span className="text-slate-600">null</span> : String(val).substring(0, 50)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            No data available to display.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}