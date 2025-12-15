import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { type, data } = await request.json();
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Validasi Token User ke WordPress untuk dapatkan ID
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const userRes = await fetch(`${wpUrl}/wp-json/wp/v2/users/me`, {
      headers: { 'Authorization': authHeader }
    });

    if (!userRes.ok) {
      return NextResponse.json({ error: 'Invalid Token' }, { status: 403 });
    }

    const userData = await userRes.json();
    const userId = userData.id;

    // 2. Siapkan Payload Update untuk WooCommerce
    // WooCommerce Customer Endpoint butuh struktur { billing: { ... } } atau { shipping: { ... } }
    const payload = {};
    if (type === 'billing') {
      payload.billing = data;
    } else if (type === 'shipping') {
      payload.shipping = data;
    }

    // 3. Update Customer di WooCommerce
    const ck = process.env.WC_CONSUMER_KEY;
    const cs = process.env.WC_CONSUMER_SECRET;

    const updateRes = await fetch(`${wpUrl}/wp-json/wc/v3/customers/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${ck}:${cs}`).toString('base64'),
      },
      body: JSON.stringify(payload)
    });

    if (!updateRes.ok) {
      const errorData = await updateRes.json();
      return NextResponse.json({ error: errorData.message }, { status: 500 });
    }

    const updatedCustomer = await updateRes.json();

    return NextResponse.json({ 
      success: true, 
      customer: updatedCustomer 
    });

  } catch (error) {
    console.error('Update Address Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}