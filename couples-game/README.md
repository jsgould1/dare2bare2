# Couples Game 🔥

A private, real-time couples challenge + reward game. React app, Firebase
Firestore for sync, protected by a single shared login, hosted on Vercel.

## Features

- 🔄 Real-time sync between both phones via Firebase
- 🔒 Private: locked behind one shared login + Firestore rules
- 💋 4 intensity levels with custom challenges
- 🏆 5 daily challenge slots (10AM → 11PM)
- 🎁 Tonight's reward — tap to reveal
- 📱 Works on iOS and Android

---

## 1. Deploy to Vercel

The app lives in this `couples-game/` subfolder of the repo.

1. Push this repo to GitHub (already done on branch `claude/couples-game-izbr6r`).
2. Go to **vercel.com → Add New… → Project** and import this repository.
3. In the import screen:
   - **Root Directory** → click *Edit* → select **`couples-game`**.
   - **Framework Preset** → **Create React App** (auto-detected).
   - Build command `npm run build`, output dir `build` (defaults are fine).
   - **Production Branch**: if you did *not* merge to `main`, set this to
     `claude/couples-game-izbr6r` under Project → Settings → Git.
4. **Deploy.** Vercel gives you a URL like `https://couples-game-xxxx.vercel.app`.
5. Both partners open that URL and sign in with the shared account (below).

Local dev:

```bash
cd couples-game
npm install
npm start        # http://localhost:3000
npm run build    # production build in build/
```

---

## 2. Turn on the shared login (Firebase Auth)

1. [Firebase console](https://console.firebase.google.com/) → project
   **couples-game-2fec8** → **Authentication** → **Get started**.
2. **Sign-in method** → enable **Email/Password**.
3. **Users** → **Add user** → create ONE account you both share, e.g.
   `us@ourgame.com` + a strong password. (You both use this same login.)
4. **Authentication → Settings → Authorized domains** → add your Vercel
   domain (e.g. `couples-game-xxxx.vercel.app`) so sign-in works there.

The app now shows a **Sign In** screen; enter that email + password once on
each phone (it stays signed in).

---

## 3. Lock down the data (Firestore rules)

Without this step your data is world-readable/writable. Do it before real use.

1. Open [`firestore.rules`](./firestore.rules) and replace `YOUR_SHARED_EMAIL`
   with the exact email from step 2.
2. Firebase console → **Firestore Database** → **Rules** → paste the file →
   **Publish**.

Or, with the Firebase CLI:

```bash
cd couples-game
npm i -g firebase-tools
firebase login
firebase use couples-game-2fec8
firebase deploy --only firestore:rules
```

Now only a request signed in as your shared account can touch `games/*`;
everything else is denied.

---

## Files

| File | Purpose |
|------|---------|
| `src/firebase.js` | Firebase init (shared `db` + `auth`) |
| `src/AuthGate.jsx` | Shared-login gate wrapping the app |
| `src/CouplesGameWithFirebase.jsx` | The game |
| `src/App.js` / `src/index.js` | React entry |
| `firestore.rules` | Security rules — **edit + deploy these** |
| `firebase.json` | Config for `firebase deploy --only firestore:rules` |

## Technologies

React · Firebase (Firestore + Auth) · Vercel · GitHub

Built with love 💋🔥
