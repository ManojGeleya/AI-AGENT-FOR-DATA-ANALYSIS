function ChatInterface({ onSendMessage, isProcessing }) {
    const [messages, setMessages] = React.useState([
        { role: 'ai', content: "Hello! I'm GELEYA. You can ask me to analyze specific trends, generate new charts, or explain the data." }
    ]);
    const [input, setInput] = React.useState('');
    const scrollRef = React.useRef(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (textToSend = null) => {
        const text = typeof textToSend === 'string' ? textToSend : input;
        if (!text.trim() || isProcessing) return;
        
        const userMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        onSendMessage(text, (response) => {
            setMessages(prev => [...prev, { role: 'ai', content: response }]);
        });
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestions = [
        "Show me the trend of sales over time",
        "Identify top 5 performing regions",
        "Are there any outliers in profit?",
        "Correlate age with spending score"
    ];

    return (
        <div className="flex flex-col h-full card-glass overflow-hidden border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 animate-pulse-glow">
                        <div className="icon-message-square-text"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">AI Analyst</h3>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-yellow-400 animate-ping' : 'bg-green-400'}`}></div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{isProcessing ? 'Thinking...' : 'Online'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                        <div className={`
                            max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-lg
                            ${msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                                : 'bg-slate-800/80 border border-white/5 text-slate-200 rounded-tl-sm backdrop-blur-sm'
                            }
                        `}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isProcessing && (
                    <div className="flex justify-start animate-slide-up">
                         <div className="bg-slate-800/80 border border-white/5 rounded-2xl rounded-tl-sm p-3 flex gap-1.5 items-center">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                         </div>
                    </div>
                )}
            </div>

            {/* Suggestions (only show if few messages) */}
            {messages.length < 3 && (
                <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                    {suggestions.map((s, i) => (
                        <button 
                            key={i}
                            onClick={() => handleSend(s)}
                            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/10 text-xs text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all active:scale-95"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-slate-900/50 border-t border-white/5 backdrop-blur-md">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about your data..."
                        disabled={isProcessing}
                        className="w-full pl-4 pr-12 py-3 bg-slate-950/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 placeholder-slate-500 transition-all group-hover:border-slate-600"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isProcessing}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                    >
                        <div className="icon-arrow-up text-lg"></div>
                    </button>
                </div>
            </div>
        </div>
    );
}