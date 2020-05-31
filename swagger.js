const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BusDepot',
            description: 'Aplikacja zarządzająca zajezdnią autobusową. Centrum zarządzania (orkiestrator).',
            version: '20200531',
            contact: {
                name: 'Jakub Sońta',
                url: 'https://github.com/jsonta'
            },
            license: {
                name: 'MIT License',
                url: 'https://github.com/jsonta/BusDepot_Orchestrator/blob/master/LICENSE'
            }
        },
        tags: [
            {name: "Database Management"}
        ],
        components: {}
    },

    apis: ['./routes.js']
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
