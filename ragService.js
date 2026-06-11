// ragService.js - Handles RAG pipeline logic (Embeddings, Vector Store, Retrieval)

/**
 * Simulates the creation of embeddings for text chunks.
 * In a real backend, this would call an embedding API (e.g., text-embedding-004).
 */
async function generateEmbeddings(chunks, onProgress) {
    const vectors = [];
    const total = chunks.length;
    
    for (let i = 0; i < total; i++) {
        // Simulate processing delay
        await new Promise(r => setTimeout(r, 50));
        
        // Mock vector (random numbers for visualization)
        // In real RAG, this is `await getEmbedding(chunks[i])`
        const vector = Array.from({length: 5}, () => Math.random()); 
        
        vectors.push({
            id: `vec_${i}`,
            text: chunks[i],
            vector: vector
        });
        
        if (onProgress) onProgress(Math.round(((i + 1) / total) * 100));
    }
    
    return vectors;
}

/**
 * Retrieves the most relevant chunks for a given query.
 * Uses simple text overlap for this demo since we don't have a real vector DB.
 */
function retrieveContext(query, vectorStore) {
    if (!vectorStore || vectorStore.length === 0) return [];
    
    const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
    
    const scored = vectorStore.map(item => {
        let score = 0;
        const textLower = item.text.toLowerCase();
        
        // 1. Keyword match score
        keywords.forEach(kw => {
            if (textLower.includes(kw)) score += 5;
        });
        
        // 2. Random "semantic" noise for simulation effect
        score += Math.random() * 2;
        
        return { ...item, score };
    });
    
    // Sort by score and take top 3
    return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

/**
 * Constructs the RAG prompt for the LLM
 */
function buildRAGPrompt(query, contextChunks) {
    const contextText = contextChunks.map(c => c.text).join('\n---\n');
    
    return `
        You are an intelligent RAG assistant. Use the following context to answer the user's question.
        
        CONTEXT:
        ${contextText}
        
        QUESTION:
        ${query}
        
        ANSWER:
        (If the answer is not in the context, say "I couldn't find that information in the document" but try to be helpful.)
    `;
}