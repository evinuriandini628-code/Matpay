# MatPay Asset Mapping

Upload file PNG asli ke folder ini supaya otomatis muncul di website.

## Logo
Taruh di:

```txt
public/assets/logo/logo-icon.png
public/assets/logo/logo-full-white.png
public/assets/logo/logo-text.png
```

Rekomendasi:
- `logo-icon.png` = icon kotak MatPay, cocok untuk sidebar/header/avatar kecil.
- `logo-full-white.png` = logo full warna putih/terang untuk background gelap.
- `logo-text.png` = tulisan MatPay saja, opsional.

## Mascot
Taruh di:

```txt
public/assets/mascot/maskot-login.png
public/assets/mascot/maskot-qris.png
public/assets/mascot/maskot-success.png
public/assets/mascot/maskot-failed.png
public/assets/mascot/maskot-loading.png
public/assets/mascot/maskot-avatar.png
```

Mapping halaman:
- Login page hero: `maskot-login.png`
- Register page hero: `maskot-success.png`
- Dashboard QRIS card: `maskot-qris.png`
- QRIS Payment page: `maskot-qris.png`
- Settlement page: `maskot-loading.png`
- Withdraw / transaksi success illustration: `maskot-success.png`
- Header merchant avatar: `maskot-avatar.png`

Kalau asset belum ada, website tetap jalan karena sudah ada fallback otomatis.
