import { NextResponse } from 'next/server';
import { checkDokuPaymentStatus } from '@/lib/doku';

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const { invoiceNumber } = await request.json();

        if (!invoiceNumber) {
            return NextResponse.json({ error: 'Invoice number is required' }, { status: 400 });
        }

        const status = await checkDokuPaymentStatus(invoiceNumber);

        return NextResponse.json({
            success: true,
            status: status // SUCCESS, FAILED, PENDING
        });

    } catch (error) {
        console.error('Error checking payment status:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
