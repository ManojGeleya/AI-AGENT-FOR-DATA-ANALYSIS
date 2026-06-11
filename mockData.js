const MOCK_DATASET_INFO = {
    name: "customer_churn_prediction.csv",
    rows: 12500,
    columns: 14,
    size: "2.4 MB",
    uploadDate: "2026-03-26"
};

const MOCK_COLUMNS = [
    { name: "customer_id", type: "ID", missing: 0 },
    { name: "credit_score", type: "Numeric", missing: 12 },
    { name: "geography", type: "Categorical", missing: 0 },
    { name: "gender", type: "Categorical", missing: 0 },
    { name: "age", type: "Numeric", missing: 5 },
    { name: "tenure", type: "Numeric", missing: 0 },
    { name: "balance", type: "Numeric", missing: 145 },
    { name: "num_of_products", type: "Numeric", missing: 0 },
    { name: "has_cr_card", type: "Boolean", missing: 0 },
    { name: "is_active_member", type: "Boolean", missing: 0 },
    { name: "estimated_salary", type: "Numeric", missing: 0 },
    { name: "exited", type: "Target", missing: 0 },
];

const AGENT_STEPS = [
    { step: "Thought", content: "User uploaded 'customer_churn_prediction.csv'. I need to first scan the file structure and identify the schema." },
    { step: "Action", content: "Calling tool: read_csv_header(file='customer_churn_prediction.csv')" },
    { step: "Observation", content: "File read successfully. 14 columns detected. Target variable appears to be 'exited' (0/1)." },
    { step: "Thought", content: "There are missing values in 'credit_score' and 'balance'. I should check the distribution to decide imputation strategy." },
    { step: "Action", content: "Calling tool: plot_distribution(columns=['credit_score', 'balance'])" },
    { step: "Observation", content: "Distributions appear normal. I will use mean imputation for 'credit_score' and median for 'balance'." },
    { step: "Thought", content: "Now I will perform Exploratory Data Analysis (EDA) to find correlations with the target." },
    { step: "Action", content: "Calling tool: generate_correlation_matrix()" },
    { step: "Observation", content: "Strong negative correlation found between 'is_active_member' and 'exited'." },
    { step: "Thought", content: "Ready to train baseline models. I will try Logistic Regression and Random Forest." },
    { step: "Action", content: "Calling tool: train_model(models=['log_reg', 'rf'])" },
    { step: "Observation", content: "Random Forest achieved 86% accuracy. Logistic Regression achieved 78%." },
    { step: "Success", content: "Analysis complete. Dashboard updated." }
];