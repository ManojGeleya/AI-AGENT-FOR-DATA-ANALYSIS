function RegisterPage({ onLogin, onNavigateLogin }) {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        apiKey: ''
    });
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simple validation
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            const user = await registerUser(formData.email, formData.password, formData.name, formData.apiKey);
            onLogin(user);
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-color)' }}>
            <Background3D />
            
            <div className="relative z-10 w-full max-w-md p-8 card-glass border border-white/10 animate-slide-up">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-slate-400 text-sm">Start your autonomous data journey</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                        <div className="icon-circle-alert"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="input-glass"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="input-glass"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="input-glass"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Gemini API Key (Optional)</label>
                        <input
                            type="text"
                            className="input-glass"
                            placeholder="AIzaSy..."
                            value={formData.apiKey}
                            onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Required for GELEYA Agents to function properly.</p>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn btn-primary py-3 text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Already have an account? 
                    <button onClick={onNavigateLogin} className="text-indigo-400 font-bold ml-1 hover:underline">
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}