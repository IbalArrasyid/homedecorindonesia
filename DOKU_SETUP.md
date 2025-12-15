# DOKU Payment Gateway Setup

## Environment Variables Configuration

Untuk menggunakan DOKU Payment Gateway, Anda perlu setup environment variables berikut:

### 1. Copy .env.local.example ke .env.local
```bash
cp .env.local.example .env.local
```

### 2. Update .env.local dengan DOKU credentials
```env
# DOKU Payment Gateway Configuration
DOKU_CLIENT_ID=BRN-0215-1672674876973  # Ganti dengan client ID Anda
DOKU_SECRET_KEY=SK-4pSAcW1Jn7gmGvJr  # Ganti dengan secret key Anda
DOKU_API_URL=https://api-sandbox.doku.com  # Untuk development
# DOKU_API_URL=https://api.doku.com       # Untuk production
```

### 3. Cara Mendapatkan DOKU Credentials

1. **Daftar Akun DOKU**: https://dashboard.doku.com/
2. **Create Application**: Buat aplikasi baru di dashboard
3. **Get Credentials**: Dapatkan Client ID dan Secret Key
4. **Configure Webhook**: Set callback URL ke `https://yoursite.com/checkout/finish`

### 4. Testing Configuration 

Setelah setup, cek dengan melihat console logs saat checkout:

```javascript
// Seharusnya muncul logs seperti:
🔑 Using DOKU Configuration: {
  hasClientId: true,
  hasSecretKey: true,
  apiURL: 'https://api-sandbox.doku.com',
  clientId: 'BRN-0215-...'
}
```

### 5. Production vs Sandbox

**Sandbox Mode (Development):**
- URL: `https://api-sandbox.doku.com`
- Test payments tanpa transaksi real
- Bisa menggunakan test credentials

**Production Mode (Live):**
- URL: `https://api.doku.com`
- Real payment processing
- Gunakan production credentials

### 6. Payment Methods Supported

- **Virtual Account**: BCA, BNI, BRI, Mandiri
- **E-Wallet**: OVO, DANA, GoPay, LinkAja
- **QR Code**: QRIS
- **Credit Card**: Visa, Mastercard, JCB

### 7. Troubleshooting

**Error: "🧪 DOKU credentials not found"**
- Pastikan `DOKU_CLIENT_ID` dan `DOKU_SECRET_KEY` sudah di-set di .env.local

**Error: "Invalid Header Signature"**
- Check environment variables di .env.local
- Pastikan tidak ada whitespace atau character extra
- Restart development server setelah update .env.local

**Error: "apiURL: undefined"**
- Pastikan `DOKU_API_URL` atau `DOKU_URL` sudah di-set
- Fallback default akan menggunakan sandbox URL

### 8. Important Notes

- Jangan commit .env.local ke git
- Gunakan sandbox untuk development
- Test payment flow sebelum production
- Monitor logs untuk debugging

### 9. Next.js Restart

Setelah mengubah environment variables, restart Next.js server:

```bash
npm run dev
# atau
yarn dev
```

## Support

Untuk bantuan lebih lanjut, hubungi:
- DOKU Documentation: https://docs.doku.com/
- Project Issues: Create issue di repository