import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Ambil input dari Frontend
    const body = await request.json();
    
    // LOGIC FIX: 
    // Kita ambil value dari key 'username' ATAU 'email'. 
    // Ini membuat API ini kompatibel jika frontend mengirim { email: '...' } atau { username: '...' }
    const loginInput = body.username || body.email; 
    const password = body.password;

    // 2. Validasi input dasar
    if (!loginInput || !password) {
      return NextResponse.json(
        { error: 'Username/Email and password are required' },
        { status: 400 }
      );
    }

    // 3. Persiapan URL WordPress
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    if (!wpUrl) {
      console.error('❌ NEXT_PUBLIC_WORDPRESS_URL is not defined');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 4. Hit Endpoint JWT Authentication di WordPress
    const wpResponse = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: loginInput, // PENTING: Plugin WP mengharapkan key 'username', tapi valuenya boleh email
        password: password,
      }),
    });

    const data = await wpResponse.json();

    // 5. Handle Error dari WordPress
    if (!wpResponse.ok) {
      // Bersihkan pesan error dari tag HTML jika ada
      const errorMessage = data.message ? 
        data.message.replace(/(<([^>]+)>)/gi, "") : 
        'Invalid username/email or password';

      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      );
    }

    // 6. Login Berhasil - Susun Data User
    const userData = {
      email: data.user_email,
      name: data.user_display_name,
      username: data.user_nicename,
      role: 'customer'
    };

    // 7. Buat Response Sukses
    const response = NextResponse.json({
      success: true,
      user: userData,
      token: data.token,
      message: 'Login successful'
    });

    // 8. Set HTTPOnly Cookie
    response.cookies.set('homedecor_session', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 Minggu
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}