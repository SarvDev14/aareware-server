# Aare–Ware Coastal Drive: room + voice server

Friends open your link, type a name and a room code, and drive together. There are no
accounts. This pack adds **voice chat**: talk to the others in your room while you drive.
The person who creates the room is the **host** and can mute other drivers' microphones.

One Node service does everything: it serves the game page (frontend) and runs the room and
voice-setup WebSocket (backend) on the same address. There is nothing else to host.

## Try it on your computer

    npm install
    npm start

Open http://localhost:3000, press **Create a room**, then **Copy invite**.
Browsers allow the microphone on `https://` pages and on `localhost`, so this works.

## Deploy on Render (free), step by step

1. **Put this folder on GitHub.** Make a new repository (private is fine). Upload the
   contents of this folder (`server.js`, `package.json`, `render.yaml`, `public/`, ...)
   with GitHub's "Add file > Upload files", or `git init`, `git add .`, `git commit`,
   `git push`. `server.js` and `package.json` must sit at the top level of the repo.
2. **Create the service on Render.** Sign up at render.com with your GitHub account, then
   either:
   - **New > Blueprint**, pick your repo. Render reads `render.yaml` and fills everything in; or
   - **New > Web Service**, pick your repo, then set: Runtime **Node**, Build Command
     `npm install`, Start Command `npm start`, Instance Type **Free**. Under Advanced, set
     Health Check Path to `/healthz`.
3. **Wait for the first deploy** (a few minutes). Render gives you an address like
   `https://aareware-coastal-drive.onrender.com`. That one address is both the frontend
   and the backend. No separate static site, no CORS settings, and no environment
   variables are needed.
4. **Play.** Open the address, press **Create a room**, then **Copy invite** and send it to
   your friends. In the garage (Esc), press **Join voice chat** and allow the microphone.
   Render addresses are `https`, so the microphone works.

Free plan notes:
- The service sleeps after 15 minutes with no traffic. The first visit after that takes
  about a minute to wake up. While people are driving, their game messages keep it awake.
- Rooms live in memory. A sleep, restart or new deploy clears all rooms; just create a new one.
- To update the game later, replace `public/index.html` in the repo and push. Render redeploys.

## Voice chat

- Press **Join voice chat** in the garage (Esc) while you are in a room. The browser asks for
  the microphone. Audio goes directly between browsers; the server only helps them find
  each other.
- **K** turns your mic on or off. **B** switches the range between *Nearby* (voices fade out
  with distance, about 30 m full volume to 260 m silent, like being on the road together)
  and *Everyone*.
- A mic icon and a green ring appear on a driver's name tag while they talk.
- It is a full mesh, which is fine for the 8-driver room limit.

### Host controls

The room creator is the host (shown as "host"). In the garage (Esc) the host sees a **Mute**
button next to each driver and a **Mute everyone else** button. A muted driver cannot
turn their mic back on, and everyone else's game also silences them, so it still holds if
their browser tries to ignore it. New drivers who join while "mute everyone" is on start
muted. If the host leaves, the driver who has been in the room the longest becomes the host.

### If someone cannot hear / be heard

Most home and Wi-Fi connections connect directly using the free public STUN servers this
pack uses by default. Some mobile networks and strict office networks block direct audio.
For those, add a TURN relay:

1. Get free TURN credentials, for example from Metered's Open Relay
   (https://www.metered.ca/tools/openrelay/), which offers 20 GB a month free.
2. In Render: your service > **Environment** > add `ICE_SERVERS` with a JSON array copied
   from your TURN provider's dashboard, for example:

       [{"urls":"stun:stun.l.google.com:19302"},{"urls":["turn:YOUR-TURN-HOST:443"],"username":"YOUR_USER","credential":"YOUR_PASSWORD"}]

3. Save. Render restarts the service and everyone picks it up on the next page load.

## Other ways to host

- **Quick tunnel (no signup, only while your PC is on):** `npm start`, then in a second
  terminal `cloudflared tunnel --url http://localhost:3000`. Share the `https://…trycloudflare.com` address.
- **Railway / Fly.io / any VPS:** it is a plain Node 18+ app that reads the `PORT`
  environment variable. WebSockets are on the same port at `/ws`.

## How it works

- `public/index.html` is the whole game in one file.
- `server.js` serves that page, relays each driver's position about 15 times a second to
  the others in the room, and relays the voice setup messages. Rooms hold up to 8 drivers
  and disappear when empty. A room code is 4 to 8 letters or digits.
- `GET /healthz` returns `ok`. `GET /ice` returns the STUN/TURN list the page uses for voice.
- Nothing is stored: no database, no login, no recordings.

## Safety notes

Anyone who knows a room code can join that room, so treat the code like a private link.
Names are cleaned on the server and shown as plain text. Mic access is only requested when
a player presses **Join voice chat**.
