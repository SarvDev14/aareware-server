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
   your friends. In the menu (Esc), open the **Online** page, press **Join voice chat** and allow the microphone.
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

## Playing on a phone or tablet

Open the same address in **Chrome on Android** or **Safari on iPhone / iPad**. The menu and the controls change to fit
a touch screen by themselves. Landscape (phone turned sideways) is the best way to play; in portrait the game works too and
shows a small "turn your phone sideways" note you can close.

- **Left thumb: steering.** Two arrows; slide your thumb from one to the other without lifting it. In the menu (menu
  button, top right) the *Controls* page also offers a **Slider** (a knob you drag, with finer steering) and **Tilt**
  (turn the phone like a steering wheel; tap the on-screen wheel to centre it, and use *Reverse tilt* if it turns the wrong way).
- **Right thumb: gas and brake.** The brake also reverses. **HAND** is the handbrake and **HORN** is the horn.
- **Top row:** camera, **back to the road** (hold it for half a second, so a stray tap cannot throw you across the map),
  **More** and the menu. **More** holds lights, time of day, weather, gearbox, graphics, sound, engine on/off, the
  drivers list, HUD on/off, car colour, spare fuel and voice range. The microphone button shows up while you are in voice chat.
- **Drag anywhere else on the view** to look around. When you stop near a pump, a **Hold to refuel** button appears.
- With the **Manual** gearbox, **UP / DOWN** shift buttons appear above the steering arrows.
- **Full screen.** Android Chrome goes full screen and locks to landscape when you press *Start driving* (you can turn that off in
  the Touch controls section). iPhone Safari cannot do that from a web page: tap **Share > Add to Home Screen** and open the
  game from its icon, which then runs full screen. On Android the same works from Chrome's menu (**Install app** or **Add to Home
  screen**). The server provides the icon and install file for this.
- **Performance.** Phones start with a lighter setup: a lower render resolution, smaller shadows, shorter draw distance for
  scenery, no fog banks, lighter rain, fewer other cars on the road, and the frame rate held at 60 on 90 / 120 Hz screens. The game
  also lowers its resolution by itself if the frame rate drops. **Normal** graphics is the one to use on a phone. High and Ultra
  can still be chosen but will be slow on most phones. **Insane** (a fourth button on phones only) draws Ultra at the screen's full resolution: the sharpest
  picture and by far the heaviest, meant for a flagship phone; its Resolution slider lowers the load if it stutters. **Custom** lets a weaker phone keep the parts that matter
  to you (textures or shadows, say) and leave out the rest; the game still starts in Normal. The page is about 22 MB, so the first load on mobile data takes a moment
  (the server sends it compressed, and the browser keeps it afterwards).
- **Sleep and signal.** The screen is kept awake while you drive. If the phone sleeps or the signal drops, the room connection
  is rebuilt when you come back.
- **Forcing a layout.** Add `?mobile=1` or `?mobile=0` (and `?touch=1` or `?touch=0`) to the address to force the phone or the
  desktop layout, for example on a tablet with a keyboard.

## Voice chat

- Press **Join voice chat** on the menu's **Online** page (Esc) while you are in a room. The browser asks for
  the microphone. Audio goes directly between browsers; the server only helps them find
  each other.
- **K** turns your mic on or off. **B** switches the range between *Everyone* (the default: every
  driver in the room is heard at full volume wherever they are) and *Nearby* (voices fade out
  with distance, full volume inside about 120 m and silent beyond about 900 m, like being on the road together).
- **Clear voice while driving.** Voice and the game share one audio engine but have their own volume
  sliders (**Game** 0 to 150 percent on the *Audio* page, **Voice** 0 to 200 percent on the *Online* page). The game volume dips by about half
  while a friend talks (and a little while you talk), so voices stay clear over the engines. Voice has its own
  limiter, so a loud friend does not distort.
- **Headphones or speakers.** Under *Voice chat* there is a button **Mic: speakers (echo cancel)** /
  **Mic: headphones (best quality)**. With speakers, the browser's echo canceller is on so friends do not
  hear the game through your mic. With headphones it is off, which gives the clearest voice (the canceller can
  otherwise chop your voice while the engine sound plays). The page switches to headphones by itself when the
  browser reports a headset or earbuds, and remembers your choice.
- **Choosing the microphone, Bluetooth headsets and Listen only.** Under *Voice chat* on the *Online* page there is a
  **Microphone** list: *Automatic (recommended)*, every microphone the browser can see, and *Listen only (no
  microphone)*. A Bluetooth headset has two modes: stereo (music quality) and a "Hands-Free" phone mode that is mono
  and narrow, like a phone call. Windows switches the headset into phone mode the moment any program opens its
  microphone, and then everything the headset plays, the game included, sounds like a call. That happens in Windows and
  in the headset; the game's own sound is made inside your browser and never goes to a server. So *Automatic* prefers
  your laptop's, a USB or a wired microphone over a Bluetooth headset's, whenever one exists (the browser only shows
  device names after you have allowed the microphone once; the very first time it may open the default microphone and
  then move to a better one straight away). *Listen only* joins the voice chat without opening any microphone: the
  headset stays in stereo and you still hear everyone. If the page sees that your sound output has switched into
  phone mode, a note appears in the panel and the **Voice chat** tips explain what to do. Your choice is remembered.
- **Windows "Communications" setting.** Control Panel > Sound > **Communications** tab > **Do nothing**. The default,
  "Reduce the volume of other sounds by 80 percent", turns the game down whenever Windows thinks you are on a call.
- A mic icon and a green ring appear on a driver's name tag while they talk.
- It is a full mesh, which is fine for the 8-driver room limit.

### Host controls

The room creator is the host (shown as "host"). On the *Online* page (Esc) the host sees a **Mute**
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

- **1.27.0: a dense Hatkhamba, lane paint that shows at any distance, a Neutral gear for the bikes, and raindrops on the screen.** Hatkhamba Thita is now a busy highway-junction town: rows of
  shops and houses (the model houses of the rest of the map) shoulder to shoulder along both sides of all three arms, a second and third row behind them, more houses in the gaps between
  the arms, and about 800 more trees (mango, rain tree, palm, bamboo, bushes). Hotel Alankar and its forecourt are left exactly as they were. The dashed lane lines and white edge lines of
  the arms are flat road paint now (they used to be thin boxes that the road swallowed beyond about 15 m): they show along the whole arm, like the ordinary road's lines. Bikes have a
  Neutral: press **N** at a standstill (the tray's "Neutral (bikes)" on a phone); the HUD shows N, the engine revs freely to the limiter with nothing driving the wheel, and N (or E)
  selects first again; while rolling the gearbox refuses. The cockpit views keep their windscreen drops and wiper; the chase views have no drops on the screen.
- **1.26.0: the Ratnagiri Rocket gets a louder, rasping aftermarket-pipe voice, real gear-change sounds, instant flames and a proper tuck.** The engine now runs through an SC-Project-style
  "loud titanium can" treatment: less bass thump, a barking midrange and a saturated metallic rasp mixed in on top of the recorded loops (about 2 dB louder, no clipping). Every gear change has
  a sound: a mechanical clunk on each shift, a loud quickshifter "brap" (the ignition cut) on a held-throttle upshift, and the auto-blipper's rev blip with one to three exhaust pops on the way
  down. The exhaust flames appear at full size on the very first frame (no growing, no fading in, no sparks) and go out quickly. The rider is upright at a crawl and fully tucked over the tank from
  about 55 km/h, so he is no longer sitting straight at 60 km/h and above.
- **1.25.0: the Ratnagiri Rocket (Kawasaki Ninja ZX-6R) with the recorded engine sound and exhaust flames.**
  **Files.** Three things changed: `public/index.html` (about 21.9 MiB, under GitHub's 25 MB browser-upload limit), **two new files, `public/hq-zx6r.js` (the bike, about 2 MB) and `public/hq-cbr.js` (its engine sound, about 1.5 MB)**, and `server.js` (one line: the two new files are served). Upload all of them; the other `hq-*.js` packs are the same as 1.24.0. If the two new files are missing the bike simply cannot be chosen (the garage says "Could not load that bike").
  **The bike.** Your Kawasaki Ninja ZX-6R model is in the garage as **Ratnagiri Rocket 600** (599 cc inline-four, 6 speeds, 95 kW, 14,000+ rpm, about 0 to 100 km/h in 4 s, 245 km/h). It uses the model's own textures (shrunk to 1024 px), including the Kawasaki and ZX-6R logos, and is Kawasaki green by default; the bodywork can be repainted in the garage (the black plastics, red and white accents keep their colour). The 335,000 triangles of the download are reduced to about 67,000 close up and 6,600 further away, and the wheels, forks and handlebars move as on the real bike. The model is fetched when you choose it, so the page itself stays small.
  **The rider.** The same animated rider as on the Chiplun Classic (hands on the grips and turning with the bars, feet on the pegs, the rain and head animations, the lean into corners) is moved onto the ZX-6R's seat, grips and pegs and leans further forward, flat on the tank at speed.
  **The sound.** The engine sound cut from your CBR recording plays on this bike (loops from idle to the limiter, closed-throttle loops on the overrun, the quickshifter burst on upshifts, real pops, the start-up), pitched to the ZX-6R's higher revs.
  **Exhaust flames.** Real flames from the silencer, along its own angle (it points back and 36 degrees up): a short tongue with a white-yellow core, orange body and red and violet edges, a violet-blue mouth and a glow, fixed to the bike so it is not left behind at speed, with a few sparks. They go off together with the sound: on a quickshifter upshift with the throttle held (more often and bigger the higher the revs, from a small puff at low revs to a half-metre flame near the limiter), sometimes a second smaller pop; on downshifts with the throttle closed (one to three little pops); in the crackle after you lift off at high revs; and at the rev limiter. Only this bike has them.
- **1.24.0: vehicle-only, Hatkhamba with white plaster and real shop models, road paint that stays put, and the CBR 650R sound.**
  **Files.** Only `public/index.html` changed (about 21.9 MiB); `server.js` and the `hq-*.js` packs are the same as 1.23.2.
  **Vehicle-only.** Nobody gets off the bike any more: the Z prompt, the on-foot controls and the mount / dismount are switched off (the code is still there behind one switch, `FOOT_ENABLED` in `walker.js`). The controls list in the menu no longer mentions them.
  **Hatkhamba.** The Alankar hotel and the other plain-walled buildings now wear the same real white-stucco picture (Poly Haven, CC0) as the model houses, so they read as plaster instead of flat grey paint. The three roadside shops on the south side and the four small stalls are the real scanned shop-row and town-house models (the `s1` Rentable Stores model and the `k4` house) instead of the hand-built boxes; only the name boards are drawn. The zebra bars, stop lines and lane arrows are no longer pictures stretched on the road (a thin painted line shrinks to nothing at a distance); they are real paint geometry laid on the road surface, so they stay sharp from far away, at night and in rain.
  **CBR 650R sound (prepared, not on the road yet).** The engine sound was cut from your recording: seven rpm points, each with an on-throttle and a closed-throttle loop made from a real rev sweep and decel (pitch-flattened and joined on a whole number of firing periods so they never beat), eight real exhaust pops, three quickshifter bursts built from them, and the start-up. It plays through the game's own bank player (`cbraudio.js`, `hq-cbr.js`) about 2 dB louder than the synthesised bike. It is not in this release's files: the bike itself (the `.max` model) could not be read yet, so there is no CBR vehicle to attach it to.
- **1.23.2: the get-on and get-off are faster still.**
  **Files.** Only `public/index.html` changed (about 21.9 MiB). **What changed.** Both movements now take about 1.2 seconds (the same motion played 2.4 times faster than it was drawn; 1.23.1 was 1.8 s). The joints still never jump at any hand-over, and the full cycle runs without errors.
- **1.23.1: the get-on and get-off are faster.**
  **Files.** Only `public/index.html` changed (about 21.9 MiB). **What changed.** Both movements now take about 1.8 seconds instead of 3 (the same motion, played 1.65 times faster). Re-checked: no joint jumps at any hand-over, and the full cycle runs without errors.
- **1.23.0: the get-on / get-off redone from your video, a joystick and Sprint button on foot, and the jumps are gone.**
  **Files.** Only `public/index.html` changed (about 21.9 MiB); `server.js` and the `hq-*.js` packs are the same as 1.22.1 (this README, `CREDITS.md` and `package.json` only carry the new notes and version number).
  **Getting on.** Rebuilt from your reference video, frame by frame: he steps up to the left of the bike with his left foot on the ground, leans forward and puts both hands on the tank, swings the right leg straight back at hip height, brings it across above the tail with his chest low over the tank, sits down, puts the right foot on its peg and the hands on the grips. **Getting off is exactly the same movement played backwards**, not a separate animation. The bike's tank, tail, mirrors and seat are cleared: measured 20 times a second along the whole motion, nothing of the body goes into the bike except the hands on the tank and the seat under him, and no joint jumps (also at the hand-over to riding and to walking).
  **Camera.** It does not move at all during the get-off (the riding camera stays; if you were in the cockpit or bumper view it steps back to the chase view with a short glide) or during the get-on (the on-foot camera stays). It changes only afterwards, with a one-second glide round him, never through the bike. While you walk up to the bike the view swings round behind it, so there is nothing left to swing after the get-on. The on-foot camera also never whips round when you turn: its turn rate is limited.
  **Touch controls on foot.** The vehicle buttons are replaced by a **joystick** (left thumb) and a **Sprint** button (right thumb); they go back to the vehicle controls when you sit on the bike. A light push walks (the further you push, the faster, from a slow stroll up to a brisk walk), pushing almost all the way jogs, pushing all the way forward **and holding Sprint** sprints (3.0 m/s jog, 5.6 m/s sprint). Pushing sideways steers, pulling the stick down turns him round. Checked with real touches on a phone-sized screen.
  **Jumping removed.** Both the standing jump and the running jump are gone (the Space key, the Jump button and the two Mixamo clips), which also makes the animation file smaller (341 KB).
  **Also fixed.** The idle clips (looking round, stretching, breathing) now fade into each other instead of snapping.
  **Honest limits.** The get-on / get-off is made for the Honda only. It is a procedural animation guided by your video, not a motion capture of it, so it follows the same sequence but is not identical. The camera glide after a get-on is short but you will notice it if you are far from the bike's heading when you start.
- **1.22.1: on a phone, "Tap here to get on / off the bike" now works.**
  **Files.** Only `public/index.html` changed (about 21.9 MiB). **What was wrong.** The prompt is a button on a touch screen, but only the refuel prompt had been marked as tappable in the page's style sheet, so a tap on the get-off / get-on prompt went straight through it and did nothing (Z on a keyboard was fine). **What changed.** The prompt is now a real button with a clear outline, checked with real touch taps on a phone-sized screen: tap to get off, tap to get on, back riding with the engine starting. While you are on foot the three pedal buttons on a touch screen are relabelled **Run**, **Turn** and **Jump** (they were still called Gas, Brake and Hand), and go back to their names when you sit on the bike.
- **1.22.0: you can get off the bike, walk and run about the world, and get back on. Press Z.**
  **Files.** Only one file changed: `public/index.html` (about 21.9 MiB, under GitHub's 25 MB browser-upload limit). `server.js`, the `hq-*.js` packs and everything else are the same as 1.21.1, so upload just `public/index.html` (this README, `CREDITS.md` and `package.json` only carry the new notes and version number).
  **Getting off.** When the bike has stood still for a moment a prompt appears: press **Z** (touch: tap the prompt). The engine switches off, the rider leans over the tank, swings his right leg over the tail, puts both feet down and straightens up beside the bike (about 3 seconds). **Getting on** is the same movement the other way round: press **Z** within about 7 m of the bike (he turns to face it, walks round the tail if he is on the far side, steps up to the left side, leans on the tank, swings the leg over, sits, puts his hands on the grips) and the engine starts again.
  **On foot.** **W** walks (it runs at a jog), **Shift** sprints, **Ctrl** or **Alt** walks slowly, **A**/**D** steer, **S** turns him round (a standing half turn, or a walking U-turn at speed), drag the mouse to look round. On a touch screen the gas button runs, the wheel steers, the brake button turns round and the handbrake button jumps. He walks and runs on the real ground: slower uphill, a bit faster downhill, leaning into the slope with each foot placed on the terrain under it. Stopping from a run plays a proper run-to-stop. Standing still he breathes, shifts about, looks round, stretches his neck and arms. **In the rain** he also shakes the water off his head with a little shiver and tilts his head up to the sky. The bike stays where you left it (nothing walks through it); the minimap follows you; **R** or choosing another vehicle in the garage puts you back on the bike.
  **How it was checked.** The get-off and get-on are authored against the measured shape of the Honda (seat, tail, tank, pegs, grips) and were measured 40 times a second along the whole motion: the body stays clear of the bike everywhere except where it should touch (the hands on the tank, the seat under the rider), the joints never jump (no pop at any of the hand-overs between riding, getting off, walking, walking up, getting on and riding again, also on a sloping road, where the bike leans with the road and the walker stands upright), and the cycle was repeated and run through the whole game loop (keys, prompt, camera) without a single error.
  **Animations.** Walking, running, sprinting, turning, idling, looking round, stretching and jumping are Mixamo clips (credited in `CREDITS.md`) retargeted onto the rider's skeleton and packed into one small file (343 KB). The clips you supplied had no shrug, yawn, shiver, hug-yourself or look-up, and the "annoyed head move" file was not a head shake, so the wet-weather head shake, the shiver and the look at the sky are made in code, and the look-round and neck-stretch clips stand in for the rest.
  **Honest limits.** Only the Chiplun Classic 750 (the Honda) can be got off; the cars have no on-foot mode. The rider on foot is yours only: other players keep seeing your bike parked with the rider still on it. There is no sound of footsteps yet, no walking into houses or boats, and the walker is blocked by trees, houses and the sea but can climb any slope.
- **1.21.1: the bike now reverses and rolls back down a slope at 2 km/h.**
  **Files.** Only one file changed: `public/index.html` (about 21.4 MiB, under GitHub's 25 MB browser-upload limit). Everything else is the same as 1.21.0, so upload just `public/index.html` (this README and `package.json` only carry the new version number).
  **What changed.** The bike's reverse gear tops out at 2 km/h (measured on the road: 2.0; it was 4), and when the bike rolls backwards down a slope (gravity only) its backward speed is capped at 2 km/h (it was 10). Cars are not affected.
- **1.21.0: when it rains and the bike stands still, the rider now deals with the wet: he wipes his helmet visor, shakes the water off each hand, shakes a boot and shakes his head.**
  **Files.** Only one file changed: `public/index.html` (about 21.4 MiB, under GitHub's 25 MB browser-upload limit). `server.js`, the `hq-*.js` packs and everything else are the same as 1.20.1, so upload just `public/index.html` (this README and `package.json` only carry the new version number).
  **What he does.** In rain, while the bike is stopped, the idle fidgets (look round, stretch, shift, blip the throttle) are joined by four wet-weather ones, and the harder it rains the more often he picks them. **Visor wipe:** the left hand leaves the grip, goes up with the palm flat to the helmet and sweeps across the visor twice, then back to the grip. **Shake hands:** the hand opens, lifts off the grip and flicks at the wrist, left hand first and the right one a moment later. **Shake a leg:** the left boot comes off the peg, swings and shakes, then settles back. **Shake head:** a quick shake of the helmet. The dry-weather fidgets still happen in rain, just less often.
  **Fingers.** The rider's gloves now have their own finger bones (30 more joints, 50 in all), so the hand can really open: the fingers and thumb come off the grip exactly the way they were wrapped on, and close back onto it. Until now the hand was one stiff piece. The grip itself, the riding pose and the Pony driver's hands are unchanged.
  **No clipping.** Every gesture was measured against the real model, 60 times a second along the whole motion, with a point every 5 mm on the hand, boot and bike. The lifted hand stays at least 24 mm away from the mirror, its stem, the switches and the levers (the mirror stalk crosses just above the grip, so the open hand is bent back at the wrist and turned a little inboard to pass behind it). The visor hand stays about 5 mm off the helmet (a height map of the helmet is used, so it follows the visor and the chin bar), and the lifted boot is at least 15 mm clear of the bike. The fingers still touch the grip while they are opening and closing on it; that contact is the grip itself, not a clip.
  **Honest limits.** Only the player's own rider does this; other players' riders and the traffic bike keep their fixed pose. The gestures only start when the bike is stopped and the rain is on; if you drive off in the middle of one, the rider lets go of it over about half a second and goes back to riding.
- **1.20.1: the Alibag Pony driver's hands sit properly (both on the wheel, the left forearm resting on the door), all the rider and driver animations are faster, and the bike now reverses and rolls back down a slope at walking pace.**
  **Files.** Only one file changed: `public/index.html` (about 21.4 MiB, under GitHub's 25 MB browser-upload limit). `server.js`, the `hq-*.js` packs and everything else are the same as 1.20.0, so upload just `public/index.html` (this README and `package.json` only carry the new version number).
  **Pony hands.** On the wheel, the palm now sits further along the hand (nearer the knuckles) and a little closer to the rim, so the four fingers and the thumb wrap round the rim (the finger fit to the rim went from 6 to about 2.5 mm). At low speed the left hand used to hover above the door at the mirror base, with the elbow dipping inside the door panel; now the hand lies on the door top near its inner edge, further back, and the elbow comes up and out so the forearm rests along the door top.
  **Faster animations.** Every spring that moves the rider and the driver (lean, pitch, head, shoulders, hands to the door and back, the idle gestures) runs about 38 percent faster; the idle gestures are about a third shorter and come a little more often. The crash reaction is only slightly quicker (10 percent), because it was already brisk.
  **Bike reverse and roll-back.** The reverse gear tops out at about 4 km/h (it was set to 6; measured on the road now: 4.4). When a bike rolls backwards down a slope (gravity only), its backward speed is now capped at 10 km/h.
- **1.20.0: the rider's hands now really hold the handlebar, the rider reacts to crashes and fidgets when the bike stands still, and the Alibag Pony has an animated driver (hands on the wheel, left hand on the door at low speed, looks back in reverse).**
  **Files.** Only one file changed: `public/index.html` (about 21.4 MiB, under GitHub's 25 MB browser-upload limit). `server.js`, the `hq-*.js` packs and everything else are the same as 1.19.0, so upload just `public/index.html` (this README and `package.json` only carry the new version number).
  **Hands.** The grip rubber was measured on the bike model (it is swept back about 25 degrees, not square to the bike). The hand is now built round that cylinder: knuckle line along the grip, palm on top of the rubber, the four fingers wrapped round it and the thumb under it. The arms are a little longer and the rider sits a little further back on the seat, so the shoulders can reach the grips without the arms being stretched; the brake and clutch levers sit in front of the fingers.
  **Crashes.** When you hit something, the rider is thrown about by the hit and settles in under a second; he never falls off. The direction of the hit matters: a head-on hit pitches the chest and head forward and the body compresses on the arms, a hit from the side rolls the torso and snaps the head sideways, a hit from behind throws the chest back. Hard hits move the body more than light ones.
  **Standing still.** The rider breathes, shifts his weight, sways a little, and the engine's shiver runs through the body. Every few seconds he does something: looks round, sits up and stretches, shifts from one cheek to the other, blips the throttle twice with the right wrist, or taps the road with the left foot. Any movement of the bike ends the gesture.
  **Reverse.** The bike has no reverse whine any more, and the engine note in reverse is held near idle instead of climbing with the speed.
  **Alibag Pony.** The driver is now an animated rider as well. The steering wheel, the seat and the door were measured on the car model (the wheel leans back 25 degrees; the door top is at 0.83 m), and the driver is placed from those numbers: hands at 10 and 2 on the rim, fingers round it, turning with your steering. At low speed with the wheel straight the left hand goes to the door top and comes back to the wheel when you steer or speed up. In reverse he turns and looks back over his shoulder. He also breathes, glances round and fidgets when stopped, reacts to crashes, sways outwards in corners, and the suit flutters in the wind (the Pony is open-topped).
  **Honest limits.** The Pony's steering wheel is part of the dash in the model, so the wheel itself does not turn; only the hands do. The other cars' drivers and other players' riders still show their fixed poses.

- **1.19.0: the black patches on the rider's suit are gone, and the rider on your bike is animated: it leans forward as the speed climbs and sits back up as it drops, leans into corners, looks at the sea, the fort, the viewpoints and the Ganpatipule temple when you ride slowly, puts a foot down when you stop, turns the handlebar with you at standstill, looks back over the shoulder with both feet paddling when you reverse, and the suit flutters in the wind at speed. The bike no longer makes the car-style reverse whine**
  **Files.** Only one file changed: `public/index.html` (about 21.2 MiB, under GitHub's 25 MB browser-upload limit). `server.js`, `package.json`'s start script and the `hq-*.js` packs are the same as 1.18.0, so upload just `public/index.html` (the README, CREDITS and `package.json` here also carry the new version number, if you keep them in the repository).
  **How it works.** The rider is the same Mixamo character as before, but it now keeps its skeleton (20 joints: hips, three spine joints, neck, head, shoulders, arms, forearms, hands, thighs, shins, feet) and the game poses it every frame instead of showing one frozen pose. There are no recorded animation clips, so nothing to download: the posture is worked out from the bike's speed, lean, steering and braking, every change is eased by a damped spring (no sudden starts or stops, the head moves first and the shoulders follow a beat later), and the arms and legs are solved so the hands stay on the grips (which turn with the front wheel) and the feet stay on the pegs or on the ground. This is procedural, not motion-captured, so it will not look like a studio mocap rig.
  **What it does.** Forward lean: upright and relaxed when slow, down over the tank at high speed, a little more forward when you brake and back when you open the throttle. Corners: the body lies a little further into the bend than the bike, the head keeps the eyes level and looks into the corner. Looking around: below about 40 km/h the rider glances for a few seconds at the sea (when you are near the shore), the Bhagwati fort, Aare Ware Point, the Ghat viewpoint and the Ganpatipule temple when they are in range and ahead or beside you, then looks ahead again; above about 40 km/h it never looks away from the road. Stopping: the left foot goes down when you are nearly stopped, and turning the handlebar at standstill moves the arms, twists the shoulders and turns the head the way the front wheel points. Reverse: the rider twists and looks back over the right shoulder and walks the bike back with both feet. Wind: the suit's back, sleeves and trouser legs flutter, growing with the square of the speed (nothing under about 20 km/h, about 3 cm of cloth movement at 180 km/h), and the head shakes very slightly in the buffeting.
  **Sound.** Reverse gear on the bike no longer plays the whine that cars make.
  **Black patches.** The suit's picture (texture) has flat black stretch panels at the elbows, knees and shins, lower back, collar and shoulders; on the model they looked like black patches. They are repainted in the suit's blue (a touch darker), the black gutter between the texture's islands is filled the same way so it cannot bleed dark edges at the seams, and the gloves keep their black palms. This applies to every rider in the game, not only yours.
  **Honest limits.** Only the player's own rider is animated; other drivers' bikes and the traffic bike still show the fixed pose (the same skeleton could drive them later at a cost per rider). The rider is only drawn from the behind-the-bike camera and the garage, as before. The fingers stay curled round the grips and the feet do not roll with the ground. I checked it in a desktop browser (software rendering), not on a phone: the animation costs under 1 ms of processor time per frame on that machine.

- **1.18.0: Hatkhamba is dressed with the assets you sent (utility poles with sagging wires, cast-iron lamps, concrete footpaths, barriers, cones, drums, shutters, tyres, chain-link fence, manholes, worn road paint) and a lot more trees, and the same props are spread over the whole map**
  **Files.** Three things changed: `public/index.html` (about 21.1 MiB, under GitHub's 25 MB browser-upload limit), **one new file, `public/hq-hat.js` (about 6 MB), and `server.js`** (one line: the server only serves the pack files it has in a list, and `hq-hat.js` is now on it; without this the new pack would answer 404). Upload all three (`server.js` goes next to `package.json` and `render.yaml`, inside `aareware-server`); `hq-ground.js`, `hq-veg.js`, `hq-trucks.js` and `hq-houses.js` are byte for byte the 1.17.0 files. If `hq-hat.js` is missing or fails to load the game still runs: the roads, buildings, colliders and trees are the same, only the new props, the footpaths' concrete picture and the road-paint pictures are absent.
  **Hatkhamba.** Pole lines with the real pole models now run along the arms with five wires each (three on the upper cross-arm, two on the lower), hung as sagging curves, with a span of wires across the Amba Ghat and closed roads. Concrete footpaths with kerbs (from your Concrete047A pictures) run along both arms beside the shops, with cast-iron lamps on them (they leave a pool of warm light on the ground at night) and utility and power boxes at their feet. The closed road's barricade now has real jersey blocks, a row of painted barriers, a taper of 24 cones, drums at the ends and two A-frame barriers, with yellow hatching painted on the road in front. There are zebra crossings at the mouth of each arm and manhole covers in the lanes, all from your worn road-paint and manhole pictures, a row of eight shuttered shops (two with graffiti), stacks of tyres at Shanti Tyre and by the shutters, and chain-link fences round the Mahindra yard and the transformer poles. Trees: dense belts of mango, rain trees, coconut palms, bamboo clumps and bushes now stand down both sides of every arm (about 190 new tree and bamboo-clump spots and about 290 bushes, against 35 trees before).
  **Mango and bamboo.** Two new tree types from your Sketchfab files (a mango tree and a bamboo clump) were converted to the game's tree format with three detail levels. Mangos are now one of five broadleaf trees in the forests and along the roads; bamboo grows in clumps in the damp ground and along the verges.
  **Across the map.** The same poles and wires now follow the beach and spur roads; lamps and power boxes line the coastal road through the villages and ring the car parks and the four fuel stops; and there are six road-works sites on the coastal road, three on the ghat and one on the Amba Ghat arm (cones, drums, a barricade and blocks).
  **Honest notes.** (1) The positions are by eye, as before, not surveyed. (2) The cable kit you sent is made for running along walls, so I did not use it: the overhead wires are drawn by code between the pole models' real insulator points. (3) The pachira tree and the second bamboo file were left out: the second bamboo is CC BY-SA 4.0 (it would force this game to carry the same licence) and the pachira needed a separate conversion I did not do. (4) The new models are scaled to look right in the game (poles are 8.3 m tall, the mango about 10 m, bamboo about 9 m). (5) Mango and bamboo are credited in `CREDITS.md` (CC BY 4.0), the cone and barrier pack too. (6) Cost: with the new props switched off and on in the same spot, the renderer counted about 18 percent more triangles at the junction, about 10 percent at the barricade and about 3 percent on open road, and about 20 to 45 more draw calls. I tested them in a software-rendered browser (day, dusk, night, close and far), a physics drive through the junction and up to the barricade, ambient traffic, every graphics mode, and phone layout, with no errors. I have **not** run this on a phone, so tell me if the junction is slow on your Galaxy.
- **1.17.0: the Hatkhamba junction is rebuilt from your photos, the car sits on the road at the start screen, the graphics levels are renamed (High and Ultra) and there is a Custom mode, the night lights are dimmer, there is a frame-rate and ping counter, and trees, plants, grass and textures fade in smoothly**
  **Files.** Only `public/index.html` changed (about 21.7 MB, under GitHub's 25 MB browser-upload limit). `hq-ground.js`, `hq-veg.js`, `hq-trucks.js` and `hq-houses.js` are byte for byte the 1.16.2 files, and `server.js` is unchanged, so upload just `index.html`, or the whole `public` folder as before; commit, and Render redeploys.
  **Hatkhamba Thita, redone from your nine photos.** The first version had the roads in the wrong places. Now, following your marks on the satellite picture: the road you arrive on from the railway station is the long arrival road (white), with Hotel Alankar on its left-hand side as you drive away from the junction towards Ratnagiri (yellow), so on your right as you arrive. The right arm is the Amba Ghat road (NH 166) with the HP petrol pump about 115 m along on its left (red). The left arm is the long road that is closed a few metres in (green): a red-and-white barricade across the whole carriageway, jersey barriers, cones, a parked blue truck and ROAD CLOSED boards, with the road itself running on behind them.
  All three arms are divided roads: a red-soil median with a black-and-white kerb that tapers to a point towards the junction (the soil follows the slope of the road), white edge lines, lane dashes, stop lines and turn arrows, the double yellow centre line where the median has tapered away, street lights along the median, and an 8-head mast light on the nose of the Ratnagiri-road median and on the island at the mouth of the Amba Ghat road. **The middle of the junction is the same dark road texture as the roads, as you asked, not white concrete.**
  Round it stand the buildings and signs from your photos: Hotel Alankar (pillars, shutters, "HOTEL ALANKAR" and bar and lodge boards, the wavy orange band, the red-brick boundary wall, its Marathi billboard, the parked cars in front), the tyre shop, bus shelters, a small temple, tea stalls, a run of small hotels and shops near the sea, the Van Vihar and warehouse side of the Amba Ghat road, the green NH 66 / NH 166 route boards and the overhead "AMBA GHAT · KOLHAPUR" sign. The HP pump is wider now (a 25 m canopy with a solar roof and four pumps) and you can still refuel there. Ambient traffic now keeps to its own carriageway on the divided approaches, turns through the junction on a rounded path and carries on up the first bend of the Amba Ghat road (it turns round out of sight there).
  **Honest notes on the junction.** The scale (about 0.30 m to a pixel of the satellite picture) and every position are estimates from your screenshots and photos, not a survey: shops, poles, boards and the median ends are placed by eye. The real Amba Ghat road bends away after roughly 180 m; here it joins the game's own ghat road after that, so the bend is not the real one. The real junction pavement is concrete; I used road texture because you asked for it. The Marathi writing on the Alankar billboard is drawn with your device's fonts, so a device without Devanagari fonts will show boxes there. I checked it in a software-rendered browser: pictures overhead, from the arms, at the corners, low and at night; the car driven from the main road up the Amba Ghat road and back with no stall, into the closed road until it stops at the barricade, and "back to the road" from the middle of the junction and from the medians; and 300 seconds of ambient traffic, which stayed within about 0.3 m of its lane on the approaches and within about 2 m at the corner itself (a long bus swings widest). I have not driven it on a phone.
  **Graphics levels renamed, and Custom.** What was called **Ultra** is now **High**, and what was called **Epic** is now **Ultra**; each looks and runs exactly as before, only the names changed (the garage, the More tray, the U key, the toast and the hints use the new names). **Normal** is unchanged and **Insane** is still phones only. The older entries below were written with the old names.
  A fifth button, **Custom**, lets you set five things on their own, each at **Normal, High, Ultra or Epic**: **Shader** (Normal draws straight to the screen; High adds HDR lighting, ambient occlusion, bloom, sun shafts and the filmic grade; Ultra adds the cinematic grade, glare, god rays, haze and grain; Epic adds one more level of bloom), **Textures** (from small ground, plant and rock pictures with 4x filtering up to full size with 16x filtering), **Vegetation** (from simpler trees and no ground cover up to dense grass and plants out to 150 m), **Resolution** (Normal, High and Ultra draw at 1.25, 1.5 and 1.75 pixels per screen point on a computer, or 1.0, 1.25 and 1.5 on a phone; Epic draws at your screen's own resolution, scaled by the Resolution slider) and **Shadows** (from the standard map up to sharp 4096 shadows that reach 115 m). A "set everything to" row sets all five at once. Every preset is exactly one setting of the five, so you can start from a preset and lower the one thing that hurts: a phone that cannot run High's shader can still have the best textures and shadows it can afford. Custom never eases itself down (it shows one hint if frames get slow); your choices are saved, but every visit still starts in Normal.
  **Normal at the start.** Every visit starts in Normal, even if you chose a higher level or Custom last time. Pick a level in Settings, Graphics (or with U) for that visit.
  **The car on the road.** Before you pressed Start the game was not working out how the road slopes under the car, so on a hill the body stayed level: the nose sat in the tarmac and the tail hung in the air (up to 16 cm either way in my measurements). It now rests on the road under its four wheels at the start screen, in the garage, after a reset and after a rescue from the sea. At 55 test spots along the main road (11 places, all five vehicles, slopes up to about 5 degrees) the wheels now sit within 2 cm of the surface.
  **Night lights.** At night the headlight beam was so strong that anything pale in front of the car (the station forecourt tiles, a white wall, a tree trunk) turned pure white, and tube lights bloomed into a haze. The headlight strength is now a tenth of what it was and fades more evenly along the beam; the headlamp lenses, the brake lights and the other cars' lamps glow less; lit windows, signs and lamp bulbs are about two thirds as bright; and the extra night bloom in High and Ultra is about a third. The values live in one small table, so if night is too dark or still too bright on your Galaxy, tell me and I will move one number. They were tuned in a software-rendered browser, not on a phone.
  **Frame rate and ping.** Settings, Graphics, "Frame rate and ping": Show puts a small counter at the top of the screen while you drive (green from 50 fps, amber from 30, red below). When you are in a room on your own server it adds your ping in milliseconds next to it (green under 70 ms, amber under 140). The Claude preview room has no ping to read, so only the frame rate shows there. P hides it with the rest of the display; Hidden is the default.
  **Smooth loading.** (1) Trees, palms, bushes, rocks and houses: the last stretch before their draw distance now dissolves (a fine dither, not a blend), so a patch that comes into range thickens as you drive towards it instead of appearing whole. (2) The grass: the clumps that thin out with distance used to pop in at full size one by one; each now grows in over about 25 m. (3) When the plant pack lands after the start, the plants, grass and rocks dissolve in over about two seconds; the ground, road and rock textures (and the leaf-litter sets) blend over the old ground colour in about two seconds; the Konkan houses dissolve in the same way.
  **Not covered, honestly.** A model that changes to a simpler or more detailed version as you pass (a tree at about 40 m and 180 m, a house at 115 m and 340 m, a patch of grass between its three levels) still changes at once; that needs both versions drawn together for a moment and I left it out. The dissolve looks like a fine screen pattern up close in a screenshot; at the far edge it reads as a soft fade. Not measured on a real phone: the dissolve adds a small test to the plants' and houses' pixel shaders, and if you see a drop in frame rate on your Galaxy, tell me. In Custom, Epic textures are the same as Ultra on a computer (Ultra already uses the largest pictures there); Epic vegetation is only a modest step beyond Ultra.

- **1.16.2: the Kawasaki Ninja H2 ("Malvan Supercharged") is removed completely**
  **Files.** Only `public/index.html` changed (about 21.7 MB, under GitHub's 25 MB browser-upload limit; it is about 1.8 MB smaller than 1.16.1). `hq-ground.js`, `hq-veg.js`, `hq-trucks.js` and `hq-houses.js` are byte for byte the 1.16.1 files, and `server.js` is unchanged, so upload just `index.html`, or the whole `public` folder as before; commit, and Render redeploys.
  **What went.** The bike is out of the garage, out of the traffic (the roads now carry cars, buses, trucks and the Honda bike) and out of the parked vehicles (the bikes on side stands are the Honda). Its model, its engine sound and its line in the credits are gone too. The garage now has five vehicles: Kolhapuri Six, Sahyadri Hauler, Alibag Pony, Hapus F1 V12 and Chiplun Classic 750 (the Honda), laid out four across with the fifth on a second row.
  **Honest notes.** I did not find out what was wrong with the Kawasaki's rendering; I took it out, as asked, instead of fixing it. The rider model still contains one unused pose that was made for that bike (it costs nothing to draw). Checked in a software-rendered browser only: the garage lists the five vehicles, all five drive the road at full throttle without stalling, traffic and parked bikes load with no page errors, and no object named after the Kawasaki is left in the scene. Not tried on a real phone.

- **1.16.1: dragging the view now orbits the vehicle, and the game draws less that you cannot see** (trees, rocks, bushes, houses and grass outside the picture)
  **Files.** Only `public/index.html` changed (about 23.5 MB, under GitHub's 25 MB browser-upload limit). `hq-ground.js`, `hq-veg.js`, `hq-trucks.js` and `hq-houses.js` are byte for byte the 1.16.0 files, so you can upload just `index.html`, or the whole `public` folder as before (`server.js` is unchanged); commit, and Render redeploys.
  **Camera.** Before, dragging with the mouse or a finger swung the camera round the vehicle but kept aiming it at the road ahead of the vehicle, so the vehicle slid out of the middle of the picture instead of staying put while the world turned.
  Now the camera sits on a sphere round the vehicle's centre line (about 1 m above the ground) and always looks at it: the distance stays the same at every angle and the vehicle stays in the same place on the screen. Drag sideways to go all the way round (it wraps, so you can keep turning); drag up or down to rise over the vehicle or drop lower behind it (never below the ground).
  A finger turns the view a little faster per pixel than a mouse. After 1.5 seconds without touching the view it eases back behind the vehicle, as before. The bumper and cockpit cameras still look around from the driver's seat.
  **Checked** in a software-rendered browser: at 0, 90 and 180 degrees with a mouse, and at three more angles and tilts from level up to 45 degrees above the vehicle with a finger, the camera stays 7.2 m from the vehicle and the vehicle stays on the middle line of the screen, at most a third of the way down from the middle. A 100 pixel swipe turns the view 39 degrees with a finger and 24 degrees with a mouse; a second finger, or a finger that lands on a button, does not move it. Not tried on a real phone.
  **Is the game only drawing what the camera sees?** Partly before, more now. Before: three.js skipped any object whose bounding sphere was wholly outside the picture, the ground was cut into chunks with distance detail levels, and the grass was only built for a 144 degree cone ahead of the camera. The spheres were loose, though (a chunk partly on screen was drawn whole, and at the sides and behind you much was still drawn), and for the big trees they were also too small: 13 to 34 percent of the broadleaf trees and 11 percent of the banyans had part of their crown outside their chunk's sphere (by up to 9 m), so a tree at the very edge of the picture could vanish a moment early. The grass cone ignored the real field of view, and houses were chosen by distance only.
  What is new: **trees, rocks, bushes** are now tested chunk by chunk with a tight box (every model at its real size, with room for the wind), against both the camera's view and the sun's shadow camera; a chunk outside is not drawn. The bush and boulder chunks are smaller (64 m instead of 128 m), so less is drawn for a chunk that is only partly on screen.
  **Grass** is built for the exact wedge of ground the lens can see (its angle comes from the field of view and the window's shape, so a phone held upright draws a narrow slice) instead of the fixed cone, and its lists are rebuilt after 8 degrees of turning (it was 17). **Houses** more than 130 m away and outside the picture are skipped (nearer ones stay, because their shadows fall into the picture).
  What is not done: things hidden behind a hill or a building are still drawn if they are inside the picture (occlusion culling; WebGL has no cheap way to do it), and the sun shadow pass, which is about a fifth of the triangles, is mostly unchanged (the shadow map surrounds the vehicle, so it does not depend on where you look).
  **Measured** (a software-rendered browser, Ultra, a 480 x 270 window, the same six camera views in the village and at the fort, triangles sent to the graphics card in the main pass; the 1.16.0 build against this one with the same measuring tool): village ahead 2718k to 2226k (18 percent fewer), sideways 2749k to 2430k (12), behind 2686k to 2094k (22); fort ahead 2476k to 1848k (25), sideways 2583k to 1964k (24), behind 3236k to 2588k (20). That is 20 percent fewer on average (12 to 25).
  The grass alone is 19 to 24 percent fewer (21 on average) in that window. On a phone held sideways (a wider window) the wedge is wider, so expect roughly 15 percent fewer grass triangles; held upright, roughly two thirds fewer (both calculated from the same formula, not measured). A rebuild of the grass lists took 0.6 to 2.8 ms in the test browser (a phone is several times slower; it happens once per 8 degrees of turning).
  **Nothing visible was lost.** At 29 camera angles (village, fort and open road; 21 in a 400 x 225 window, level, tilted down and tilted up, and 8 in a phone-shaped 225 x 400 window, level) the picture was compared pixel by pixel with culling switched off: no pixel differed. A control that cut the picture's edges on purpose changed 9 to 22 percent of the pixels, so the comparison does see missing objects. The boxes were also checked against every tree, rock and bush in the world (22 kinds, about 38,600 pieces): all of them fit inside with at least 1.5 m to spare. This caught a mistake of my own: a first version used a generic size and cut the crowns of the biggest trees by up to 9 m.
  **Limits.** Triangle counts, not frame rates, and not on a real phone or a real graphics card: the test browser draws in software. The saving in frames per second depends on whether the phone is held back by triangles (which this helps) or by pixels and shading (which it does not touch; Insane and Epic are mostly the latter).

- **1.16.0: your Poly Haven scans and Sketchfab houses are in: three new village houses, clay-tile roofs and plaster walls on the existing houses, lawns and gardens around homes, new meadow grass and broadleaf plants, sea stacks, roadside rock outcrops and rock platforms on the shore** (Ultra, Epic and Insane get the full set; Normal gets the houses and roofs with colour only, and keeps its lighter ground cover).
  **Files.** Upload the whole `public` folder **and `server.js`** (inside `aareware-server`, next to `package.json` and `render.yaml`), commit, and Render redeploys. What changed: `public/index.html` (about 23.5 MB), `public/hq-veg.js` (about 12.8 MB, the new plants and rocks), **a new `public/hq-houses.js` (about 3.6 MB: the three houses and the tile and plaster pictures)** and `server.js` (it has to serve the new file; without it the new houses do not load).
  `hq-ground.js` and `hq-trucks.js` are byte for byte the 1.15.0 files. Every file is under GitHub's 25 MB browser-upload limit. If `hq-houses.js` is missing or fails to load, the game still runs: the three new houses are swapped for existing house types.
  **Three new houses (CC BY 4.0).** A Goan house with a hipped clay-tile roof and columns ("Traditional House Designing" by ALEXMOt), an unfinished red-brick house ("Under Construction Indian House" by nayan pachori) and a modern two-storey town house with a flat roof and terrace ("house by sawan" by Sawanmithapara878).
  They were rebuilt for the game like the other houses: the walls repaint (the same paint colours as the rest of the village), the windows glow at night, there are three detail levels, and Ultra, Epic and Insane add the normal maps. About 40 of them stand in the villages.
  **Clay-tile roofs.** Poly Haven roof tiles (clay_roof_tiles, clay_roof_tiles_03, roof_tiles; CC0) are laid over the roofs of the existing houses by the house shader, in place of the flat tin, for variety: every cottage "n1" and "n2" gets them, about 55 percent of the "n3" houses and 60 to 70 percent of the stilt houses, so a village shows red tile, dark tile and rusty tin side by side.
  Each house gets its own tint and brightness, and the tiles show relief in Ultra, Epic and Insane (colour only in Normal).
  **Plaster walls.** Poly Haven plasters (red_plaster_weathered, blue_plaster_weathered, worn_mossy_plasterwall, white_stucco, plaster_stone_wall_01; CC0) give the painted town houses and the new modern house a fine plaster grain, stains and relief under your paint colour, in place of the plain painted pattern. Close up only: the two nearest detail levels.
  **Grass, lawns and garden plants.** `grass_medium_01` adds new tufts to every meadow, `grass_bermuda_01` is a short lawn grass, and `anthurium_botany_01` is a broadleaf garden plant. Around houses the ground cover now turns into a yard (lawn with sorrel and dandelions, or a "tropical" mix with the broadleaf plants and ferns), so homes sit in gardens instead of wild meadow; the plants also grow in damp hollows.
  **Rocks.** `coast_rocks_02` adds sea stacks and reefs along the shore; `coast_land_rocks_03` adds weathered laterite outcrops (about 80) beside the roads and along the shore, which you cannot drive through; `coastal_cliff_04` is used as about 40 low rock platforms at the waterline, front to the sea.
  A first try that stood the cliff scan against the headland slopes looked wrong (it is a flat-topped block, not a cliff face, and it hung in the air), so it is used as shore platforms instead.
  **Credits.** The game's credits panel and `CREDITS.md` list the three houses and every new scan.
  **Limits.** Not measured on a real phone or a real graphics card: it was checked in a software-rendered browser (pictures of the houses, roofs, plaster, plants, rocks and the missing-pack fallback), so the real frame rate is not known.
  The rock picture is bigger now (2048 x 5632 at full size; Insane on a phone uses 1536 wide, 4224 tall), so a phone whose graphics limit is 4096 pixels could not load it at Insane; Epic and below use smaller sizes.
  Three of your houses are not used yet: `indian_house_old` has its lighting baked into the textures, `old_house` is a 68 MB model, and `indian_house_model` has a ground slab under it; each needs its own clean-up.

- **1.15.0: "Insane", a fourth graphics level for phones that draws at your screen's full resolution** (computers keep Normal, Ultra and Epic; Epic itself is unchanged).
  **Files.** Only `public/index.html` changed (about 22 MB). `hq-ground.js`, `hq-veg.js` and `hq-trucks.js` are byte for byte the 1.14.0 files, so you can upload just `index.html`, or the whole `public` folder as before; Render redeploys.
  **Why Epic looked blurry on a phone.** Ultra and Epic drew phones at 1.25 pixels per screen point to keep them cool and smooth. On a Galaxy S25 Ultra (about 412 x 915 points at 3.5 pixels each, so 1442 x 3203 real pixels) that is about
  0.6 million pixels out of 4.6, stretched roughly 2.8 times in each direction, which is what softens the textures and gives the leaves their staircase edges. The plant, rock and sky pictures were also kept smaller on phones (plants 1024 instead of 2048, rocks 1024 instead of 1536, the sky 1536 instead of 2048).
  **Insane.** Settings, Graphics: a fourth button, shown on phones only (the Graphics button in the More tray cycles Normal, Ultra, Epic, Insane). It is Epic's top setting drawn at the screen's own resolution, with the plant, rock and sky pictures at the sizes Epic uses on a computer,
  16x texture filtering and one more level of glow (bloom) so the glow keeps its size. Under the buttons a **Resolution** slider (50 to 100 percent, 100 is the full screen, saved between visits) says how many pixels are drawn, for example 1442 x 3203 (4.6 million) at 100 percent.
  **It is heavy.** Insane needs much more graphics memory and power than Epic: expect a warm phone and a faster battery drain, and a frame rate that can drop below 60. Unlike Epic it never eases itself down; if it stutters, lower Resolution (70 to 80 percent is a good first try) or pick Epic.
  After 45 ms frames it shows one hint saying so. The ground textures are already at their largest in Epic, so there Insane adds only the finer sampling.
  **Safety nets.** If the page closes before Insane has drawn 30 frames over 20 seconds, the next visit starts in Epic and says why. If the browser drops the graphics context while you play Insane, the page restarts in Epic.
  **Not measured on a real phone.** It was tested on a software-rendered emulation of a 412 x 915 screen at 3.5 pixels per point: the levels, sizes and switching work and the pictures are clearly sharper than Epic's, but the real frame rate on a Galaxy S25 Ultra is not known.
  **Fix.** Switching between Epic and Insane re-decodes the sky pictures; the old ones were released before the environment lighting was rebuilt from them, so it was built from blank pictures (and the browser printed graphics warnings). The sky now moves to the new pictures first.

- **1.14.0: the Kawasaki Ninja H2, a golden-hour sky and sea, drooping coconut palms, a forest floor of dry leaves with fallen branches, a calmer dirt, a draw-distance setting, and no code-built vehicles left** (Ultra and Epic get the new ground; Normal and phones keep the lighter scene).
  **Files.** The same four files as 1.13.0; upload the whole `public` folder again (inside `aareware-server`, next to `server.js`, `package.json` and `render.yaml`) and commit; Render redeploys.
  `index.html` is about 22 MB, `hq-ground.js` about 19 MB (it carries the three new ground sets), `hq-veg.js` about 8 MB (the branches and the sand patch) and `hq-trucks.js` about 3.3 MB:
  every file is still under GitHub's 25 MB browser-upload limit. If a pack file is missing the game still runs without that part, as before.
  **New bike.** The Street Triple is replaced by your **Kawasaki Ninja H2** ("Malvan Supercharged", model "Kawasaki Ninja H2 [free]" by Anshuman Dutta, CC BY 4.0): drivable and also riding in the traffic.
  The download was a ripped scene with 35 loose meshes and no textures, so it was rebuilt for the game: moved onto the ground, split into body, front fork (which steers), wheels and a lighter level,
  with its 22 flat colours folded into nine materials. The fairings are the paintable part in the garage (it starts in Midnight); the glossy panels have their reflection of the sky toned down so they do not turn silver at noon.
  **Handlebar fix.** At low speed the fork and bars turned the wrong way (A turned the bike left but the bars right). They now follow the steering on every bike.
  **Camera.** The bike chase camera sits further back (the cars and the rest keep theirs).
  **Detail distance.** Settings, Graphics: a new slider, 50 to 300 percent, stretches how far the high-detail models are drawn (trees, houses, vehicles); the draw distance itself does not change, and the grass keeps its own range.
  The line under the slider shows the distances in metres. It costs frame time: in Epic, doubling it adds roughly a third more triangles on the road and tripling it about two thirds more (measured on the test machine, not on a phone).
  **Old vehicles gone.** Every vehicle is now one of the supplied models; the code-built stand-ins are removed.
  **Forest floor (Ultra and Epic).** Three more Poly Haven scans (CC0): leaf litter, wet mud with leaves and a second coast sand. Under the groves and the Ganpatipule hill forest the ground is now dry leaf litter,
  patches of mud break up the bare soil, and the beaches carry a second, pebblier sand. The grass thins out under the trees so the litter shows between the clumps, and the baked ground colour under the woods is browner to match from far away.
  **Fallen branches and pebbly sand.** Two more scans: dry branches (piles of two or three under the broadleaf trees, banyans and pines, along the verges, and driftwood on the beaches, lying along the contour so they rest level)
  and patches of pebbly sand (on the beaches and beside the roads), 3 D models you can see standing out of the ground. They are Ultra and Epic only.
  **Calmer dirt.** The laterite is a browner colour (it was a brick red that glowed orange at golden hour), and the mud patches break it up further.
  **Golden hour.** The drifting clouds now also show over the four photographed skies (before, those skies hid them), and around sunset there are more of them: the sides facing the sun glow orange and the shadowed undersides go violet.
  In Ultra and Epic the sea mirrors this: the sunset band glows in the water, the clouds are reflected in orange, the turquoise turns a darker teal-green in the low light and the foam warms up.
  **Coconut palms.** The fronds of the realistic palms now arch over and hang like a coconut's (the old fronds low in the crown hang more than the young ones on top), and every palm bends its trunk and curves its crown a little differently.

- **1.13.0: your trucks, four real skies, soil instead of the white pads, brown trunks, rock cliffs, soft grass, and traffic that drives like traffic** (Epic and Ultra get the full set; Normal and phones the lighter version).
  **New file: `public/hq-trucks.js` (about 3.3 MB).** It carries the two truck models. It sits next to `public/index.html`, `public/hq-ground.js` and `public/hq-veg.js`; the game
  fetches it after it starts. **Upload the whole `public` folder to GitHub, including `hq-trucks.js`,** inside the `aareware-server` folder together with the server files
  (`server.js`, `package.json`, `render.yaml`), then commit; Render redeploys. `hq-ground.js` grew to about 15 MB (four skies and the cliff surfaces), `index.html` is about 22 MB and
  `hq-veg.js` about 7 MB: every file is still under GitHub's 25 MB browser-upload limit. If a pack file is missing the game still runs: no `hq-trucks.js` means no trucks yet (traffic
  slots stay empty and parked trucks appear when it arrives); no `hq-ground.js` means the plain ground and the painted sky; no `hq-veg.js` means no ground cover or boulders.
  **Trucks.** The Renault Premium box truck and the KrAZ-250 cement carrier (both from the files you added) replace the old code-built trucks in the traffic and in the parking lots.
  Real wheels that turn (twin rear tyres are one unit), working head and tail lamps, collision circles along the body, and three detail levels (the far one is a few hundred triangles).
  **Rickshaws removed.** The auto-rickshaws are gone from the traffic, the parking lots and the code.
  **Traffic that drives like traffic.** Every car, bus, truck and bike now steers with a bicycle model: the heading changes only through the steering angle, so turns are smooth arcs
  instead of the body snapping round. The front wheels show the steering, all wheels roll at the true speed, the body pitches under braking and leans in bends, each vehicle
  follows its lane with pure-pursuit steering and keeps its distance with a braking model (heavier vehicles accelerate and turn more slowly).
  **Skies.** Four Poly Haven "Pure Sky" pictures replace the two from 1.11.0: Qwantani Sunset for sunrise, golden hour and dusk, Scythian Tombs (thin cirrus) for morning and late
  afternoon, Pizzo Pernice (clear deep blue) for midday, and Snow Field 2 (heavy grey cloud) for overcast and rain. Each is turned so its sun sits where the game's sun is, and its
  brightness is matched to the time of day. They also light the scene. Night still uses the painted sky.
  **No more white pads.** The pale round patches at the petrol pumps, the beach stops, the top of Amba Ghat and the fort are now soil (the ground's own dirt texture).
  **Trees.** Trunks and branches are brown and only the leaves are green (the whole tree used to be tinted green). The cartoon broadleaf trees are gone: four realistic broadleaf trees
  (two from each pack you added) stand in the forests, along the roads and inside the fort. They have three detail levels (about 4,500 / 1,200 / 200 triangles) and a small leaf atlas; the
  detail level is chosen per 64 m cell around you, so full-detail trees are drawn only in a tight ring near the car.
  **Rock cliffs.** Steep ground (the sea cliffs under the Bhagwati fort, the ghat walls, rocky banks) is now shaded with real rock surfaces (cliff side, cracked boulder, mossy rock, coast
  rocks) in red-brown laterite tones, instead of a flat colour. Epic uses 1024 colour and 512 normal maps, Ultra 512 colour, Normal keeps the old look.
  **Soft grass.** The hills and the road verges carry softer, fuller grass in a pale-to-golden green, the Forza Horizon look you asked for.
  **Optimisation.** In the thickest forest at Ganpatipule a phone view (Ultra) is about 5.2 million triangles including shadows, desktop Epic about 6.5 million. (The first version of the new
  trees had put the phone view at 12 million; 1.12.0 was 4.4 million.) If a phone is slow, the game already thins out distant plants on its own; `src/scatter.js` (`ch`, the tree ranges)
  and `assettools/prep_trees3.mjs` (`LEAF_TRIS`, `BARK_TRIS`) are the knobs.
  **What is not there.** The two coastal_cliff meshes you added are not placed in the world yet (the cliff surfaces use the rock textures only); Epic still needs the graphics card
  set to the RTX 3050 (not the integrated one). I could only test with a software renderer here, so real frame rates on your phone and laptop are unmeasured.
  Credits: the trucks (Max, Randonavt) and the trees (Nicholas-3D) are CC BY 4.0, the skies and rock surfaces are Poly Haven CC0 (see `CREDITS.md` and the menu's *Info* page).
- **1.12.0: every plant and rock is a real scan now, and the ground is covered in them** (Epic gets the full set; Ultra a lighter one; phones a thinner one).
  **New file: `public/hq-veg.js` (about 7 MB).** It carries the plants and rocks (geometry and texture atlases). It sits next to `public/index.html` and
  `public/hq-ground.js`; the game fetches it after it starts. **Upload the whole `public` folder to GitHub, including `hq-veg.js`** (every file is under GitHub's
  25 MB browser-upload limit). Without it the game still runs, with no ground cover, bushes or boulders.
  **Removed.** All the plants, rocks and coconut palms I had made from code are gone: the grass tufts, shrubs, flower bushes, the old box-and-leaf palms and the
  two palm models from 1.10.0 (so the CC BY-SA leaning palm is no longer in the game). Every coconut palm is the realistic one now. The towns' trees (Hatkhamba,
  the station, Station Road) use the downloaded palms and trees too.
  **Ground cover (Epic, Ultra, phones).** Grass, weeds, ferns, nettle, periwinkle, celandine, dandelions, small shrubs, sorrel, moss and pebbles from Poly Haven, as
  real 3D plants (not flat cards), grouped into clumps and spread over every patch of grass and laterite around you, thicker beside the road, wetter patches
  get ferns and moss, dry headland patches turn straw-coloured. Nothing is stored for the whole map: the clumps are generated around the camera as you drive
  (64 m cells, always the same for the same place) and drawn with three detail levels, so memory and draw calls stay small. Plants sway in the wind, let sun
  through their leaves and sink into the ground at the far edge instead of popping out.
  **Bushes, boulders and rocks (all modes).** Cashew scrub and hedges are Poly Haven shrubs with a skirt of small plants round them. Boulders sit along the verges and on the
  rocky shores, rock faces are set into steep banks beside the road, reef slabs lie off the rocky beaches, and the sea stacks and Bhagwati fort cliffs are tall
  boulders. All of them are tinted red-brown like the laterite coast.
  **Optimisation.** Instancing everywhere; one draw call per plant type and detail level for the ground cover (about 15 in all); plants and rocks share two texture
  atlases (decoded at 2048 on Epic, 1024 on Ultra, 512 on Normal; phones the same as the mode). Epic draws about 3 million ground-cover triangles in view on a PC
  (a third to half of that on a phone); the ranges are in `src/vegfield.js` (`QS`) if the frame rate is too low: lower `dens` or the `R` radii.
  **What is not there.** No new broadleaf tree model was supplied, so the hill and grove trees are the same three as before (treea, treeb, banyan), and the flowering trees
  along Station Road now use them too. Epic needs the graphics card set to the RTX 3050 (not the integrated one).
  **Colour.** Coconut palms, trees, bushes and the grass are tinted a deeper green (the palm texture is yellow-green, which read as parrot green); only the dry patches stay straw.
  Credits: Poly Haven plants and rocks are CC0 (listed in `CREDITS.md` and in the menu).
- **1.11.0: real scanned ground, road and sky, new realistic trees, and trees everywhere** (Ultra and Epic get the full set; Normal gets the lighter version).
  **New file: `public/hq-ground.js` (about 13 MB).** It carries the 2K ground, laterite, sand and asphalt materials and the two HDRI skies. It sits next to
  `public/index.html` and the game fetches it after it starts, so the game opens as fast as before and the better ground and sky fade in a few seconds later.
  **Upload the whole folder to GitHub, including `hq-ground.js`** (each file is under GitHub's 25 MB browser-upload limit: `index.html` is about 21 MB). If that
  file is missing the game still runs and looks like 1.10.0 on the ground and sky.
  **Ground and roads.** Photo-scanned materials with real normal maps and roughness: gravel and grass-path ground, red laterite on the verges and slopes, coast sand
  on the beaches and dunes, and two asphalt materials (fresh and worn, mixed in patches). Each tile is blended with a rotated copy of itself so the repeat does not
  show. They sit on top of the existing colours, so the world keeps its look: dry headlands stay straw-coloured, the forest floor stays dark.
  **Sky (Ultra and Epic).** Two real HDRI skies: clear blue for morning and noon, a cloudy sunset for golden hour and dusk. They are turned and stretched so the sun sits
  where the game's sun is, fade into the old horizon colour so the fog still matches, and light the scene (reflections and ambient light). Rain, overcast
  and night still use the painted sky.
  **Trees.** Three new models: a realistic coconut palm (half of all palms), banana plants (village yards and plantation patches) and pines / casuarina (beach
  backshore and high ground). Palms, broadleaf trees and shrubs are denser, and every road now has trees along both verges.
  **Optimisation.** Everything uses instancing with three detail levels; the new trees have lean far versions (a pine is 4,000 / 875 / 179 triangles near to far), the
  big textures are decoded at the size the graphics mode needs (Normal 512, Ultra 1024, Epic 2048 for colour; normal maps 512 / 1024 on Ultra / Epic and none on Normal),
  and the ground shader skips the detail work beyond 800 to 1,400 m. Expect about a third more vegetation triangles than 1.10.0 at the busiest spots.
  This is a big step up in realism, but it is still a browser game: it is not GTA 6 (no ray-traced lighting, no photo-scanned buildings or cars).
  Credits for the new models, textures and skies are in `CREDITS.md` and in the menu (*Info* page): Palm Tree Realistic (00amza), Banana tree (Alnazir), Pine Tree
  (BazukaliKartal) are CC BY 4.0; the Poly Haven textures and skies are CC0.
- **1.10.0: a tabbed menu, a closer camera, new bikes, the rider, your bus and ground textures** (Normal, Ultra and Epic alike).
  Credits and licences for every new model are in `CREDITS.md` and in the menu (*Info* page).
  **Menu.** The garage is now a pause menu in the style of GTA 5: a black tab bar (the open page is a white block) with seven pages,
  *Play* (name, your ride, weather, graphics mode), *Vehicle* (eleven vehicles, stats, colours, gearbox), *Online* (create a room, join with a
  code, voice chat), *Graphics*, *Audio*, *Controls* (the key map, or the touch options on a phone) and *Info* (credits). The *Start driving* /
  *Resume driving* button sits in a bar at the bottom of every page. On a desktop Q and E switch pages, the left and right arrows pick a vehicle on the
  Vehicle page and Enter starts; on a phone the tab bar scrolls sideways and the menu keeps its landscape and portrait layouts.
  **Camera.** The chase camera sits closer and lower, like the GTA 6 view you sent: a tighter lens, the car low in the frame and the horizon
  mid-screen. It no longer drifts back and up at speed (at 200 km/h it sits less than a metre further back than at a standstill).
  **Ground.** The grass is the "Realtime Grass" texture and the dirt is the "Soft Dirt" texture you sent, blended by the same terrain
  rules as before (grass on the green land, dirt on tracks, cuttings and the ghat hillsides).
  **Vehicles.** The cars, the bus and the bikes on the road are now our own models, the same ones you can drive (the old boxy stand-ins are gone,
  also for the parked cars, buses and bikes in the villages and at the station; the autos and tempos stay as they were, there was no model for them). The city bus is your "Indian Bus 1", recoloured red and black. New bike: the
  **Honda CB 750 F Super Sport 1970** ("Chiplun Classic 750", a four-cylinder with its own sound, drivable and also riding in the traffic).
  **Hapus Triple** is now your **2013 Triumph Street Triple 675** (drive only, not in the traffic; it keeps the paint of the scan). Drivers
  and riders are your **rider.glb**, posed for each seat: in every car you drive, on both bikes, and on the Honda in the traffic.
  **Suspension.** Every moving vehicle (the traffic cars, bus and bikes, ours and other players') follows the slope of the road under
  its axles, so none of them dips its nose into a crest or a rise.
  **Graphics modes.** Normal is the standard look and the lightest. Ultra is the highest quality that stays optimised: HDR lighting, ambient occlusion, bloom, sun
  shafts, sharper vehicle textures (8x filtering) and adaptive sharpening. Epic is everything at its highest: Ultra plus the cinematic layer, upscaled and sharpened vehicle textures
  with 16x filtering, vehicles in full detail 1.6 times further away, wider shadows and the strongest sharpening. Ultra and Epic still ease down by themselves
  if the frame rate suffers.
  **Rooms.** The server now accepts the eleventh vehicle (the Honda) in rooms. Replace `server.js` together with `public/index.html` when you update.
  **Things to know.** The Triumph scan has its paint baked into the photo texture, so the colour swatches are hidden for it. The three new bike / rider / bus
  models are CC BY 4.0. The game page is about 20 MB now (GitHub's web upload accepts files up to 25 MB).
- **1.9.0: your houses, trains, track and trees are in the game** (Normal, Ultra and Epic alike).
  Credits and licences for every new model are in `CREDITS.md` and in the garage (*Credits and licences*).
  **Houses.** All the plain box houses along the coast road, in the hamlets and in the Ganpatipule beach village are gone: every house
  is now one of your models. The five rusty-roof houses are joined by a gabled cottage ("House"), the small old stilt house, four modern
  villas (flat roofs, big glass fronts, mostly in the Ganpatipule lodge area), a row shop, and a small farm shed that stands beside some
  houses. Each house is recoloured on its own (pinks, blues, ochres, greens and plain weathered wood), windows glow at night, it
  sits on the slope without floating, and it has three levels of detail so that far houses cost very little.
  The small roadside stalls and kiosks are still simple boxes. Hotel Alankar and the Hatkhamba junction were left exactly as they
  were (only the trees around them are the new tree models).
  **Trains.** The trains at Ratnagiri station are your models: a yellow, red or green diesel locomotive (Dr14), passenger coaches
  (blue with cream, and maroon with gold) and tank wagons in white, black, green and rust. Three trains stand in the three platforms,
  each with its own colours; every wagon is recoloured separately and the paint is masked, so windows, wheels and rust keep their own
  look. They stand still (they do not run). They are solid: the cars cannot drive through them.
  **Track.** The station yard now uses your track model (ballast, sleepers, rails; the sleepers were turned concrete grey). From the
  yard two long lines run away in both directions: one to the south, toward the Amba Ghat side, and one to the north, toward
  Ganpatipule. Each is about 3 km long and runs on until it ends in the distance. You cannot drive onto them: the land
  is graded into a flat bed with red cuttings on the hills, a fence runs along both sides, and striped barriers close the lines at the
  ends of the yard. They are meant to be looked at, from the platforms or the hills beside them.
  **Trees.** The palms on the beaches, in the villages and in the Ganpatipule forest are your two coconut models (an upright one and
  a leaning one, tinted so each tree is different). The hill and grove trees are your two broadleaf tree models and the large shade tree. The
  dense stretch along the Ganpatipule temple road is a mix of coconut palms and the other trees.
  **Things to know.** The tank wagon is under the Sketchfab "Standard" licence; both are
  explained in `CREDITS.md`. The tiles-shop model you sent is not used (its signs name a real Australian company). The game page grew by about
  5 MB because of the new models (it is now about 16.6 MB; GitHub's web upload accepts files up to 25 MB).
- **1.8.0: Android and iPhone.** The game now plays in a phone browser, with on-screen controls and a garage built for a touch
  screen. See *Playing on a phone or tablet* above for how it is used.
  **Controls.** Steering arrows (or a slider, or tilt), gas and brake pedals, handbrake, horn, camera, a hold-to-confirm "back to the
  road" button, a More tray for everything that had a key on the keyboard, shift buttons for the manual gearbox, a refuel button, and
  look-around by dragging the view. All the buttons work at the same time, so you can steer, hold the gas and pull the handbrake together.
  **Layout.** The garage has a pinned *Start driving* button, bigger touch targets, and its own arrangement for landscape and portrait,
  with the car shown beside the menu (landscape) or above it (portrait); it respects the notch and the home-bar area. On the road the speedometer is now a
  short card in the top right, above the Hand and Horn buttons, with speed, gear, an RPM bar and the fuel bar (the round dial stays on
  desktop). The room chip moves next to the top buttons and lists only the person who is talking.
  **Phone profile.** Lighter defaults on phones (see above), a frame limit on high-refresh screens, and an automatic step-down of the
  render resolution before anything else is cut. The room connection is rebuilt when the phone wakes up or the network returns.
  **Home screen.** The server now serves an install file and icons, so "Add to Home Screen" gives a full-screen app with its own icon.
  **A fix that also helps on desktop:** the faded-out garage menu used to keep catching clicks and taps where its buttons were; on a
  phone that sat right on top of the steering arrows. It no longer reacts to anything once it is hidden.
  **What I could not check.** I tested on emulated phones (a Pixel 7 and an iPhone 14, in both orientations) in a desktop Chrome
  that draws in software, with scripted multi-finger input and fake tilt-sensor readings for all four screen rotations. That checks
  the layout, the multi-touch handling and the tilt maths. It does not tell you the frame rate on a real phone, and I had no Safari
  to test with, so the iPhone-only behaviours (sound waking up after a touch, the tilt permission pop-up, Add to Home Screen full
  screen) are written to the documented behaviour but have not been seen working. Tilt direction was checked against the sensor
  convention, not a real sensor: if it turns the wrong way on your phone, switch on *Reverse tilt*. The shared Claude page runs the
  game inside a frame, where the browser may refuse full screen; the server version is the one to use on a phone.
- **1.7.0: your models and textures are in the game, in Normal, Ultra and Epic alike.** Credits and licences are in
  `CREDITS.md` and in the garage (Esc, bottom of the menu, *Credits and licences*).
  **Cars.** The garage now has ten vehicles. Four are built on the models you sent: **Kolhapuri Six** (Mazda 6 sedan, 2.5 L,
  front-wheel drive), **Sahyadri Hauler** (Ford F-150 pickup, 3.5 L twin-turbo V6, four-wheel drive), **Alibag Pony**
  (1965 Mustang convertible, V8, rear-wheel drive, 4-speed) and **Hapus F1 V12** (McLaren F1, 6.1 L V12, rear-wheel drive,
  driver in the centre seat). Each one drives like the real car as far as a browser game can: its own mass, power and
  torque curve, gear ratios, brakes, tyre grip, centre of gravity and body roll, and its own engine sound (still made inside
  the game). The pickup is heavy and does not mind bumps, the Mustang is loose, the McLaren is extremely fast and
  twitchy, so be gentle with the throttle, especially in the wet. The models were optimised (compact files, WebP
  textures), the body takes the colour you pick, the wheels roll and steer, and the head and tail lights come on. In the
  cabin, the model's own steering wheel is part of the dashboard and does not turn (only the Mazda gets a simple wheel that
  does). The four models have the steering wheel on the left, because that is how they were made; the game drives on the left.
  **Houses.** Five of your wooden and tin-roof houses now stand along the coast road next to the old procedural ones. After
  your feedback they are 1.3 to 1.6 times bigger than at first. Each house is recoloured per building, its windows glow
  at night, and it has three levels of detail so far-away ones cost very little.
  **Brick tower block.** The building you sent is a ten-storey brick block with a fire escape. Four of them stand along
  Station Road with shops (awnings and signs) on the ground floor and tanks, solar panels and a lift room on the roof.
  Each building has its own cream, terracotta or pale-green paint, and each window is lit or dark on its own in the evening
  (a few with a cooler tube light), different in every building.
  **Roads.** The asphalt grain of your road photos is on every road in all three modes (Ultra and Epic also use it for
  bump and for how the surface shines when wet). The coast road and the ghat now have a **double yellow centre line**
  where overtaking is unwise: tight bends, through the bigger villages, near the beach car parks and the Hatkhamba
  junction, and the whole ghat. Elsewhere you still see the white dashes. There are **seven zebra crossings with stop lines**
  across the coast road at the bigger villages (each moved to a straight stretch clear of junctions). They and the crossings on
  Station Road are painted with the worn white bars of your crosswalk picture. All of it gets the same wet look, night
  look and Epic wear as the other markings.
  **Other changes.** The server now sends the page compressed (it is about 11 MB with the models) and lets a returning
  browser skip the download when nothing changed. Tower windows no longer flicker at dusk.
  **What I could not check.** Everything was tested in a browser rendered by software on a server, without a graphics chip,
  so the frame rate on a laptop RTX 3050 is not measured. Epic still watches its own frame rate and eases down. In Windows
  make sure the browser uses the RTX (Settings > System > Display > Graphics > your browser > High performance).
  **Licences to look at before you share the game publicly** (details in `CREDITS.md`): the McLaren is CC BY-NC (non-commercial
  only), the F-150 has Sketchfab's "Standard" licence (fine for playing with friends, not for passing the model on), and the
  crosswalk picture's source was not recorded. Remove those models if that matters to you.
- **1.6.0: Epic graphics (a third Graphics mode, after Normal and Ultra).** Pick **Epic** in the garage (Esc), or press **U**
  to cycle Normal, Ultra, Epic. It builds on everything Ultra does and aims at the look of the GTA 6 trailer screenshots you
  sent: a low golden sun with long soft shadows (the shadow reach is 100 m), warm haze that thickens with distance and glows
  towards the sun, a sun glare with a soft veil and a faint streak, longer light shafts, a filmic colour grade (cool shadows,
  warm highlights, a touch of film grain and lens fringing), stronger ambient occlusion. The sky has clouds that shade
  themselves (bright rims, dark undersides) and a warm band on the horizon. The sea mirrors the clouds, has a long swell,
  whitecaps, light glowing through the waves and moving caustic lines in the shallows, and darker wet sand on the shore.
  On land: ground with straw-coloured patches, pebbles and grit; asphalt with worn lane lines, polished wheel tracks,
  repair patches with sealed edges, tar-filled cracks and sand blown over the edges; houses with mud splashes and algae at the
  foot of the walls, rain streaks under the eaves, moss on the tiles and rust streaks on the tin; denser, lusher plants with
  red-flowering trees along the roads and round the villages, bougainvillea at the walls, and grass tufts along the verges;
  weathered wooden post-and-rail fences round the beach car parks, reflector posts along the coast road, two short road-works
  shoulders with cones and barriers, and striped beach umbrellas with folding chairs.
  **What this is and is not:** everything is made inside the game from code (no GTA 6 textures or models, which are not
  mine to copy, and the game has no way to download images). The look is inspired by your screenshots, but the cars, bikes,
  houses and trees are still this game's own simple models, so expect a big step up from Ultra, not photographic GTA 6.
  Epic is the heaviest mode. It needs the same HDR support as Ultra and a stronger graphics chip (a laptop RTX 3050 should
  manage; on a laptop make sure the browser uses the RTX, in Windows: Settings > System > Display > Graphics > your browser >
  High performance). It watches its own frame rate: if it cannot keep up it eases down two steps inside Epic, then falls back to
  Ultra, then Normal. Normal and Ultra look and run exactly as before. Voice chat, rooms and other players are unaffected.
- **1.5.1: voice chat and the game sound (read this first).** Pressing *Join voice chat* made the whole game sound
  like a phone call. The game's sound is generated inside your browser and mixed on your own computer, so it cannot
  be going through a server. The cause that fits is the Bluetooth headset switching to its phone profile when its
  microphone opens (see Voice chat above), plus Windows lowering other sounds during "calls". This version adds the
  **Microphone** picker, makes *Automatic* avoid a Bluetooth headset's microphone when another one exists, adds
  **Listen only**, and shows a note when the sound output looks like it is in phone mode. I could not hear a Bluetooth
  headset where this was built: the logic was tested with a fake microphone and fake device names, two browsers
  and this server. If it still sounds like a call, use *Listen only* once: if the sound is clean then, it is the
  headset's microphone, and a laptop or USB microphone (or, in Windows, Control Panel > Devices and Printers > right-click the headset > Properties > Services >
  untick "Handsfree Telephony", which gives up the headset's own microphone for good) is the fix.
- **1.5.1: road signs point the right way.** Every board used to be one picture shown on both faces, so the arrow
  was right from one direction and backwards from the other, and some signs stood past the junction they
  announce. Now each board faces one direction of travel (the back is plain grey), stands on the left verge for that
  direction (traffic keeps left), and its arrow and distance are worked out from where the side road really leaves:
  left or right, far boards about 250 m ahead and near boards about 40 m ahead, plus "ahead" boards for Ganpatipule,
  Bhagwati fort and Hatkhamba. The Station Road, Hatkhamba and temple/fort name boards, the hoardings and the painted
  lane arrows were fixed the same way. Checked by a script that walks every board and by driver's-eye pictures.

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
  platforms with canopies and signs, three tracks with ballast and overhead wires, and three trains of your models (see 1.9.0 below). Everything solid is solid for
  the cars (the porch stops you; you can drive round the ends). A few cars and autos drive on Station Road in both directions.
  The map's minimap shows the station and the junction. At night the road and the forecourt are lit by soft pools of lamp light.
  This is a procedural model made from your photos and notes: it matches the layout and look (colours, columns, signs), not
  every detail, and the emblem is a generic badge, not the real Konkan Railway logo.

- **Graphics: Normal and Ultra (Epic was added in 1.6.0, above).** The garage (Esc) has a new **Graphics** switch, and **U** flips it while driving.
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
