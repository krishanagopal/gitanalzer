# $ GitAnalyzer

Analyze any GitHub profile with deep insights into repositories, activity, and coding patterns.

🔗 **Live Demo:** https://gitanalzer-wjtj.vercel.app/

---

##  Features

* Search any GitHub username
*  Repository analysis and statistics
*  Activity insights (commits, trends)
*  Project originality detection
*  Fast and responsive UI

---

## 🛠️ Tech Stack

### Frontend

* Next.js / React
* Tailwind CSS
* Deployed on **Vercel**

### Backend

* Node.js
* Express.js
* GitHub API integration
* Deployed on **Render**

---

##  Deployment

* **Frontend (Vercel):**
  https://gitanalzer-or8k.vercel.app

* **Backend (Render):**
  https://gitanalzer.onrender.com

---

## ⚙️ Environment Variables

### Frontend (Vercel)

```env
NEXT_PUBLIC_API_URL=https://gitanalzer.onrender.com
```

---

##  Getting Started (Local Setup)

### 1. Clone the repo

```bash
git clone https://github.com/krishanagopal/gitanalzer.git
cd gitanalzer
```

### 2. Install dependencies

#### Frontend

```bash
cd client
npm install
npm run dev
```

#### Backend

```bash
cd server
npm install
npm run dev
```

---

## 🔗 API Example

```bash
GET /api/github/:username
```

Example:

```bash
https://gitanalzer.onrender.com/api/github/krishanagopal
```

---

## ⚠️ Notes

* Backend may take **30–60 seconds** to respond initially (Render free tier sleep).
* Ensure environment variables are correctly configured in Vercel.

---

## 📸 Screenshots

(Add your UI screenshots here)

---

## 📌 Future Improvements

* Authentication (GitHub OAuth)
*  Advanced analytics dashboard
*  Repo comparison feature
*  Caching for faster responses

---

##  Author

**Krishana Gopal**
GitHub: https://github.com/krishanagopal

---

## Support

If you like this project, give it a ⭐ on GitHub!
