// dbService.js - Abstraction for Trickle Database interactions

const TABLE_NAME = 'analysis_project';

/**
 * Creates a new analysis project in the database
 */
async function createProject(file, metaData, ownerId, sampleData = []) {
    try {
        const projectData = {
            title: `Analysis of ${file.name}`,
            file_name: file.name,
            row_count: metaData.rows || 0,
            col_count: metaData.cols || 0,
            status: 'analyzing',
            insights: JSON.stringify([]),
            charts: JSON.stringify([]),
            owner_id: ownerId,
            models_data: JSON.stringify([]),
            sample_data: JSON.stringify(sampleData) // Store snippet for Data View
        };
        
        const result = await trickleCreateObject(TABLE_NAME, projectData);
        return result;
    } catch (error) {
        console.error("Failed to create project:", error);
        throw error;
    }
}

/**
 * Updates an existing project with results
 */
async function updateProjectResults(projectId, insights, charts) {
    try {
        const updateData = {
            status: 'completed',
            insights: JSON.stringify(insights),
            charts: JSON.stringify(charts)
        };
        
        const result = await trickleUpdateObject(TABLE_NAME, projectId, updateData);
        return result;
    } catch (error) {
        console.error("Failed to update project results:", error);
        throw error;
    }
}

/**
 * Update project models
 */
async function updateProjectModels(projectId, modelsData) {
    try {
        const updateData = {
            models_data: JSON.stringify(modelsData)
        };
        return await trickleUpdateObject(TABLE_NAME, projectId, updateData);
    } catch (error) {
        console.error("Failed to update project models:", error);
        throw error;
    }
}

/**
 * Fetches a project by ID
 */
async function getProject(projectId) {
    try {
        return await trickleGetObject(TABLE_NAME, projectId);
    } catch (error) {
        console.error("Failed to get project:", error);
        throw error;
    }
}

/**
 * Lists recent projects for a specific owner
 */
async function listProjects(ownerId) {
    try {
        const result = await trickleListObjects(TABLE_NAME, 100, true);
        // Filter client-side since API doesn't support complex filters yet
        return result.items.filter(item => item.objectData.owner_id === ownerId);
    } catch (error) {
        console.error("Failed to list projects:", error);
        return [];
    }
}
