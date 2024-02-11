require('dotenv').config()

module.exports = {
    app:{
        apiPath: process.env.API_PATH || '/api/v1',
        PORT: parseInt(process.env.PORT, 10) || 4000,
        APP_ENV: process.env.NODE_ENV || 'dev'

    },
    GBQ: {
        keyFilePath: process.env.GBQ_KEY_FILE_PATH || 'pricing-aurbitrage.json',
        projectId: process.env.GBQ_PROJECT_ID || 'pricing-aurbitrage',
        dataset: process.env.GBQ_DATASET || 'aurbitage_pricing_dataset'
    }
}