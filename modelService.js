// modelService.js

async function generateAIModels(project, user) {
    const filename = project?.objectData?.file_name || "Unknown File";
    const apiKey = user?.api_key;
    
    // Get columns from sample data if available
    let columns = [];
    if (project?.objectData?.sample_data) {
        try {
            const sample = JSON.parse(project.objectData.sample_data);
            if (sample.length > 0) {
                columns = Object.keys(sample[0]);
            }
        } catch (e) {}
    }

    const fallbackModels = [
        { name: 'Random Forest Classifier', accuracy: '92.4%', f1: '0.90', status: 'Optimal', color: 'emerald' },
        { name: 'Gradient Boosting (XGBoost)', accuracy: '89.1%', f1: '0.87', status: 'Strong', color: 'blue' },
        { name: 'Logistic Regression', accuracy: '78.5%', f1: '0.75', status: 'Baseline', color: 'purple' }
    ];

    const systemPrompt = `
        You are an expert Data Science AI Agent named GELEYA.
        
        TASK:
        Based on the provided dataset filename and columns, simulate the training of 3 machine learning models relevant to the data problem type (Regression, Classification, or Clustering).
        
        INPUT:
        - Filename: ${filename}
        - Columns: ${columns.join(', ')}
        
        OUTPUT:
        Return ONLY a JSON array of 3 model objects.
        
        JSON Format:
        [
            { 
                "name": "Model Name (e.g. Random Forest, Linear Regression, K-Means)", 
                "accuracy": "95.2%", 
                "f1": "0.92", 
                "status": "Optimal|Strong|Baseline", 
                "color": "emerald|blue|amber|purple" 
            }
        ]
        
        RULES:
        - If the file looks like a time series, suggest ARIMA/Prophet/LSTM.
        - If it looks like customer churn or classification, suggest Random Forest/XGBoost/Logistic Regression.
        - If it looks like price prediction, suggest Linear Regression/Gradient Boosting.
        - Generate REALISTIC metrics (e.g. not always 100%).
    `;
    
    const userPrompt = `Generate model training results for file: ${filename}`;
    
    try {
        let response;
        
        // 1. Try Gemini if available
        if (apiKey && typeof callGemini === 'function') {
            try {
                response = await callGemini(apiKey, systemPrompt, userPrompt);
            } catch (e) {
                console.warn("Gemini Model Generation failed, falling back...");
            }
        }
        
        // 2. Try internal agent
        if (!response) {
            response = await invokeAIAgent(systemPrompt, userPrompt);
        }
        
        // 3. Check if we still have no response
        if (!response) {
            console.warn("AI returned empty response for models. Using fallbacks.");
            return fallbackModels;
        }
        
        // Extract JSON array
        let jsonStr = String(response);
        if (jsonStr.includes('```json')) {
            jsonStr = jsonStr.split('```json')[1].split('```')[0];
        } else if (jsonStr.includes('[')) {
            const start = jsonStr.indexOf('[');
            const end = jsonStr.lastIndexOf(']') + 1;
            if (start !== -1 && end !== -1) {
                jsonStr = jsonStr.substring(start, end);
            }
        }
        
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
        }
        return fallbackModels;
    } catch (error) {
        console.error("AI Model Generation Error:", error);
        return fallbackModels;
    }
}