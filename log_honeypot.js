// netlify/functions/log-honeypot.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse the request body
        const data = JSON.parse(event.body);
        const { timestamp, ip, userAgent, email, password, botDetected, logEntry } = data;

        // Get client IP from headers (more reliable than the passed IP)
        const clientIP = event.headers['x-forwarded-for'] || 
                        event.headers['x-real-ip'] || 
                        ip || 'Unknown';

        // Create the log entry with real IP
        const realLogEntry = `[${timestamp}] IP: ${clientIP} | User-Agent: ${userAgent} | Email: ${email} | Password: ${password}`;
        const botFlag = botDetected ? " | BOT DETECTED (trap field filled)" : "";
        const finalLogEntry = realLogEntry + botFlag + '\n';

        // Define the log file path (in the temporary directory for Netlify)
        const logDir = '/tmp';
        const logFile = path.join(logDir, 'honeypot_log.txt');

        // Ensure the directory exists
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        // Append to the log file
        fs.appendFileSync(logFile, finalLogEntry);

        // Also log to console for debugging
        console.log('HONEYPOT LOG WRITTEN:', finalLogEntry.trim());

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ 
                success: true, 
                message: 'Log entry recorded',
                ip: clientIP
            })
        };

    } catch (error) {
        console.error('Error logging honeypot attempt:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: false, 
                error: 'Failed to log attempt' 
            })
        };
    }
};

// Handle CORS preflight requests
exports.handler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    // Main handler logic (same as above)
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        const { timestamp, ip, userAgent, email, password, botDetected } = data;

        const clientIP = event.headers['x-forwarded-for'] || 
                        event.headers['x-real-ip'] || 
                        ip || 'Unknown';

        const logEntry = `[${timestamp}] IP: ${clientIP} | User-Agent: ${userAgent} | Email: ${email} | Password: ${password}`;
        const botFlag = botDetected ? " | BOT DETECTED (trap field filled)" : "";
        const finalLogEntry = logEntry + botFlag + '\n';

        const logDir = '/tmp';
        const logFile = path.join(logDir, 'honeypot_log.txt');

        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        fs.appendFileSync(logFile, finalLogEntry);
        console.log('HONEYPOT LOG WRITTEN:', finalLogEntry.trim());

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ 
                success: true, 
                message: 'Log entry recorded',
                ip: clientIP
            })
        };

    } catch (error) {
        console.error('Error logging honeypot attempt:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: false, 
                error: 'Failed to log attempt' 
            })
        };
    }
};