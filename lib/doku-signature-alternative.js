import crypto from 'crypto';

/**
 * Alternative DOKU signature implementation
 * Try different signature formats if the main one fails
 */

// Format 1: Standard DOKU signature (sesuai dokumentasi resmi)
export function generateDokuSignatureV1(requestId, timestamp, requestTarget, requestBody, clientSecret, clientId) {
    // Generate SHA256 digest dari request body (hex format)
    const digest = crypto.createHash('sha256').update(requestBody).digest('hex');

    // Build signature component sesuai dokumentasi DOKU
    const signatureComponent = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${requestTarget}\nDigest:${digest}`;

    // Generate HMAC-SHA256 signature dalam base64
    const hmacSignature = crypto.createHmac('sha256', clientSecret)
        .update(signatureComponent)
        .digest('base64');

    // Return dengan format HMACSHA256= prefix
    return `HMACSHA256=${hmacSignature}`;
}

// Format 2: Alternative DOKU signature (dengan SHA256 base64 digest)
export function generateDokuSignatureV2(requestId, timestamp, requestTarget, requestBody, clientSecret, clientId) {
    const digest = crypto.createHash('sha256').update(requestBody).digest('base64');

    const signatureComponent = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${requestTarget}\nDigest:${digest}`;

    const hmacSignature = crypto.createHmac('sha256', clientSecret)
        .update(signatureComponent)
        .digest('base64');

    return `HMACSHA256=${hmacSignature}`;
}

// Format 3: Simple signature format (fallback)
export function generateDokuSignatureV3(requestId, timestamp, requestTarget, requestBody, clientSecret, clientId) {
    const signatureComponent = `${clientId}:${requestId}:${timestamp}:${requestTarget}:${requestBody}`;

    const hmacSignature = crypto.createHmac('sha256', clientSecret)
        .update(signatureComponent)
        .digest('base64');

    return `HMACSHA256=${hmacSignature}`;
}

// Format 4: Without HMACSHA256 prefix (fallback)
export function generateDokuSignatureV4(requestId, timestamp, requestTarget, requestBody, clientSecret, clientId) {
    const digest = crypto.createHash('sha256').update(requestBody).digest('hex');

    const signatureComponent = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${requestTarget}\nDigest:${digest}`;

    return crypto.createHmac('sha256', clientSecret)
        .update(signatureComponent)
        .digest('base64');
}

/**
 * Try multiple signature formats and return the first valid one
 */
export function generateDokuSignatureWithFallback(requestId, timestamp, requestTarget, requestBody, clientSecret, clientId) {
    console.log('🔄 Trying multiple signature formats...');

    const formats = [
        { name: 'Official (HMACSHA256= + Hex Digest)', fn: generateDokuSignatureV1 },
        { name: 'Alternative (HMACSHA256= + Base64 Digest)', fn: generateDokuSignatureV2 },
        { name: 'Simple (HMACSHA256=)', fn: generateDokuSignatureV3 },
        { name: 'No Prefix', fn: generateDokuSignatureV4 }
    ];

    for (const format of formats) {
        try {
            const signature = format.fn(requestId, timestamp, requestTarget, requestBody, clientSecret, clientId);
            console.log(`✅ Generated ${format.name} signature: ${signature.substring(0, 50)}...`);
            return { signature, format: format.name };
        } catch (error) {
            console.error(`❌ ${format.name} failed:`, error.message);
        }
    }

    throw new Error('All signature formats failed');
}