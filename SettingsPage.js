function SettingsPage({ user, onUpdateUser }) {
    const [saving, setSaving] = React.useState(false);
    const [msg, setMsg] = React.useState('');
    const [apiKey, setApiKey] = React.useState(user.api_key || '');

    // Simulated settings
    const [notifications, setNotifications] = React.useState(true);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Update user in DB
            const updatedUser = await updateUserProfile(user.id, {
                api_key: apiKey
            });
            
            // Update local state
            onUpdateUser(updatedUser);
            
            setMsg('Settings saved successfully');
            setTimeout(() => setMsg(''), 3000);
        } catch (e) {
            setMsg('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <div className="icon-settings text-xl"></div>
                </div>
                System Configuration
            </h2>

            <div className="space-y-6">
                
                {/* Account */}
                <div className="card-glass p-6">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">Account</h3>
                    <div className="flex items-center gap-4 mb-6">
                         <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg uppercase">
                            {user.name ? user.name.substring(0, 2) : 'U'}
                        </div>
                        <div>
                            <div className="text-lg font-bold text-white">{user.name}</div>
                            <div className="text-sm text-slate-400">{user.email}</div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-medium">Pro Plan</span>
                                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 font-medium">AI Enabled</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Configuration */}
                <div className="card-glass p-6">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">AI Engine Status</h3>
                    
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gemini API Key</label>
                        <div className="flex gap-2">
                            <input 
                                type="password" 
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="input-glass"
                                placeholder="Paste your Gemini API Key here"
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2">
                            Your key is used to power the GELEYA Agent. It is stored securely in your private workspace.
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <div className="icon-cpu text-green-400"></div>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Agent Status</div>
                                <div className="text-xs text-slate-400">{apiKey ? 'Connected to Gemini Network' : 'Running in Offline/Fallback Mode'}</div>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${apiKey ? 'text-green-400' : 'text-yellow-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                            {apiKey ? 'Operational' : 'Key Required'}
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div className="card-glass p-6">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">Preferences</h3>
                    <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-slate-200">Email Notifications</div>
                                <div className="text-xs text-slate-500">Receive weekly analysis reports</div>
                            </div>
                            <div 
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifications ? 'bg-indigo-600' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${notifications ? 'right-1' : 'left-1'}`}></div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div></div>
                            <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                        {msg && <div className="text-center text-xs text-emerald-400 mt-2">{msg}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}