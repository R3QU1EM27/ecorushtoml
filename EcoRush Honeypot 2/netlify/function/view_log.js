// netlify/functions/view-logs.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const logFile = path.join('/tmp', 'honeypot_log.txt');

        // Check if log file exists
        if (!fs.existsSync(logFile)) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: true, 
                    logs: [], 
                    message: 'No logs found yet' 
                })
            };
        }

        // Read the log file
        const logContent = fs.readFileSync(logFile, 'utf8');
        const logLines = logContent.split('\n').filter(line => line.trim() !== '');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, OPTIONS'
            },
            body: JSON.stringify({ 
                success: true, 
                logs: logLines,
                count: logLines.length,
                lastUpdated: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Error reading log file:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: false, 
                error: 'Failed to read logs' 
            })
        };
    }
};