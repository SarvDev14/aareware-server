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
- To update the game later, replace `public/index.html` (and `server.js` if it changed) in the repo and
  push. Render redeploys. In the browser: open the repo's main page, **Add file > Upload files**, drag the
  whole unzipped folder in (the file paths must read like `/aareware-server/public/index.html`, matching the
  existing folder), and **Commit changes** straight to `main`. No terminal needed. Render notices the commit
  and redeploys by itself; the Events tab shows "Deploy live" after a few minutes.
- If the repo has everything inside a folder (for example `aareware-server/`), set that folder as the
  **Root Directory** in Render > Settings.

## Voice chat

- Press **Join voice chat** in the garage (Esc) while you are in a room. The browser asks for
  the microphone. Audio goes directly between browsers; the server only helps them find
  each other.
- **K** turns your mic on or off. **B** switches the range between *Everyone* (the default: every
  driver in the room is heard at full volume wherever they are) and *Nearby* (voices fade out
  with distance, full volume inside about 120 m and silent beyond about 900 m, like being on the road together).
- **Clear voice while driving.** Voice and the game share one audio engine but have their own volume
  sliders in the garage (**Game** 0 to 150 percent, **Voice** 0 to 200 percent). The game volume dips by about half
  while a friend talks (and a little while you talk), so voices stay clear over the engines. Voice has its own
  limiter, so a loud friend does not distort.
- **Headphones or speakers.** Under *Voice chat* there is a button **Mic: speakers (echo cancel)** /
  **Mic: headphones (best quality)**. With speakers, the browser's echo canceller is on so friends do not
  hear the game through your mic. With headphones it is off, which gives the clearest voice (the canceller can
  otherwise chop your voice while the engine sound plays). The page switches to headphones by itself when the
  browser reports a headset or earbuds, and remembers your choice.
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
- `server.js` serves that page, relays each driver's position to the others in the room, and
  relays the voice setup messages. Drivers send 20 updates a second; the server batches the changed
  ones every 25 ms and sends each driver only the others (a driver's car, paint, name, time and weather are sent to
  each recipient once and again only when they change). Every update carries the sender's own clock,
  a sequence number, velocity and turn rate, so each browser can play other cars back smoothly with a
  short jitter buffer instead of jumping from packet to packet. Rooms hold up to 8 drivers
  and disappear when empty. A room code is 4 to 8 letters or digits.
- `GET /healthz` returns `ok`. `GET /ice` returns the STUN/TURN list the page uses for voice.
- Nothing is stored: no database, no login, no recordings.

## Safety notes

Anyone who knows a room code can join that room, so treat the code like a private link.
Names are cleaned on the server and shown as plain text. Mic access is only requested when
a player presses **Join voice chat**.

## What is new in this version

- **Clear voice and game sound together.** In the lobby the voice was clear because the game was silent; once driving began,
  the engines, the wind and the voices competed and the browser's echo canceller started chopping your voice. Voice chat
  already travels on its own direct browser-to-browser audio channel (no ports to choose), so the fix is in how the
  two are mixed: one shared audio engine, the game on its own bus with a limiter, voices on another bus with a boosted
  limiter, the game ducking while friends talk, separate **Game** and **Voice** volume sliders, the default range changed
  from *Nearby* to *Everyone*, and the speakers / headphones microphone mode described under Voice chat.
  These are tuned by reasoning and measurements of the audio graph, not by ear on your devices: if a level still feels
  off, move the Game or Voice slider in the garage.
- **Ratnagiri railway station, Station Road and the thita.** About halfway along the coast road, on the hill side
  (opposite the sea), a new three-way junction (**Station Road Thita**) with a flared mouth, zebra crossings, a stop line and lamp
  posts splits off a straight, divided road that runs about 1.1 km inland to the station: two lanes each way
  (traffic keeps left), a raised median with a chain-link fence, shrubs and double-arm lamps, median gaps with zebra crossings,
  lane arrows and "Station Rd" painted on the tarmac, power poles with sagging wires, flowering trees along the footpaths,
  a row of shops on one side (signboards, awnings, shutters, parked scooters and autos), a five-floor building site with scaffolding
  and green netting, hoardings and billboards, bus shelters, kiosks, and blue "Railway Station" direction boards on the coast road.
  At the end is the **station**: a long, low cream building with a flat canopy on flared maroon columns, a dark fascia with a
  Devanagari station-name board (it is a picture, so it shows on any device), a "KONKAN RAILWAY RATNAGIRI" board and a round
  emblem, glass bays between brick piers, three entrances, a red-carpet porch, a raised glass-band block above, a paved
  forecourt with a planter of palms and flower trees, lamp posts, benches, buses, autos and hatchbacks; behind it two island
  platforms with canopies and signs, three tracks with ballast and overhead wires, and a blue coach train. Everything solid is solid for
  the cars (the porch stops you; you can drive round the ends). A few cars and autos drive on Station Road in both directions.
  The map's minimap shows the station and the junction. At night the road and the forecourt are lit by soft pools of lamp light.
  This is a procedural model made from your photos and notes: it matches the layout and look (colours, columns, signs), not
  every detail, and the emblem is a generic badge, not the real Konkan Railway logo.

- **Graphics: Normal and Ultra.** The garage (Esc) has a new **Graphics** switch, and **U** flips it while driving.
  **Normal** is the look the game always had and the lightest on your device. **Ultra** is the realistic one:
  the whole frame is lit in HDR with a filmic tone map, 4x anti-aliasing, ambient occlusion (soft contact shadows under
  cars, trees and in every crease), bloom around headlights, tail lights and the sun, sun shafts, a little motion blur
  at speed, sharper and softer shadows (a 4096 px shadow map), and a gentle colour grade. On top of that: leafy
  trees and shrubs built from painted leaf cards that sway in the wind and glow where the sun shines through,
  feathery palms with coconuts, carved rocks, asphalt with grain, patches and cracks, finer ground detail, metallic
  flakes in the car paint, finer sea ripples with a sharper sun glitter, sun-lit cloud edges with thin high cirrus,
  and a properly shaped rider on the Hapus (jacket with armour, helmet with livery and visor, gloves, boots).
  Ultra watches its own frame rate: if your device cannot keep up it eases down in five steps (less anti-aliasing,
  no ambient occlusion, simpler plants, lower render scale) and, as a last resort, switches itself back to Normal.
  The mode you end on is remembered for next time. Ultra needs a browser that can render in HDR (most computers and
  many phones; the garage tells you if yours cannot) and a reasonably capable graphics chip. On a laptop with two
  graphics chips, make sure the browser runs on the stronger one. Voice chat and rooms work the same in both modes,
  and other players see your car the same either way.

- **Kolhapur Ghat.** The Kolhapur–Ratnagiri arm at Hatkhamba no longer dead-ends at a barrier: it continues as a
  2 km mountain climb with 7 hairpins (steepest grade about 9 percent, 154 m at the top), guard rails, hairpin and
  speed signs, cut slopes of red laterite, a rock face on one side and a drop with a viewpoint on the other.
  A dry or wet drive up and down was tested for all six vehicles. Fog sits in the hollows near the top.
- **Weather.** Press **Y** (or the button under the place name, or the Weather switch in the garage) to switch
  between clear and rain. It rains with falling streaks, a grey sky and heavier fog, the road turns dark and
  glossy with puddles, wipers sweep the windscreen in the cockpit view, tyres throw spray, and there is
  rain and (in a downpour) thunder with lightning. Wet roads cost grip (more on paint and laterite, less on
  paving), braking distances grow, and at speed on a wet tar road the car can aquaplane a little. Rolling
  fog banks drift around the ghat. In a room the weather is shared: whoever pressed last decides, and a
  driver who joins starts in the room's weather.
- **Made for 8 players.** Remote cars and bikes are drawn from far fewer draw calls (a remote bike went from
  107 to 39, a car from 46 to 32), only the nearest few get the full model and shadows, the rest drop one level
  of detail, and cars that leave are properly freed from memory. If the frame rate sags, the game first thins the
  rain and fog banks, then reduces the number of fully detailed remote vehicles, then distant plants, then the
  render resolution. Network messages are about 30 percent smaller (the car, paint, time and weather fields are
  sent once and only again when they change). Tested with 8 simulated drivers: about 19 KB/s down and 3 KB/s up
  per driver, server CPU around 3 percent.

- **Hapus Triple 765 RS** (a parody Street Triple 765 RS), the sixth vehicle in the garage. Naked bike with a
  rider, real lean in corners, a quickshifter (clutchless upshifts with a burble) and wheelies on a hard launch.
  Its engine is a 765 cc inline triple with a short, raspy slip-on exhaust and a loud intake howl, redline 12,650 rpm.
  Other riders and drivers see it leaning and wheelie-ing in a room.
- **Hatkhamba Thita junction.** The three-road junction south of Bhagwati fort, 1.2 km further down the
  coast (the coast road is now about 6.9 km from end to end): a flared plaza with zebra crossings and lane arrows, raised medians with
  shrubs and lamp posts, NH 66 / NH 166 shields and green direction boards, and the roadside buildings: Hotel
  Alankar Deluxe (pink bands, neon arch, porte-cochere), the row of hotels, chaha stalls and Konkan canteen, Hotel
  Van Vihar, Hotel Y Inn, a tin-roof warehouse with trucks, a tractor yard, an EV charging canopy, a bus stop and a
  small roadside shrine. An HP petrol pump with a shop, ATM, toilets and e-charge posts works for refuelling.
  All of it is solid for the cars.
- **Engine sounds rebuilt.** Every vehicle now has its own synthesised engine: firing order, exhaust-pipe resonance,
  intake roar, throttle-off engine braking and overrun pops on the sporty ones, instead of the earlier buzzy tone.
  These are procedural approximations, not recordings of the real vehicles.

- **Smooth online players.** Other drivers are drawn from a small playback buffer with spline
  interpolation, shortest-arc steering and a short dead-reckoning step for late packets. Tested with
  8 drivers and 40 ms of random network delay plus bursts: displayed speed stays within about 2 percent.
- **Level of detail everywhere.** Terrain chunks, the far coast, trees, palms, shrubs, rocks, houses
  and every car (full model, simple model, two-box model) switch with distance. Hundreds of small
  props are merged into a few draw calls. Far cars cost almost nothing.
- **Bigger, more realistic map.** Coast road from Ganpatipule in the north to
  Ratnagiri / Bhagwati fort and on to Hatkhamba in the south, with villages, beaches, headlands and a forested hill.
- **Ganpatipule Swayambhu Ganpati temple and beach.** Sea-facing red mandapa, white stepped roofs and
  shikhara, deepmala towers, bunting, stalls and the beach village. Fenced off by solid walls: cars
  cannot touch it.
- **Bhagwati (Ratnadurg) fort.** Laterite sea fort on its headland with bastions, gate, Bhagwati
  temple spire and lighthouse. Also solid, cars cannot enter.
- **Mouse look.** Move the mouse to look around (chase, bumper and cockpit cameras). It drifts back to
  centre after a moment. On touch screens, drag.
- **Water revive.** Drive or fall into the sea and a countdown appears; after about four seconds the car
  fades back onto the road facing the way you were heading. Press **R** any time to go back right away.
- **More realistic cars** with proper headlights, grilles, glass, mirrors, rims and tail lamps.
