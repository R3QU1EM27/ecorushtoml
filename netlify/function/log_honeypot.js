exports.handler = async function(event, context) {
    try {
        const data = JSON.parse(event.body);
        const { action, email, firstName, lastName, timestamp } = data;

        // Simulate authentication (replace with actual auth logic)
        const isSuccessful = Math.random() > 0.3; // 70% success rate for demo

        // Log details to Netlify logs
        console.log(`[${timestamp}] ${action.toUpperCase()}:`, {
            email,
            firstName: firstName || 'N/A',
            lastName: lastName || 'N/A',
            ip: event.headers['client-ip'] || 'unknown',
            userAgent: event.headers['user-agent'] || 'unknown',
            status: isSuccessful ? 'SUCCESS' : 'FAILURE'
        });

        if (isSuccessful) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: `${action === 'login_attempt' ? 'Login' : 'Signup'} successful!` })
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: `Invalid ${action === 'login_attempt' ? 'credentials' : 'signup data'}.` })
            };
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server error occurred.' })
        };
    }
};