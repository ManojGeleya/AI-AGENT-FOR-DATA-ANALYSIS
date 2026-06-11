// Important: DO NOT remove this `ErrorBoundary` component.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [user, setUser] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState('upload');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [currentProject, setCurrentProject] = React.useState(null);
  const [agentLogs, setAgentLogs] = React.useState([]);

  // Auth State Management
  React.useEffect(() => {
      const storedUser = localStorage.getItem('datamind_user');
      if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            localStorage.removeItem('datamind_user');
          }
      }
  }, []);

  const handleLogin = (userData) => {
      setUser(userData);
      localStorage.setItem('datamind_user', JSON.stringify(userData));
      setCurrentPage('upload');
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('datamind_user');
      setCurrentProject(null);
  };

  const addLog = (step, content) => {
      setAgentLogs(prev => [...prev, { step, content }]);
  };

  const startAnalysis = async (file, parsedData) => {
    if (!user) return;
    
    try {
        setCurrentPage('dashboard');
        setIsProcessing(true);
        setAgentLogs([]);
        setCurrentProject(null);

        addLog('Thought', `Received "${file.name}". Initializing secure workspace...`);
        
        // Determine Data Type
        const isDoc = parsedData.type === 'document';
        let rowCount = 0;
        let colCount = 0;
        let columns = [];
        let sampleSnippet = [];
        let rawContent = "";

        if (isDoc) {
            // Document Mode (PDF/TXT)
            rawContent = parsedData.content;
            rowCount = 1; // 1 document
            colCount = 1; // Text content
            columns = ['content'];
            // Store a chunk as sample
            sampleSnippet = rawContent.substring(0, 2000); 
            addLog('Action', `Document parsed. Length: ${rawContent.length} characters.`);
        } else {
            // Tabular Mode (CSV/JSON)
            rowCount = parsedData.length;
            if (rowCount > 0) {
                columns = Object.keys(parsedData[0]);
                colCount = columns.length;
                sampleSnippet = parsedData.slice(0, 100);
            }
            addLog('Action', `Dataset parsed. Found ${rowCount} rows and ${colCount} columns.`);
        }

        // Create Project in DB
        const metaData = { rows: rowCount, cols: colCount };
        // We persist the raw content for docs so RAG can access it later
        // For tabular, we persist the JSON snippet
        const storageData = isDoc ? rawContent : sampleSnippet;
        
        const newProject = await createProject(file, metaData, user.id, storageData);
        
        // Initialize State
        setCurrentProject({
             ...newProject,
             objectData: {
                 ...newProject.objectData,
                 sample_data: isDoc ? rawContent : JSON.stringify(sampleSnippet)
             }
        });

        addLog('Observation', `Workspace created (ID: ${newProject.objectId.substring(0,8)}...).`);
        
        // Simulation Delays for UX
        await new Promise(r => setTimeout(r, 800));
        
        if (isDoc) {
            addLog('Thought', 'Document detected. Initializing RAG pipeline (Chunking & Embedding)...');
            await new Promise(r => setTimeout(r, 1000));
            addLog('Action', 'Vectorizing content for semantic retrieval...');
        } else {
            addLog('Thought', 'Scanning for missing values and outliers...');
            await new Promise(r => setTimeout(r, 800));
        }
        
        // AI Analysis
        addLog('Thought', 'Engaging GELEYA LLM Engine for strategic analysis...');
        
        // Call Internal AI
        // For docs, we pass a summary/snippet to get general insights
        const aiAnalysisData = isDoc ? [{ text: sampleSnippet.substring(0, 1000) }] : sampleSnippet;
        const aiResults = await performAIAnalysis(user.api_key, file.name, columns, aiAnalysisData);
        
        addLog('Observation', `Analysis complete. Generated ${aiResults.insights.length} insights.`);

        // Update DB with Results
        const updatedProject = await updateProjectResults(newProject.objectId, aiResults.insights, aiResults.charts);
        
        // Update Local State
        setCurrentProject({
            ...updatedProject,
            objectData: {
                ...updatedProject.objectData,
                status: 'completed',
                insights: JSON.stringify(aiResults.insights),
                charts: JSON.stringify(aiResults.charts),
                // Ensure we keep the sample/content data available
                sample_data: isDoc ? rawContent : JSON.stringify(sampleSnippet)
            }
        });

        addLog('Success', 'Pipeline finished. Dashboard is live.');

    } catch (error) {
        console.error("Analysis Loop Error:", error);
        addLog('Error', `Pipeline interrupted: ${error.message}`);
    } finally {
        setIsProcessing(false);
    }
  };

  const renderContent = () => {
    switch(currentPage) {
        case 'upload':
            return <UploadPage onUploadStart={startAnalysis} />;
        case 'dashboard':
            return (
                <DashboardPage 
                    processing={isProcessing} 
                    logs={agentLogs} 
                    project={currentProject} 
                    user={user}
                />
            );
        case 'data':
            return <DataPage project={currentProject} />;
        case 'models':
            return <ModelsPage project={currentProject} user={user} />;
        case 'settings':
            return <SettingsPage user={user} onUpdateUser={handleLogin} />;
        default:
            return <div>Page not found</div>;
    }
  };

  const getPageTitle = () => {
      switch(currentPage) {
          case 'upload': return 'New Analysis';
          case 'dashboard': return 'Analysis Dashboard';
          case 'data': return 'Data Preview';
          case 'models': return 'Model Registry';
          case 'settings': return 'System Settings';
          default: return 'Page';
      }
  };

  // Auth Routing
  if (!user) {
      if (currentPage === 'register') {
          return <RegisterPage onLogin={handleLogin} onNavigateLogin={() => setCurrentPage('login')} />;
      }
      return <LoginPage onLogin={handleLogin} onNavigateRegister={() => setCurrentPage('register')} />;
  }

  return (
    <div className="flex bg-[var(--bg-color)] min-h-screen relative" data-name="app" data-file="app.js">
        {/* Immersive Background */}
        <Background3D />
        
        <Sidebar 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            user={user}
            onLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col ml-[var(--sidebar-width)] relative z-10">
            <Header title={getPageTitle()} />
            <main className="flex-1 mt-[var(--header-height)] p-8 overflow-hidden h-[calc(100vh-var(--header-height))]">
                {renderContent()}
            </main>
        </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);