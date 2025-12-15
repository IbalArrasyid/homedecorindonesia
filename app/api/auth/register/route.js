import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // 1. Ambil data dari Frontend
    // Frontend Anda mengirim: { email, password, firstName, lastName, phone }
    const { email, password } = body;
    
    // Validasi Wajib (Backend Validation)
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 2. Logic Smart Username/Name
    // Jika firstName kosong (misal dari API client lain), ambil dari email
    let firstName = body.firstName;
    if (!firstName) {
        firstName = email.split('@')[0];
    }
    
    const lastName = body.lastName || '';
    const phone = body.phone || '';

    // 3. Cek Konfigurasi Server
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const ck = process.env.WC_FULL_KEY;
    const cs = process.env.WC_FULL_SECRET;

    if (!wpUrl || !ck || !cs) {
      console.error('❌ Server Misconfiguration: Missing WooCommerce Secrets');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 4. Request ke WooCommerce (Create Customer)
    // Dokumentasi: https://woocommerce.github.io/woocommerce-rest-api-docs/#create-a-customer
    const wcResponse = await fetch(`${wpUrl}/wp-json/wc/v3/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${ck}:${cs}`).toString('base64'),
      },
      body: JSON.stringify({
        email: email,
        password: password,
        // Kita biarkan WooCommerce men-generate username yang aman dari email
        // agar tidak error jika email mengandung karakter aneh
        first_name: firstName,
        last_name: lastName,
        billing: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone
        },
        shipping: {
            first_name: firstName,
            last_name: lastName
        }
      }),
    });

    const wcData = await wcResponse.json();

    // 5. Handle Error dari WooCommerce
    if (!wcResponse.ok) {
      console.error('WooCommerce Register Error:', wcData);
      
      // Handle email sudah terdaftar
      if (wcData.code === 'registration-error-email-exists') {
        return NextResponse.json(
          { error: 'An account is already registered with your email address. Please log in.' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: wcData.message || 'Registration failed. Please try again.' },
        { status: wcResponse.status }
      );
    }

    // 6. AUTO-LOGIN: Dapatkan Token JWT segera setelah register
    // Agar user tidak perlu login manual lagi
    let token = null;
    try {
        const jwtResponse = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
              username: email, // Plugin JWT support login pakai email
              password: password 
          }),
        });

        const jwtData = await jwtResponse.json();
        if (jwtResponse.ok) {
            token = jwtData.token;
        }
    } catch (jwtError) {
        console.warn('Auto-login failed, but registration success:', jwtError);
    }

    // 7. Response Sukses ke Frontend
    const response = NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: wcData.id,
        email: wcData.email,
        firstName: wcData.first_name,
        lastName: wcData.last_name,
        role: wcData.role,
        username: wcData.username
      },
      token: token 
    });

    // Opsional: Set Cookie HTTPOnly untuk keamanan tambahan
    if (token) {
        response.cookies.set('homedecor_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 Minggu
            path: '/',
        });
    }

    return response;

  } catch (error) {
    console.error('Registration API Critical Error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}