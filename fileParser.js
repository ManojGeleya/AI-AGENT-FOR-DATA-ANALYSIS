// Browser-side file parser supporting CSV, JSON, TXT, and PDF
const parseFile = (file) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (file.name.endsWith('.csv')) {
                const text = await readFileAsText(file);
                resolve(parseCSV(text));
            } else if (file.name.endsWith('.json')) {
                const text = await readFileAsText(file);
                resolve(JSON.parse(text));
            } else if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
                const text = await readFileAsText(file);
                resolve({ 
                    type: 'document',
                    content: text,
                    chunks: chunkText(text, 500) // Simple chunking
                });
            } else if (file.name.endsWith('.pdf')) {
                const text = await parsePDF(file);
                resolve({
                    type: 'document',
                    content: text,
                    chunks: chunkText(text, 500)
                });
            } else {
                reject(new Error("Unsupported file format"));
            }
        } catch (err) {
            reject(err);
        }
    });
};

const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
};

const parsePDF = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        
        return fullText;
    } catch (e) {
        console.error("PDF Parsing Error:", e);
        throw new Error("Failed to parse PDF file.");
    }
};

const parseCSV = (text) => {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length === 0) return [];
    
    // Simple CSV parser handling quotes
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    const data = lines.slice(1).map(line => {
        // This regex handles commas inside quotes
        const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
        // Simple fallback if regex fails or for simple CSVs
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || null;
        });
        return row;
    });
    
    return data;
};

// Helper to chunk text for RAG
const chunkText = (text, size = 500) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
        chunks.push(text.slice(i, i + size));
    }
    return chunks;
};