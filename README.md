# 🏠 IjaraX - Onlayn Ijara Platformasi

**IjaraX** - bu O'zbekistondagi eng qulay va tezkor ijara platformasi. Foydalanuvchilar uy, ofis, va boshqa ko‘chmas mulklarni ijaraga berish yoki topishlari mumkin.

## 🚀 Xususiyatlar

- 🏡 **Tezkor qidiruv** – Foydalanuvchilar o‘z shaharlaridagi ijaraga berilayotgan mulklarni tez va oson topishlari mumkin.
- 🔎 **Keng filtrlar** – Narx, joylashuv, xonalar soni va boshqa parametrlar bo‘yicha saralash.
- 📝 **E’lon joylash** – Foydalanuvchilar o‘zlariga tegishli ijara e’lonlarini yuklab, fotosuratlar va tavsif qo‘shishlari mumkin.
- 💬 **Xabar almashish** – Ijara beruvchilar va oluvchilar o‘zaro bog‘lanishlari uchun ichki xabar almashish tizimi.
- 📍 **Interaktiv xarita** – Google Maps orqali joylashuvni osongina aniqlash.
- 🔒 **Himoyalangan autentifikatsiya** – Google yoki elektron pochta orqali ro‘yxatdan o‘tish va tizimga kirish.
- 📊 **Statistika** – Har bir e’lon bo‘yicha qancha odam ko‘rganligini kuzatish.

## 🛠 Texnologiyalar

- **Frontend**: Next.js (App Router - `app/` katalogi), React.js, Tailwind CSS.
- **Backend**: Firebase Firestore (ma’lumotlar bazasi), Firebase Authentication.
- **Deployment**: Vercel.

## ⚡ O‘rnatish va Ishga Tushirish

1. **Loyihani klonlash:**
   ```sh
   git clone <private-repo-url>
   cd ijarax
   ```

2. **Kerakli modullarni o‘rnatish:**
   ```sh
   npm install
   ```

3. **Lokal serverni ishga tushirish:**
   ```sh
   npm run dev
   ```

4. **Saytni brauzerda ko‘rish:**
   ```
   http://localhost:3000
   ```

## 📌 Struktura

🏗️ Folder Structure
ijarax/
│── app/
│   ├── properties/
│   │   ├── [id]/
│   │   │   ├── page.js
│   ├── profile/
│   ├── auth/
│   ├── create/
│   ├── edit/
│── components/
│── lib/
│── styles/
│── public/
│── package.json
│── README.md
```

## 📜 API-lar

Loyiha real vaqtda Firebase Firestore bilan bog‘lanadi. Muhim API-lar:

- **`GET /api/properties`** – Barcha ijaraga berilayotgan mulklarni olish.
- **`POST /api/properties`** – Yangi e’lon qo‘shish.
- **`GET /api/properties/:id`** – Muayyan mulk haqida ma’lumot olish.
- **`PUT /api/properties/:id`** – E’lonni yangilash.
- **`DELETE /api/properties/:id`** – E’lonni o‘chirish.

## 🔐 Maxfiylik

**IjaraX** shaxsiy loyihadir va kod ommaviy emas. Loyiha maxfiy ma’lumotlarni himoya qilish uchun quyidagilarni ishlatadi:

- Firebase uchun `.env` konfiguratsiyasi.
- Foydalanuvchi ma’lumotlarini himoya qilish uchun Firebase Authentication.

## 🛠 Kelajakdagi Yangi Xususiyatlar

✅ Mobil ilova uchun tayyor UI  
✅ To‘lov tizimini qo‘shish (Stripe, Payme, Click)  
✅ Telegram orqali bildirishnomalar  
✅ Yangi ijara e’lonlari bo‘yicha avtomatik tavsiyalar  

---

**📩 Aloqa**  
IjaraX haqida savollaringiz bo‘lsa, biz bilan bog‘laning! 🚀
