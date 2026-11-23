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
  also lowers its resolution by itself if the frame rate drops. **Normal** graphics is the one to use on a phone. Ultra and Epic
  can still be chosen but will be slow on most phones. **Insane** (a fourth button on phones only) draws Epic at the screen's full resolution: the sharpest
  picture and by far the heaviest, meant for a flagship phone; its Resolution slider lowers the load if it stutters. The page is about 22 MB, so the first load on mobile data takes a moment
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
