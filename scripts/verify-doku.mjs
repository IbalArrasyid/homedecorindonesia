// import 'dotenv/config'; // Load .env file - Removed to use node --env-file
import { generateDokuPaymentUrl } from '../lib/doku.js';

console.log('🚀 Starting DOKU Integration Verification...');

const mockOrder = {
    orderId: `TEST-${Date.now()}`,
    amount: 150000,
    customerEmail: 'test@example.com',
    customerName: 'Test User'
};

console.log('📋 Mock Order Data:', mockOrder);

async function runVerification() {
    try {
        if (!process.env.DOKU_CLIENT_ID || !process.env.DOKU_SECRET_KEY) {
            throw new Error('❌ Missing DOKU credentials in environment variables');
        }

        console.log('🔑 Credentials detected.');
        console.log('📡 Calling generateDokuPaymentUrl...');

        const result = await generateDokuPaymentUrl(mockOrder);

        console.log('✅ Success! Payment URL generated.');
        console.log('🔗 Payment URL:', result.payment_url);
        console.log('📄 Invoice Number:', result.invoice_number);

    } catch (error) {
        console.error('❌ Verification Failed:', error.message);
        if (error.cause) {
            console.error('   Cause:', error.cause);
        }
        process.exit(1);
    }
}

runVerification();
