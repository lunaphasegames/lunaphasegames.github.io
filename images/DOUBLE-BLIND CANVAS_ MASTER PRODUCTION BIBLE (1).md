# 

DOUBLE-BLIND CANVAS

## **THE MASTER PRODUCTION BIBLE (GDD)**

**Version:** 2.0.0 (Steam Next Fest Target — August 2026)  
**Studio:** Independent Party Games Division  
**Target Platform:** PC (Steam Exclusive Marketplace)  
**Engine Architecture:** Unity 6.3 LTS (`6000.3.19f1`) — URP 17.3.0 & Netcode for GameObjects (NGO) 2.13.0  
**Network Topology:** Heathen Steamworks + Steam Networking Sockets (P2P Host/Client)  
**Voice Chat:** Dissonance Voice Chat (Spatial Proximity VOIP with Room Channels)  
**Steamworks SDK:** Steamworks.NET 2025.163.0 via Heathen Toolkit (Complete 2025)  
**🎯 Release Target:** Steam Next Fest — **October 19–26, 2026** (11 weeks from current date)

*CONFIDENTIAL & PROPRIETARY. DO NOT DISTRIBUTE.*

# ---

**1\. EXECUTIVE SUMMARY & MARKET POSITIONING**

### **1.1. The Elevator Pitch**

*Double-Blind Canvas* is a fast-paced, 3D first-person and third-person multiplayer social deduction game. Players are locked inside a sterile, clinical observation room and forced to collaboratively paint a specific prompt on a massive wall using physics-based paintball guns. The core gameplay hook is absolute epistemic uncertainty: no one knows if they are the traitor. The majority (Painters) receive the true word; the minority (Spies) receive a visually clashing decoy word. Players must deduce their own roles based entirely on the chaotic artwork taking shape before them, culminating in a paranoid, high-stakes voting phase.

### **1.2. Target Audience & Demographics**

**Primary Audience:** Core PC gamers aged 16-35. These players frequently use Discord, consume content on Twitch and YouTube, and regularly purchase multiplayer party games to play with their friends on weekend nights.  
**Psychographics:** Fans of the "Friendslop" genre (*Lethal Company, Content Warning, Phasmophobia*) and modern social deduction games (*Among Us, Town of Salem, Secret Hitler*). These players value emergent, comedic narratives over highly competitive, skill-based gameplay. They want to laugh at their friends' mistakes.

### **1.3. Competitive Analysis & Market Positioning**

The social deduction market is heavily saturated, but it suffers from a massive pain point: **Traitor's Anxiety**. In games like *Among Us*, being the Imposter causes significant stress for many players because they are forced to actively lie, manipulate, and deceive their friends from second one. *Double-Blind Canvas* completely removes this anxiety.  
In our game, the Spy genuinely believes they are a Painter until the visual evidence on the canvas proves otherwise. This paradigm shift lowers the barrier to entry significantly. Furthermore, by translating the 2D drawing mechanics of games like *Gartic Phone* into a physical, messy 3D space with ragdoll-lite characters, we create a highly streamable, highly clippable experience tailored for modern content creators.

### **1.4. Business Model & Monetization Strategy**

The game will operate on a premium **Buy-to-Play (B2P)** model on Steam (estimated $4.99 \- $9.99 USD depending on regional pricing). There are **ZERO microtransactions (No MTX), no loot boxes, and no battle passes**. Player retention is driven by unlocking cosmetics (Hats, Gun Skins) entirely through gameplay milestones and Steam Achievements. Post-launch revenue may be supplemented through large, high-value cosmetic DLC packs (e.g., The Sci-Fi Space Suite) that do not divide the player base.

# ---

**2\. CORE DESIGN PILLARS**

Every development decision made by the engineering, art, or design teams must strictly adhere to these four foundational pillars. If a feature conflicts with a pillar, the feature must be redesigned or cut.

### **Pillar 1: Epistemic Uncertainty (Incomplete Information)**

Knowledge is strictly compartmentalized. The user interface must never explicitly tell a player "You are the Spy." The game relies heavily on the psychological tension of a player painting a 'Tomato' while slowly realizing everyone else is painting an 'Apple'. Suspicion is born from genuine miscommunication. Information must always be inferred, never given.  
**DO:** Make the player question their own sanity when they see contradictory paint strokes.  
**DON'T:** Provide UI elements that track who fired which paint splatter.

### **Pillar 2: Chaos Creates Stories**

Perfectly balanced, competitive, esports-level gameplay is secondary. The primary goal of the game is to make players laugh at the absurd, ugly, and confusing artwork they created together. An accidental paint bomb explosion that ruins a perfect drawing is not a bug; it is a core feature that drives the narrative of that specific match.  
**DO:** Implement physics that are slightly unwieldy and character controllers that feel a bit clumsy (Friendslop aesthetic).  
**DON'T:** Implement aim-assist or perfectly straight lines for painting.

### **Pillar 3: Accessible Creativity (Creativity Over Skill)**

The game must not exclusively reward skilled digital artists. The physical, ragdoll-lite movement of the avatars and the imprecise, splatter-heavy nature of 3D paintball guns ensure that even the best illustrators will struggle to make perfect art. Winning is about communication, deduction, and logic, not drawing ability.  
**DO:** Allow players to throw massive paint bombs to fill in colors quickly without precision.  
**DON'T:** Implement complex Photoshop-style brush tools (like opacity sliders or lasso tools).

### **Pillar 4: Design-Driven Optimization**

Network bandwidth and GPU rendering limits are harsh realities of 3D multiplayer games. Instead of sacrificing performance, technical limitations are disguised as engaging gameplay mechanics. If rapid firing crashes the network, we introduce a "Weapon Overheat" mechanic. If thousands of decals crash the GPU, we add an aggressive "Roomba" NPC that cleans the floor.  
**DO:** Turn technical hurdles into lore-friendly game rules.  
**DON'T:** Rely solely on engine-level culling; use game design to limit player spam.

# ---

**3\. COMPLETE GAMEPLAY LOOP & STATE MACHINE**

The game operates on a strict Server-Authoritative State Machine. The Host server controls the transition between these states. Clients only receive state updates and render the appropriate UI/Audio.

### **3.1. STATE 0: The Physical Lobby (LobbyState)**

> * **Logic:** Players join via Steam P2P Matchmaking or direct invite. The lobby is not a static 2D menu; it is a fully playable 3D physical room.  
> * **Environment:** A smaller, run-down version of the main testing chamber. It features a "Test Canvas" wall, a mirror to see cosmetics, and a diegetic Host Terminal.  
> * **Player Actions:** Players can run, jump, shoot the test wall, change colors, and chat via proximity VOIP.  
> * **Host Actions:** The Host interacts with the computer terminal to adjust Match Settings (Time Limit, Spy Count, Prompts Difficulty).  
> * **Transition:** The Host presses "Commence Experiment". The server verifies all players are loaded and transitions to State 1\.

### **3.2. STATE 1: Prompt Distribution (PromptState)**

> * **Duration:** Exactly 5.0 Seconds.  
> * **Logic:** All player movement and input are locked. The screen fades to absolute black. The server securely calculates the roles based on the lobby size (e.g., 6 Players \= 5 Painters, 1 Spy).  
> * **Network:** The server selects a word pair from the JSON database (e.g., True Word: OCEAN, Decoy Word: LAKE). The server sends a targeted \`ClientRpc\` to each specific player containing their assigned word ID.  
> * **Visual/Audio:** A harsh, mechanical clunk sound plays. Massive, high-contrast white text appears on the black screen: *"YOUR PROMPT: \[WORD\]"*. No other UI is visible.  
> * **Transition:** Timer expires. Screen fades from black to clear. Transition to State 2\.

### **3.3. STATE 2: The Drawing Phase (ActionState)**

> * **Duration:** Configurable by Host (Default: 120 Seconds).  
> * **Logic:** Players are teleported to their spawn points facing the massive blank canvas. Inputs are unlocked.  
> * **Player Actions:** Players possess full movement, painting capabilities, and item usage. Ammunition depletes. Paint Bombs are thrown. Spies (if self-aware mode is active) use sabotage abilities.  
> * **Audio:** Fast-paced, upbeat, slightly cheesy "Muzak" (Bossa Nova elevator music) plays globally to hilariously contrast the frantic yelling and panic of the players.  
> * **UI:** The current prompt remains pinned at the top of the HUD. A timer ticks down. Ammo and Overheat bars are visible.  
> * **Transition:** Timer reaches 0.0s. Transition to State 3\.

### **3.4. STATE 3: Museum Phase & Lockdown (InvestigationState)**

> * **Duration:** Configurable by Host (Default: 45 Seconds).  
> * **Logic:** A loud, blaring buzzer sounds. All weapons are instantly locked (Cannot fire, cannot switch items, cannot throw bombs).  
> * **Player Actions:** Players retain movement. They are encouraged to step back, walk around the room, and look at the completed canvas. Proximity VOIP remains fully active. Players use this time to interrogate each other ("Who drew the green circle?\!", "Why is there a sun in the middle of the ocean?\!").  
> * **Transition:** Timer reaches 0.0s. Transition to State 4\.

### **3.5. STATE 4: The Tribunal (VotingState)**

> * **Duration:** 20 Seconds.  
> * **Logic:** Player movement is locked. A minimalist, translucent dark UI overlays the screen.  
> * **UI Elements:** A grid displaying the portraits/avatars of all living players (showing their currently equipped hats/colors). A large "SKIP VOTE" button is at the bottom.  
> * **Player Actions:** Players must cast a secret ballot by clicking on a portrait. Votes are hidden until the timer ends to prevent bandwagoning.  
> * **Audio:** The cheesy Muzak abruptly stops. A tense, low-BPM synth drone (similar to Blade Runner) plays to elevate paranoia.  
> * **Transition:** Timer reaches 0.0s, or all players have cast a vote. Transition to State 5\.

### **3.6. STATE 5: Resolution & Ghosting (ResolutionState)**

> * **Logic:** Votes are tallied by the Server. The results are revealed on screen.  
> * **Outcomes:**  
  * *Tie / Skip Majority:* No one is eliminated. The UI displays "HUNG JURY".  
  * *Majority Vote:* The player with the most votes is eliminated. A bucket of thick black paint drops on their 3D avatar in the game world. They are instantly converted to the "Ghost" faction.  
> * **Win Condition Check:**  
  * If Spies \== 0: Painters Win.  
  * If Living Spies \>= Living Painters: Spies Win.  
> * **Transition:** If a win condition is met, trigger the Post-Match XP screen and return to LobbyState. If no win condition is met, the Canvas is wiped clean (\`Graphics.Blit\` clear color), and the game immediately loops back to State 1 (Prompt Distribution) for the next round.

# ---

**4\. FACTIONS & ROLES**

### **4.1. The Painter (Majority Faction)**

The backbone of the game. Painters operate under the assumption that everyone is working towards the same goal.

> * **Knowledge:** Knows the true prompt. Believes they are a Painter. Does not know who the Spy is.  
> * **Abilities:** Standard painting, Paint Bombs, Paint Thinner.  
> * **Objective:** Accurately draw the prompt. Communicate with others to establish a baseline of truth. Deduce who is drawing out of context and build a case against them.  
> * **Win Condition:** Eliminate all Spies via the Tribunal voting phase.

### **4.2. The Spy (Minority Faction)**

The unwitting saboteur. The Spy is given a prompt that is similar enough to blend in initially, but geometrically or color-clashing enough to eventually cause a disaster.

> * **Knowledge:** Knows the decoy prompt. Believes they are a Painter (Unless 'Self-Aware Spies' lobby setting is ON). All Spies in a match receive the *exact same* decoy prompt.  
> * **Abilities:** Standard painting, Paint Bombs, Paint Thinner. (If 'Self-Aware' mode is on, gains access to the Sabotage UI).  
> * **Objective:** Draw their prompt. Realize late that they are the Spy based on the canvas context. Pivot their behavior rapidly, gaslight other players, cast suspicion on innocent Painters, and survive the vote.  
> * **Win Condition:** Survive until the number of living Spies is equal to or greater than the number of living Painters.

### **4.3. The Ghost (Eliminated / Spectator)**

Death in Double-Blind Canvas does not mean staring at a boring menu. It means becoming an omnipotent observer of the chaos.

> * **Knowledge:** Possesses total omnipotence. The Ghost UI reveals the true prompt, the decoy prompt, and the exact roles of all living and dead players.  
> * **Physics & Movement:** The character controller switches from Kinematic to *Noclip*. Ghosts can fly through walls, floors, and ceilings to get the best view of the action.  
> * **Visibility:** Ghosts are rendered on a separate Unity Layer. They are completely invisible to living players, but can see and interact with other Ghosts.  
> * **Audio (Ghost Channel):** The moment a player dies, they are removed from the global Proximity VOIP and placed into the isolated "Ghost Channel." Ghosts can talk, yell, and laugh together without the living hearing them.  
> * **Interaction Restrictions:** To preserve engine performance and prevent trolling, Ghosts **cannot** interact with the canvas, physics objects, or ammo barrels.  
> * **Win Condition:** A Ghost wins or loses alongside the faction they originally belonged to before dying.

# ---

**5\. ITEM & MECHANICS DATABASE**

All items in the game are physical 3D objects driven by strict code parameters to balance performance and fun.

### **5.1. The Paintball Gun (Primary Interaction Tool)**

The core tool of the game. It is not a 2D brush; it is a physical gun that shoots digital paint.

| Parameter | Value / Logic | Design Purpose |
| :---- | :---- | :---- |
| **Implementation** | Physics.Raycast from muzzle. | Instantly detects hit on the Canvas MeshCollider and extracts hit.textureCoord (UV). |
| **Color Selection** | Mouse Scroll Wheel / D-Pad | Cycles an array of 12 highly saturated Neon Albedo colors. Changes gun muzzle glow. |
| **Fire Rate** | 0.1 seconds per tick (10/sec) | Limits the rate of fire to prevent players from painting perfect, solid lines. Forces a "splatter" look. |
| **Ammo Capacity** | 100 Units | Requires constant monitoring by the player. |
| **Depletion Rate** | 5 Units per second of fire | A full tank allows 20 seconds of continuous fire before a refill is required. |

#### **5.1.1 The Overheat Mechanic (Critical Network Optimization)**

If players click the mouse 60 times a second, sending 60 RPC packets to the server will crash the game. The Overheat mechanic disguises this network limitation as a gun feature.

> * **Formula:** CurrentHeat \= (ShotsFired \* 15\) \- (TimeSinceLastShot \* 25/sec)  
> * **Max Heat:** 100\.  
> * **Penalty:** If CurrentHeat hits 100, the weapon jams, plays a loud steam-hiss audio clip, and locks firing for 2.5 seconds.  
> * **Result:** Forces players to shoot rhythmically, drastically reducing network packet spam.

### **5.2. The Paint Bomb (Consumable Item)**

A high-impact throwable designed to create massive canvas changes instantly.

> * **Implementation:** A Rigidbody projectile thrown with an arc trajectory. Explodes on OnCollisionEnter.  
> * **Effect:** Executes a massive Physics.OverlapSphere (3.0m radius). The shader blits a giant, jagged splatter texture onto the canvas using the player's current selected color.  
> * **Capacity:** 1 to 3 per player, per match (Configurable in Lobby). Cannot be refilled.  
> * **Strategic Use:** Painters use it to quickly establish large background skies or oceans. Spies use it to "accidentally" throw a bomb into a detailed drawing and ruin it, claiming their mouse slipped.

### **5.3. Paint Thinner (The "Eraser")**

Traditional "Undo" mechanics require saving massive Texture arrays in RAM, which crashes multiplayer games. We use Thinner instead.

> * **Implementation:** Thinner is not a separate gun; it is simply the 13th "Color" on the weapon's color wheel.  
> * **Effect:** Sprays the default wall color (White/Grey) over existing paint.  
> * **Optimization:** Because it just paints the background color, it costs ZERO memory overhead.  
> * **Penalty:** To prevent trolls from erasing the whole board, firing Thinner generates \+50% more Heat on the weapon, causing it to overheat much faster.

### **5.4. Ammo Refill Barrels (Static Environmental Prop)**

When a player runs out of paint, they cannot magically reload.

> * **Location:** Large, static cylinders bolted to the floor at the absolute rear of the room, far from the canvas.  
> * **Mechanic:** The player must turn their back on the canvas, walk to the barrel, aim at the nozzle, and hold the 'Interact' key (E).  
> * **Refill Rate:** 33 Units per second (Takes 3 full seconds to reload from 0 to 100).  
> * **Design Purpose:** This forces players to periodically stop drawing and look away from the canvas. This creates physical "blind spots" in the room where a Spy can quickly paint something wrong while the Painters are distracted reloading.

# ---

**6\. EVERY SPY ABILITY (Self-Aware Mode Only)**

By default, Spies do not know they are Spies. However, if the Host enables the **"Self-Aware Spies"** modifier in the lobby, Spies will be notified of their role at the start (e.g., *"YOU ARE THE SPY. PROMPT: LAKE"*). To compensate for their lack of "genuine innocence" (making it harder to fake), they are granted active sabotage abilities accessed via a hidden UI radial menu.

| Ability ID | Name | Mechanic & Duration | Cooldown / Limits | Global Tell (Counterplay) |
| :---- | :---- | :---- | :---- | :---- |
| SPY\_01 | **Blackout** | Cuts all global directional and point lights in the room. Players must rely on narrow, weak flashlights mounted on their paintball guns. Lasts 10 seconds. **(Technical Bonus: Massively lowers GPU rendering load during intense moments).** | 60s CD (Max 2 per match) | A loud, mechanical breaker box "CLUNK" sound echoes through the room. |
| SPY\_02 | **Roomba Overdrive** | The cleanup NPC's navigation speed increases by 300%. It aggressively seeks and destroys paint splats on the floor and walls, creating distracting movement and noise. Lasts 5 seconds. | 45s CD (Infinite uses) | The Roomba's friendly green light turns to a glowing, angry red. |
| SPY\_03 | **Invert Controls** | Reverses the WASD movement vectors for all living Painters. Pressing W moves them backward. Lasts 3 seconds. Extreme chaos generator. | 1 Use Per Match | Completely silent. No visual or audio cue. |

# ---

**7\. PROMPT DESIGN RULES & TAXONOMY**

The "Double-Blind" mechanic completely fails if the words are poorly chosen. The Game Designer responsible for writing the JSON word database must strictly adhere to the following taxonomy rules.

### **Rule 1: Categorical Overlap**

The True Prompt and Decoy Prompt must belong to the exact same parent category (e.g., Transportation, Food, Animals, Landscapes). If they do not, the Spy is caught in 3 seconds.  
*Example: "Apple" and "Car" \= BAD. "Apple" and "Banana" \= BETTER.*

### **Rule 2: Silhouette Dissonance**

While the objects must be in the same category, they must possess fundamentally different geometric shapes. If they are the same shape, the players will draw the same thing and never realize there is a Spy.  
*Example: "Apple" and "Peach" \= BAD (Both are round). "Apple" and "Banana" \= GOOD (Round vs. Long/Curved).*

### **Rule 3: Color Intersection (The Secret Weapon)**

If both prompts logically require the same primary color, the confusion will last significantly longer. Players usually start by blocking in base colors before adding details.  
*Example: "Frog" vs. "Turtle". Both players will grab the Green paint and start drawing a green blob. It isn't until the Painter draws a shell, or the Spy draws long jumping legs, that the screaming begins.*

# ---

**8\. DIFFICULTY SYSTEM & PROMPT MATRIX**

The Host can filter the prompt database based on three distinct difficulty tiers.

### **8.1. Easy Tier (Literal Nouns)**

Concrete objects with highly distinct silhouettes. Best for new players.

> * **Painter:** Helicopter | **Spy:** Airplane  
> * **Chaos Factor:** Cockpits match. Chaos erupts when painters draw top rotors while the spy draws long wings spanning the canvas.

### **8.2. Medium Tier (Abstract / Scenarios)**

Scenes, locations, or verbs. Requires background painting, environmental context, and complex coordination.

> * **Painter:** Deep Sea | **Spy:** Outer Space  
> * **Chaos Factor:** Both require players to paint the entire background dark blue/black. Confusion reigns when one player draws a yellow starfish and the other draws a yellow shooting star.

### **8.3. Hard Tier (Masterpiece Mode)**

Text prompts are disabled entirely. A UI overlay displays a famous public-domain painting on the player's HUD.

> * **Painter:** *The Starry Night* (Van Gogh) | **Spy:** *The Scream* (Edvard Munch)  
> * **Chaos Factor:** Both use heavy swirling blues and yellows. The Spy will attempt to draw the bridge and screaming face in the center, while Painters try to draw the glowing stars and cypress tree. Total geometric failure.

# ---

**9\. BALANCING PHILOSOPHY & MATH**

### **Social Engineering over Hard Stats**

We do not balance social deduction games by changing player movement speed, weapon damage, or hitboxes. Social deduction games are balanced via **information delivery** and **time**.  
**Scenario A: Painters win too often (Spies are caught instantly).**  
*Solution:* We must increase the "Chaos Score" of the prompt pairings in the database to make the words more mathematically similar.  
`ChaosScore = (SilhouetteSimilarity * 0.5) + (CategoryMatch * 0.3) + (ColorClash * 0.2)`  
`// If Painters are winning 80% of matches, we raise the minimum ChaosScore of all allowed prompts to 0.85.`  
**Scenario B: Spies win too often (Painters cannot figure it out).**  
*Solution:* Increase the duration of the "Museum Phase / Lockdown". If Spies are winning, it means Painters do not have enough time to verbally cross-examine each other and build a logical case. Adding 15 seconds to the discussion timer heavily buffs the Painters.

# ---

**10\. ECONOMY, COSMETICS & PROGRESSION**

### **10.1. Monetization Stance**

**Zero Microtransactions (No MTX). No Battle Passes. No Premium Currencies.**  
Progression is tied 100% to Steam Achievements and match XP. This fosters a positive, non-predatory community and ensures high Steam user review scores.

### **10.2. XP Generation & Scoring**

Players earn XP at the end of the Resolution Phase.

> * **Win as Painter:** \+50 XP  
> * **Win as Spy:** \+100 XP (Higher reward due to higher difficulty).  
> * **Correct Deduction:** \+25 XP (Awarded for voting for the Spy, even if your team loses).  
> * **The Picasso Bonus (MVP):** \+15 XP (Awarded to the player whose raycasts hit the canvas the most times).

### **10.3. Cosmetic Unlock Curve (Steam Inventory)**

Avatars are default grey capsules. Cosmetics are purely visual flexes.

| Level / Requirement | Cosmetic Reward | Item Type |
| :---- | :---- | :---- |
| Level 5 (500 XP) | Cardboard Box | Headwear |
| Level 10 (1500 XP) | Traffic Cone | Headwear |
| Level 20 (4000 XP) | Chrome Finish | Gun Skin |
| Achievement: *"The Invisible Brush"* (Win a match as a Spy with 0 votes against you). | Solid Gold Paintball Gun | Legendary Gun Skin |

# ---

**11\. MATCHMAKING & NETWORKING ARCHITECTURE**

### **11.1. Matchmaking & Lobby Flow**

> * **Architecture:** Heathen Steamworks Foundation + Steamworks.NET with Steam Networking Sockets NGO Transport. The game utilizes a P2P (Peer-to-Peer) network model where one player acts as the Listen-Server (Host). There are **zero dedicated server costs** for the studio. **(✅ IMPLEMENTED)**  
> * **Lobby Types:**  
  * *Public:* Visible on the Steam Server Browser. Can be filtered by Ping, Language, and Spy Count.  
  * *Private:* Hidden. Joinable only via Steam Friend Invite or a 5-digit room code.  
> * **Late Join Logic:** If a player joins a match currently in progress, they bypass the spawn logic and instantly spawn as a **Ghost**. They enter the spectator VOIP channel and must wait until the current round resolves to join the living roster.

### **11.2. Networking Framework (Programmer Notes)**

**Framework:** Unity Netcode for GameObjects (NGO) 2.13.0. **(✅ IMPLEMENTED)**  
**Topology:** Server-Authoritative Host-Client. **(✅ IMPLEMENTED)**  
**Note:** NGO 2.x uses the new `[Rpc(SendTo.Server)]` / `[Rpc(SendTo.ClientsAndHost)]` attribute syntax. The deprecated `[ServerRpc]` / `[ClientRpc]` attributes should NOT be used in implementation.

#### **11.2.1. CRITICAL: RPC Batching Logic**

Sending an RPC (Remote Procedure Call) over the network for every single paint splat per frame will instantly saturate the bandwidth and crash the lobby. We must batch the data.  
`// Data Structure`  
`public struct PaintSplat : INetworkSerializable {`  
    `public Vector2 uvCoord;`  
    `public Color32 paintColor;`  
    `public float brushSize;`  
      
    `public void NetworkSerialize<T>(BufferSerializer<T> serializer) where T : IReaderWriter {`  
        `serializer.SerializeValue(ref uvCoord);`  
        `serializer.SerializeValue(ref paintColor);`  
        `serializer.SerializeValue(ref brushSize);`  
    `}`  
`}`

`// Client Logic:`   
`// Clients store their raycast UV hits in a local List<PaintSplat>.`   
`// Every 0.1s (10 ticks per second), the client sends the entire array to the Server.`

`[Rpc(SendTo.Server)]`  
`public void SendPaintBatchRpc(PaintSplat[] splats, RpcParams rpcParams = default) {`  
    `// Server validates data (prevents cheating/spam)`  
    `ValidateSplats(splats);`  
    `// Broadcast to all other clients`  
    `ReceivePaintBatchRpc(splats); // [Rpc(SendTo.ClientsAndHost)]`  
`}`

#### **11.2.2. Late Join Canvas Syncing**

When a player late-joins, they will see a blank canvas because they missed all the previous RPCs. The Host must send the current state of the board.

> * **Logic:** The Host compresses the master RenderTexture into a PNG byte array using Texture2D.EncodeToPNG().  
> * **Transmission:** The byte array is sent via a chunked RPC or reliable custom message to the joining client, who decodes it and applies it to their local canvas.

# ---

**12\. STEAM FEATURES INTEGRATION**

The game relies heavily on Steam's ecosystem to handle backend services, saving development time and costs.

> * **Steam Matchmaking:** Handles the Server Browser UI, fetching active lobbies, ping, and player counts. **(✅ IMPLEMENTED)** — See `MatchmakingController.cs`.  
> * **Steam Networking Sockets:** Bypasses traditional UDP/IP port-forwarding issues. Uses Steam IDs to connect players securely, ensuring 99% of players can host games without router configuration. **(✅ IMPLEMENTED)** — See `ConnectionMethodSteam.cs`.  
> * **Dissonance Voice Chat:** Professional spatial VOIP plugin with NGO integration, room-based channels, push-to-talk, and 3D proximity audio with distance-based volume attenuation. **(✅ IMPLEMENTED)** — See `DissonanceRoomManager.cs`, `VoicePTTBridge.cs`. *(Originally planned as Steam Voice API; Dissonance is a superior solution with built-in spatial audio, room isolation, and broadcast triggers.)*  
> * **Steam Rich Presence:** When viewing a friend on Discord or Steam, it displays contextual game states: *"In a Match \- Museum Phase (4/8 Players) \- Score: 1500 XP"*. **(✅ IMPLEMENTED)** — See `SteamRichPresenceManager.cs`.  
> * **Steam Cloud Save:** Player settings (audio, video, controls, mic mode) are persisted via Steam Remote Storage for cross-device roaming. **(✅ IMPLEMENTED)** — See `SteamCloudSaveUtility.cs`.

# ---

**13\. USER INTERFACE (UI) & WIREFRAMES**

### **13.1. UI Design Philosophy**

The UI must be heavily **Diegetic** or Minimalist. The player is meant to be looking at the canvas, not reading health bars. Fonts should be clean, clinical sans-serif (e.g., Roboto, Inter) to match the testing facility aesthetic.

### **13.2. In-Game HUD Wireframe**

`=============================================================================`  
`| [ESC] Options                                                   [02:45]   |`  
`|                                                                           |`  
`|                                                                           |`  
`|                          PROMPT: O C E A N                                |`  
`|                                                                           |`  
`|                                                                           |`  
`|                                                                           |`  
`|                                  (+)                                      |`  
`|                               Crosshair                                   |`  
`|                                                                           |`  
`|                                                                           |`  
`|                                                                           |`  
`| [Chat: "Why is someone drawing green?!"]                                  |`  
`| [Press 'V' to Voice Chat]                              [Color Wheel: BLU] |`  
`|                                                        [Ammo: |||||||   ] |`  
`|                                                        [Heat: ||        ] |`  
`=============================================================================`

### **13.3. Voting Tribunal Overlay**

When the Museum phase ends, a translucent dark gray panel slides over the screen. A grid of living player avatars is displayed. The avatars render whatever hat or color the player is currently wearing to aid memory (e.g., "Vote for the guy in the cardboard box\!"). Players click an avatar to vote, or click a massive "SKIP VOTE" button anchored at the bottom.

# ---

**14\. ACCESSIBILITY & MODERATION**

### **14.1. Accessibility Standards**

> * **Colorblind Mode:** Since the game relies on color deduction, toggling this mode adds subtle, unique geometric patterns to the paint splatters based on their color (e.g., Green \= Diagonal Stripes, Red \= Polka dots). The UI Color Wheel also displays explicit text labels (RED, BLUE).  
> * **Input:** 100% rebindable Mouse/Keyboard and Gamepad support via Unity's New Input System.  
> * **Communication:** For mic-less players, a standard Text Chat and a *Quick-Chat Radial Wheel* (e.g., "I'm innocent\!", "Look at the top left\!", "That's the Spy\!") are available.

### **14.2. Moderation & Anti-Toxicity**

Public lobbies with voice chat and free-form drawing will attract trolls. Moderation tools must be robust.

> * **In-Game Vote Kick:** Any player can initiate a vote-kick against a troll. Requires a majority to pass.  
> * **Instant Mute:** Pressing TAB opens the scoreboard, which features large, 1-click Mute icons (for both Voice and Text) next to every player's name.  
> * **Streamer Mode:** To prevent "Stream Sniping", enabling this mode replaces all player names with generic designations (e.g., Subject\_01, Subject\_02), hides the Steam avatars, and randomizes character body colors every round.

# ---

**15\. AUDIO DESIGN (AUDIO BIBLE)**

### **15.1. Music & Mood**

> * **Main Menu:** A sterile, echoing synth track that sounds like a corporate training video.  
> * **Drawing Phase:** Upbeat, slightly cheesy Bossa Nova "Muzak" (Elevator music). This creates a hilarious contrast with the frantic gameplay, the exploding paint bombs, and the screaming players.  
> * **Tribunal Phase:** The Muzak abruptly cuts out. A tense, low-BPM synth drone (Similar to Hans Zimmer's *Blade Runner* or *Dune* soundtracks) slowly swells to elevate the paranoia.

### **15.2. Sound Effects (SFX)**

> * **Paintball Gun:** Punchy, wet, satisfying "thwack" and "splat" sounds.  
> * **Overheat:** A heavy mechanical "hiss" followed by a loud burst of steam.  
> * **Footsteps:** Loud, squeaky rubber shoe noises on linoleum floors, varying in pitch based on movement speed.  
> * **UI Clicks:** Satisfying, tactile mechanical keyboard clicks.

# ---

**16\. ART BIBLE (FOR 3D ARTISTS)**

### **16.1. Aesthetic Theme**

The visual style is defined as **"Clinical Slapstick" (Friendslop)**. It borrows the low-fi, high-contrast, slightly gritty textures of indie hits like *Lethal Company*, but places them in a brightly lit environment.

### **16.2. Environment & Lighting**

> * **The Room:** Minimalist, sterile testing chambers. White padded walls, grey linoleum floors. The environment must be heavily desaturated (muted) so that the neon paint stands out violently against it.  
> * **Lighting:** Harsh, baked fluorescent lighting. Very few dynamic shadows to keep GPU costs low.

### **16.3. Characters & Animation**

> * **Models:** Low-poly, faceless, pill-shaped capsule humans. No facial animations.  
> * **Animation Rigging:** Animations are heavily procedural, driven by Unity's Animation Rigging and IK (Inverse Kinematics). When a player runs, their arms flail clumsily. When they stop abruptly, their momentum carries them forward slightly. It must look inherently funny and uncoordinated.

### **16.4. The Paint (VFX)**

The paint is the star of the game. It uses extremely saturated, high-contrast **Neon Albedo** colors. It must look thick, wet, and slightly glossy. When a paint bomb explodes, the particle effect should be an exaggerated, cartoonish burst of liquid.

# ---

**17\. TECHNICAL ARCHITECTURE & OPTIMIZATION**

### **17.1. Rendering Pipeline**

Built exclusively on the **Unity 6 Universal Render Pipeline (URP)** using the new RenderGraph API to maximize compatibility across mid-range PCs.

### **17.2. The Canvas Technology**

Spawning a physical \`GameObject\` decal for every paint splat will drop the game to 1 FPS within 10 seconds.

> * **Solution:** The Canvas is a single \`MeshRenderer\` utilizing a 4096x4096 Unlit \`RenderTexture\`. Consider offering a 2048x2048 quality option (16 MB VRAM vs 64 MB) for lower-end PCs.  
> * **Drawing:** We use a custom Brush Shader. When a raycast hits the canvas, we take the UV coordinate and execute a \`CommandBuffer.Blit\` command (preferred over \`Graphics.Blit\` for URP RenderGraph compatibility in Unity 6) to permanently stamp the brush shape onto the RenderTexture.  
> * **Result:** Whether there is 1 paint stroke or 1 million paint strokes on the wall, the rendering cost is exactly the same. The memory footprint is entirely static.  
> * **Status:** ❌ NOT YET IMPLEMENTED.

### **17.3. The Decal System (Environment Paint)**

Players will inevitably shoot the floor, the ceiling, and each other. We cannot use the RenderTexture method for complex 3D models.

> * **Solution:** We use URP Decal Projectors managed by a strict **Object Pool** (Max 100 decals globally).  
> * **GPU Saver (The Roomba):** To explain why decals disappear when the pool is full, a small "Roomba" NPC actively patrols the room, driving over decals and triggering their fade-out animation. This gives a diegetic, lore-friendly reason for paint disappearing and saves VRAM.

# ---

**18\. RISK ANALYSIS & MITIGATION PLAN**

| Identified Risk | Impact Level | Mitigation Strategy |
| :---- | :---- | :---- |
| **Host Disconnects (Rage Quits)** | CRITICAL | Because the game uses P2P hosting, if the Host leaves, the lobby dies. NGO does not natively support host migration. **Implemented mitigation:** Graceful "Host Disconnected" error screen with automatic lobby cleanup and return to main menu. **(✅ IMPLEMENTED)** — See `HostingState.cs` → `OfflineState.cs` transition with `lobby.Leave()` cleanup. |
| **Translation / Localization API Lag** | HIGH | Querying external APIs (like Datamuse) mid-match for prompts will cause lag. **Mitigation:** Use a Hybrid Multi-Language Engine. Prompts are stored in an offline ScriptableObject database bundled with the build. The server sends an integer ID (e.g., ID:45), and the client translates it locally. |
| **Voice Chat Toxicity** | HIGH | Open mic lobbies are volatile. **Mitigation:** Prominent Mute buttons on the scoreboard, Vote-Kick functionality, and a clear Code of Conduct agreement required upon first boot. |
| **Scope Creep** | MEDIUM | Adding too many modes (e.g., 5 canvases, multiple rooms, AI bots). **Mitigation:** Strict adherence to the Next Fest Demo Scope (Section 22). No polish features until the core loop is 100% bug-free. |
| **Next Fest Deadline Pressure** | HIGH | 11 weeks to build all gameplay from scratch. **Mitigation:** Ruthless scope cut — demo ships with only the core Double-Blind loop (no Spy Abilities, no Cosmetics, no Ghost noclip, no Roomba). Features are added post-Next Fest for V1.0. |
| **Steam Store Page Deadline** | HIGH | Steam requires a published store page **at least 2 weeks before Next Fest** (by October 5, 2026). **Mitigation:** Store page assets (capsule images, screenshots, short trailer) must be ready by end of Sprint 8 (Week 9). |

# ---

**19\. PLAYTESTING METHODOLOGY**

Do not wait for the game to be finished to test if the "Double-Blind" concept is actually fun. Use the following phased approach:

> 1. **Phase 1: Paper Prototype.** Gather 5 people in a Discord call. Use MS Paint or a browser game like *Gartic Phone*. Secretly DM them words from our Prompt Database. Test if the chaos naturally occurs and if the voting arguments are funny.  
> 2. **Phase 2: Greybox Network Test (Sprint 3 — Week 3).** A Unity build with grey cubes and a functional drawing wall. Test if the NGO RPC Batching logic can handle 8 players holding the fire button simultaneously without spiking ping.  
> 3. **Phase 3: Core Loop Playtest (Sprint 5 — Week 6).** Internal testing of the full 6-state game loop. Focus on prompt difficulty, round pacing, and voting flow.  
> 4. **Phase 4: Closed Alpha (Sprint 7 — Week 8).** Invite 10–30 Discord community members. Focus on prompt difficulty balancing, UI flow, and Steam P2P stability under real conditions.  
> 5. **Phase 5: Steam Next Fest Public Demo (October 19–26, 2026).** Public demo release to stress-test Steam P2P Matchmaking on a global scale.

# ---

**20\. PRODUCTION ROADMAP & FEATURE MATRIX**

### **20.1. The 5-Phase Development Plan**

> * **Phase 1 (MVP Foundation):** FPS Character Controller, Raycast to RenderTexture painting logic, Color switching, Overheat math. (Single player only). **⚠️ PARTIAL** — Controller done; painting not started.  
> * **Phase 2 (Networking Core):** Netcode for GameObjects (NGO) Integration, Steam P2P Lobby creation, RPC Syncing and Batching of paint coordinates across two clients. **✅ COMPLETE** — Full NGO + Steam + Dissonance infrastructure operational.  
> * **Phase 3 (Game Loop & State Machine):** Implement the 6 Game States. Server-side Role Distribution, Prompt database (ScriptableObjects), Museum Phase timers, and Voting logic. **🔜 IN PROGRESS** — Sprint calendar below.  
> * **Phase 4 (Polish & Audio):** Implement Friendslop procedural physics, Roomba AI navigation (NavMeshAgent), Dissonance Ghost channel isolation, UI finalization, and Particle Effects. **⏳ POST-DEMO (V1.0)**  
> * **Phase 5 (Release Prep):** QA Testing, Steam Achievement hooks, Cosmetics database (Steam Inventory), and Full 1.0 Release. **⏳ POST-DEMO (V1.0)**

### **20.2. Next Fest Demo vs. V1.0 Launch vs. Post-Launch Feature Matrix**

| Category | Next Fest Demo (Oct 2026) | V 1.0 (Steam Launch) | Post-Launch (Updates) |
| :---- | :---- | :---- | :---- |
| **Painting** | Raycast UV Splats, 12 Neon Colors, Overheat, Thinner, Ammo Barrels. | Paint Bombs, Custom Brush Sizes. | Custom Brush Shapes, Spray Paint tool. |
| **Networking** | Steam P2P Lobbies, Server Browser. | Late Join Canvas Sync, Reconnection. | Cross-play architecture (if porting to consoles). |
| **Game Loop** | Full 6-state core loop (Double-Blind mode only). | Self-Aware Spies mode, Individual Partitioned Canvases. | Custom Lobby Modifiers (e.g., Zero Gravity). |
| **Social** | Spatial VOIP (Dissonance), Mute per player. | Text Chat, Quick Chat Radial, Ghost Channel VOIP. | Player Emotes / Gestures. |
| **Moderation** | Host can kick from lobby settings. | Vote Kick, Streamer Mode. | Report system, automated moderation. |
| **Spectator** | "Eliminated" overlay screen. | Full Ghost noclip with role reveal. | Ghost interactions, spectator camera modes. |
| **Cosmetics** | Default capsule avatars only. | 20+ Hats & Gun Skins via Steam Achievements. | Premium DLC Cosmetic Packs. |
| **Audio** | Placeholder SFX (paint splat, overheat hiss, buzzer). | Full BGM suite (Bossa Nova, Synth Drone), polished SFX. | Dynamic music system. |
| **Environment** | Single greybox testing chamber. | Polished clinical room, Roomba NPC, baked lighting. | Multiple map variants. |
| **Accessibility** | Rebindable controls, mic mode toggle. | Colorblind Mode (geometric patterns). | Subtitle/caption system. |

# ---

**21\. CURRENT IMPLEMENTATION STATUS (as of August 2026)**

This section tracks what has been built, tested, and verified in the live Unity project.

### **21.1. Infrastructure — ✅ COMPLETE**

The entire networking, transport, authentication, voice, and UI shell layer is fully operational and bug-free (0 compilation errors, 0 warnings). Comprehensive code audit completed with 30+ bug fixes and refactorings applied.

| System | Status | Key Files |
| :---- | :----: | :---- |
| NGO Host/Client Session Lifecycle | ✅ | `ConnectionManager.cs`, `ConnectionApprovalHandler.cs` |
| Connection State Machine (6 states) | ✅ | `OfflineState`, `StartingHostState`, `HostingState`, `ClientConnectingState`, `ClientConnectedState`, `ClientReconnectingState` |
| Steam P2P Transport (SNS) | ✅ | `ConnectionMethodSteam.cs` + SNS NGO Transport |
| Local/LAN Transport (MPPM Testing) | ✅ | `ConnectionMethodLocal.cs` + Unity Transport |
| Steam Lobby Create/Join/Browse | ✅ | `MatchmakingController.cs` |
| Steam Auth Ticket Validation | ✅ | `ConnectionApprovalHandler.cs` (with MPPM self-auth bypass) |
| Dissonance Spatial Voice Chat | ✅ | `DissonanceRoomManager.cs`, `VoicePTTBridge.cs`, `DissonanceTriggerSync.cs` |
| Steam Cloud Settings Save/Load | ✅ | `SteamCloudSaveUtility.cs` |
| Steam Rich Presence | ✅ | `SteamRichPresenceManager.cs` |
| Steam Overlay Invites | ✅ | `SteamOverlayInviteHelper.cs` |
| Network Object Pool (O(1) tracking) | ✅ | `NetworkObjectPoolHandler.cs`, `NetworkObjectPoolManager.cs` |
| Owner-Authority Animation Sync | ✅ | `OwnerNetworkAnimator.cs` |
| Networked FPS Character Controller | ✅ | `FirstPersonController.cs` + `Player.prefab` |
| Input System (Fully Rebindable) | ✅ | `InputSystem_Actions.inputactions` + `SettingsController.cs` |
| UI Shell (Main Menu, Matchmaking, Settings, Pause) | ✅ | `MainMenuController.cs`, `MatchmakingController.cs`, `SettingsController.cs`, `PauseMenuController.cs` |
| Player Nameplate (World-Space) | ✅ | `PlayerNameplate.cs` |
| Player Crosshair (IMGUI) | ✅ | `PlayerCrosshair.cs` |
| Graceful Host Disconnect Handling | ✅ | `HostingState.cs` → `OfflineState.cs` with lobby cleanup |
| Domain Reload Disabled Support | ✅ | `UIStateRegistry.cs` static reset via `[RuntimeInitializeOnLoadMethod]` |

### **21.2. Gameplay — ❌ NOT STARTED**

All core gameplay systems described in Sections 3–10 are scheduled for Sprints 1–9 below.

### **21.3. Improvements Applied During Audit (August 2026)**

The following improvements were discovered and applied during a comprehensive code audit:

| Improvement | Impact | File |
| :---- | :---- | :---- |
| Native C++ delegate crash prevention (Steam warning hook) | Eliminated `0xC0000005` access violation | `SteamWarningHook.cs` |
| Removed runtime `AddComponent<NetworkBehaviour>` | Fixed NGO index desync across host/clients | `PlayerNameplate.cs` |
| Steam auth ticket handle caching + `CancelAuthTicket` | Fixed auth ticket memory leak | `ConnectionMethodSteam.cs` |
| `EndAuthSession` cleanup on disconnect | Prevents auth session accumulation on server | `ConnectionApprovalHandler.cs` |
| MPPM self-auth bypass (`#if UNITY_EDITOR`) | Enables 1-PC / 1-Steam-account testing | `ConnectionApprovalHandler.cs` |
| O(1) pool tracking with `HashSet` | Prevents double-enqueue and null pool corruption | `NetworkObjectPoolHandler.cs` |
| Cached static 1×1 reticle texture | Eliminates per-frame `Texture2D` allocation | `PlayerCrosshair.cs` |
| `LoadRawTextureData` for Steam avatars | Replaced 4,096 `SetPixel` calls with single blit | `MatchmakingController.cs` |
| FSM state guards on async callbacks | Prevents stale lobby callbacks from corrupting state | `StartingHostState.cs`, `ClientConnectingState.cs` |
| Lobby cleanup on host failure | Prevents zombie Steam lobbies | `OfflineState.cs` |
| Deterministic MPPM player IDs | Enables session reconnection for virtual players | `ConnectionMethodLocal.cs` |
| Local-owner PlayerInput filtering for PTT | PTT binds only to local player, not remote instances | `VoicePTTBridge.cs` |
| `UnityEngine.Cursor` disambiguation | Fixed UIElements vs UnityEngine.Cursor compile error | `MainMenuController.cs` |

### **21.4. Tech Stack Errata (Changes from Original GDD)**

| Original GDD Specification | Actual Implementation | Reason |
| :---- | :---- | :---- |
| Facepunch Steamworks | Heathen Steamworks + Steamworks.NET | Heathen provides higher-level APIs, ScriptableObject config, and better Unity integration. |
| Steam Voice API (VOIP) | Dissonance Voice Chat | Professional spatial audio, room channels, broadcast triggers, and native NGO integration. Far superior to raw Steam Voice. |
| `[ServerRpc]` / `[ClientRpc]` syntax | `[Rpc(SendTo.Server)]` / `[Rpc(SendTo.ClientsAndHost)]` | NGO 2.x deprecated the old attributes. New unified `[Rpc]` syntax is required. |
| Host Migration via NGO | Graceful disconnect screen | NGO does not support host migration. Implemented clean error handling with lobby cleanup instead. |
| `Graphics.Blit` for canvas | `CommandBuffer.Blit` (planned) | Better URP RenderGraph compatibility in Unity 6. |
| JSON prompt database | ScriptableObjects (planned) | Type safety, Inspector editing, localization hooks, zero runtime deserialization. |

# ---

**22\. STEAM NEXT FEST DEMO SCOPE (October 19–26, 2026)**

The demo must deliver the **core Double-Blind experience** in a single, polished loop. Features are ruthlessly scoped to what is achievable in 11 weeks.

### **22.1. DEMO INCLUDES (✅ Ship This)**

> * Full 6-state gameplay loop: Lobby → Prompt → Action → Investigation → Voting → Resolution  
> * Canvas RenderTexture painting with `CommandBuffer.Blit` brush stamps  
> * Paintball Gun with 12 neon colors + Paint Thinner (13th color)  
> * Overheat mechanic (network rate-limiting disguised as gameplay)  
> * Ammo system with refill barrels (forces players away from canvas)  
> * Prompt database with 30–50 word pairs across Easy and Medium tiers  
> * Server-authoritative role assignment (Painter vs Spy — Double-Blind mode only)  
> * Voting tribunal with player portrait grid and skip vote  
> * Win/lose condition checks and round looping  
> * Gameplay HUD: prompt display, countdown timer, ammo bar, overheat bar, color wheel  
> * Steam P2P lobbies with invite and server browser (already implemented)  
> * Spatial proximity VOIP with Push-to-Talk (already implemented)  
> * Eliminated players see an "ELIMINATED" overlay and spectate the canvas (simplified Ghost)  
> * Placeholder SFX: paint splat, overheat hiss, round buzzer, vote reveal  
> * Single greybox testing chamber level  
> * 4–8 player support

### **22.2. DEMO EXCLUDES (❌ Cut for V1.0)**

> * Self-Aware Spies mode and Spy Abilities (Blackout, Invert, Overdrive)  
> * Ghost noclip movement and Ghost VOIP channel  
> * Roomba NPC and environment decal system  
> * Paint Bombs (throwable)  
> * Hard tier / Masterpiece Mode prompts  
> * XP, Progression, Levels, and Cosmetics (Hats, Gun Skins)  
> * Steam Achievements  
> * Colorblind Mode  
> * Text Chat / Quick Chat Radial Wheel  
> * Streamer Mode  
> * Vote Kick (host kick from lobby is sufficient for demo)  
> * Late Join Canvas Sync  
> * Polished art, baked lighting, and final materials  
> * BGM music tracks (Bossa Nova, Synth Drone)

# ---

**23\. 11-WEEK SPRINT CALENDAR (August 4 → October 19, 2026)**

Each sprint is 1 week. The calendar assumes a single developer with AI-assisted tooling.

### **Sprint 1 (Aug 4–10) — Canvas Painting Engine**

> * Create `BrushStamp.shadergraph` (URP unlit blit shader for stamping brush shapes onto RenderTexture)  
> * Create `CanvasManager.cs` — `NetworkBehaviour` managing a 4096×4096 `RenderTexture`, `CommandBuffer.Blit` pipeline  
> * Create canvas quad mesh in `Level1` scene with unlit RenderTexture material  
> * Implement `Physics.Raycast` from camera → canvas `MeshCollider` → extract `hit.textureCoord` (UV)  
> * Stamp brush shape at UV coordinate onto RenderTexture via `CommandBuffer`  
> * Test: Single player can paint colored strokes on the wall  
> * **Milestone: 🎨 Local painting works**

### **Sprint 2 (Aug 11–17) — Gun Mechanics + Networked Paint**

> * Create `PaintballGun.cs` — fire rate (10/sec), color selection (scroll wheel / D-pad), muzzle glow  
> * Create `OverheatSystem.cs` — heat formula `(ShotsFired * 15) - (TimeSinceLastShot * 25/sec)`, jam at 100, 2.5s lockout  
> * Create `AmmoSystem.cs` — 100 units, 5/sec depletion, refill barrel interaction (E key, 33 units/sec)  
> * Create `ColorPalette.cs` — 12 neon albedo colors + thinner (13th = background color, +50% heat penalty)  
> * Create `PaintSplat : INetworkSerializable` struct (compressed: `half2` UV, `byte` colorIndex, `byte` brushSize)  
> * Implement RPC batching: client collects splats locally, sends `PaintSplat[]` batch every 0.1s via `[Rpc(SendTo.Server)]`  
> * Server validates and broadcasts to all clients  
> * Add `AmmoRefillBarrel` prefab — static cylinder at rear of room  
> * Test: 2 MPPM players can paint on the same canvas simultaneously  
> * **Milestone: 🔫 Multiplayer painting works**

### **Sprint 3 (Aug 18–24) — Gameplay State Machine**

> * Create `GamePhase` enum: `Lobby`, `Prompt`, `Action`, `Investigation`, `Voting`, `Resolution`  
> * Create `GamePhaseManager.cs` — standalone `NetworkBehaviour` with `NetworkVariable<GamePhase>` and `NetworkVariable<float>` timer  
> * Implement server-driven phase transitions with configurable durations  
> * Lock/unlock player input per phase (movement locked during Prompt/Voting, weapons locked during Investigation/Voting)  
> * Create `PromptOverlay.cs` — full-screen black overlay with white text "YOUR PROMPT: [WORD]" during PromptState  
> * Create basic `GameplayHUD.cs` — timer countdown, current prompt pinned at top  
> * Implement canvas clear (`CommandBuffer.Blit` solid color) between rounds  
> * Test: Full phase cycle runs with placeholder prompts  
> * **Milestone: 🔄 Game loop cycles through all 6 states**

### **Sprint 4 (Aug 25–31) — Roles, Prompts & Win Conditions**

> * Create `PromptPairSO : ScriptableObject` — fields: `TrueWord`, `DecoyWord`, `Difficulty`, `ChaosScore`, `Category`  
> * Author 30–50 word pairs across Easy and Medium tiers  
> * Create `PromptDatabase.cs` — loads all `PromptPairSO` assets, filters by difficulty, selects random pair  
> * Implement server-side role assignment: calculate spy count from player count (e.g., 6 players = 1 spy)  
> * Send targeted `[Rpc(SendTo.SpecificClients)]` with assigned word to each player  
> * Implement win condition checks in `ResolutionState`: Spies==0 → Painters Win, Spies≥Painters → Spies Win  
> * Display round result ("PAINTERS WIN" / "SPIES WIN" / "HUNG JURY") and transition to next round or lobby  
> * Test: Roles correctly assigned, prompts differ between painter/spy, win conditions trigger  
> * **Milestone: 🎭 The Double-Blind mechanic works**

### **Sprint 5 (Sep 1–7) — Voting System**

> * Create `VotingManager.cs` — `NetworkBehaviour` managing secret ballot collection and tallying  
> * Create `VotingOverlay.cs` — UI Toolkit panel with player portrait grid (showing hat/color), skip vote button  
> * Votes are `NetworkVariable` or RPC-based, hidden until timer expires (prevent bandwagoning)  
> * Implement elimination: majority vote → player eliminated (disable movement, weapons, set to spectator layer)  
> * Create simplified "ELIMINATED" spectator overlay (camera follows canvas, no noclip, no ghost channel)  
> * Handle ties and skip majorities ("HUNG JURY" → no elimination)  
> * Test: Full round with painting → discussion → voting → elimination → win check  
> * **Milestone: 🗳️ Complete playable game loop**

### **Sprint 6 (Sep 8–14) — HUD, Audio & Game Feel**

> * Finalize `GameplayHUD.cs` — ammo bar, overheat bar, color wheel indicator, phase timer  
> * Add color wheel UI (scroll preview showing current + adjacent colors)  
> * Implement placeholder SFX: paint splat (wet thwack), overheat (steam hiss), round buzzer, vote reveal sting  
> * Add diegetic Host Terminal interaction in lobby (start game button)  
> * Polish state transitions: screen fade to black for PromptState, buzzer for Investigation start  
> * Implement lobby player count display and ready-check before game start  
> * Test: Play 5+ full matches, tune round durations and overheat values  
> * **Milestone: 🎧 Game feels and sounds good**

### **Sprint 7 (Sep 15–21) — Level Design & Visual Polish**

> * Build the testing chamber in `Level1`: white padded walls, grey linoleum floor, fluorescent lighting  
> * Place canvas wall (large quad), ammo refill barrels (rear of room), spawn points  
> * Bake lightmaps (harsh fluorescent look)  
> * Set up URP Post-Processing Volume: subtle Bloom on neon paint, ACES tonemapping  
> * Ensure paint colors are violently saturated against the desaturated room  
> * Test capsule character visibility, nameplate readability, paint contrast  
> * **Milestone: 🏭 The room looks like a clinical testing facility**

### **Sprint 8 (Sep 22–28) — Steam Store Page & Demo Build Prep**

> * **CRITICAL DEADLINE: Steam Store Page must be live by October 5 (2 weeks before Next Fest)**  
> * Capture gameplay screenshots (4+ high-quality 1920×1080 screenshots showing painting chaos)  
> * Record 30–60 second gameplay trailer (screen capture of a full round)  
> * Create Steam capsule images (header, small capsule, large capsule, hero, logo)  
> * Write Steam Store description (short + long)  
> * Create initial demo build, upload to Steamworks via `ContentBuilder`  
> * Set up Steam demo app configuration  
> * Test demo install/launch flow  
> * **Milestone: 📰 Steam Store Page submitted for review**

### **Sprint 9 (Sep 29 — Oct 5) — Bug Fixing & Stability**

> * **Steam Store Page goes live (latest October 5)**  
> * Internal playtesting marathon: 2–4 player sessions, test every phase transition edge case  
> * Fix all crash bugs, softlocks, and desync issues  
> * Tune prompt difficulty based on playtesting (adjust ChaosScore thresholds)  
> * Tune round timers (Action: 120s, Investigation: 45s, Voting: 20s — adjust based on feel)  
> * Verify Steam P2P connection reliability across different network conditions  
> * **Milestone: 🛡️ Demo is stable and crash-free**

### **Sprint 10 (Oct 6–12) — Closed Alpha Testing**

> * Invite 10–30 Discord community members to closed alpha  
> * Monitor Steam P2P matchmaking under real-world conditions  
> * Collect feedback on: prompt difficulty, round pacing, voting fairness, voice chat quality  
> * Fix critical bugs reported by testers  
> * Polish based on feedback: adjust timer durations, fix UI confusion points  
> * Update demo build on Steamworks  
> * **Milestone: 🧑‍🤝‍🧑 Real players have validated the core loop**

### **Sprint 11 (Oct 13–18) — Final Demo Polish & Launch**

> * Final bug sweep and stability pass  
> * Final demo build upload to Steamworks  
> * Verify demo downloads and launches correctly from Steam Store  
> * Prepare community engagement plan for Next Fest week (Discord, social media)  
> * Write developer "About This Game" post for Steam Community  
> * **🚀 October 19: STEAM NEXT FEST BEGINS**

### **Sprint Calendar Visual**

```
Aug 04 ──── Sprint 1: Canvas Painting Engine
Aug 11 ──── Sprint 2: Gun Mechanics + Networked Paint
Aug 18 ──── Sprint 3: Gameplay State Machine
Aug 25 ──── Sprint 4: Roles, Prompts & Win Conditions
Sep 01 ──── Sprint 5: Voting System                    ◄── PLAYABLE GAME
Sep 08 ──── Sprint 6: HUD, Audio & Game Feel
Sep 15 ──── Sprint 7: Level Design & Visual Polish
Sep 22 ──── Sprint 8: Steam Store Page & Demo Build     ◄── STORE PAGE DEADLINE (Oct 5)
Sep 29 ──── Sprint 9: Bug Fixing & Stability
Oct 06 ──── Sprint 10: Closed Alpha Testing
Oct 13 ──── Sprint 11: Final Polish & Launch
Oct 19 ──── 🚀 STEAM NEXT FEST BEGINS
Oct 26 ──── Steam Next Fest Ends
```

# ---

**24\. MARKETING, WISHLISTING & CONTENT STRATEGY**

Steam Next Fest success is measured in **wishlists**. A demo that nobody plays is worthless. Marketing must run **in parallel with development**, not after. The goal is **1,000+ wishlists before October 19** — the threshold where Steam's algorithm begins recommending your game organically.

### **24.1. Steam Store Page Optimization (Live by October 5)**

The Store Page is the single most important marketing asset. It converts browsers into wishlists.

> * **Short Description (Max 300 chars):** "Paint together. Suspect everyone. In this 3D first-person social deduction game, nobody knows if they're the traitor — not even the traitor. Draw a prompt with your team using physics-based paintball guns, then vote to eject the saboteur."  
> * **Tags (Critical for Discoverability):** `Social Deduction`, `Multiplayer`, `Party Game`, `Online Co-Op`, `First-Person`, `Drawing`, `Comedy`, `Indie`, `3D`, `Physics`, `Funny`, `PvP`, `Voice Chat`, `Colorful`, `Casual`  
> * **Capsule Images:** The main capsule must show the chaotic painted canvas with neon splatters. Include the game logo prominently. Use the clinical room's white/grey as contrast against violent neon paint colors.  
> * **Screenshots (Minimum 5):**  
>   1. Players painting a chaotic canvas together (Action Phase)  
>   2. The prompt reveal screen ("YOUR PROMPT: OCEAN") — builds curiosity  
>   3. The voting tribunal overlay with player portraits  
>   4. Close-up of a player's paintball gun with neon muzzle glow  
>   5. The finished canvas disaster (the "punchline" screenshot)  
> * **Trailer (30–60 seconds):**  
>   1. Open with 2 seconds of silence + the prompt reveal screen  
>   2. Cut to frantic painting chaos with upbeat Bossa Nova  
>   3. Show the "wait... why is someone drawing a BANANA?" moment  
>   4. Cut to the voting screen — dramatic synth drone  
>   5. End with the game logo + "Wishlist Now on Steam"  
> * **"About This Game" Section:** Lead with the hook ("Nobody knows if they're the traitor — not even the traitor"), explain the core loop in 3 bullet points, include 1 GIF of gameplay, end with "Coming to Steam — Wishlist Now"

### **24.2. Wishlist Funnel Strategy**

Every piece of content must drive viewers to one action: **"Wishlist on Steam."**

| Channel | Action | Timing | Wishlist Impact |
| :---- | :---- | :---- | :----: |
| **Steam Store Page** | Publish page with demo flag, capsules, screenshots, tags | By Oct 5 (Sprint 8) | 🟢 HIGH |
| **Reddit** | Post devlog GIFs to r/IndieGaming, r/IndieDev, r/SocialDeduction, r/gamedev, r/Steam | Weekly from Sprint 3 onward | 🟢 HIGH |
| **Twitter/X** | Post 15-second gameplay clips with #IndieGame #SocialDeduction #WishlistOnSteam | 2–3 posts/week from Sprint 2 onward | 🟡 MEDIUM |
| **TikTok/Shorts** | Vertical 30-second clips: "POV: You realize YOU are the spy" | Weekly from Sprint 5 onward | 🟢 HIGH |
| **YouTube Devlogs** | 3–5 minute behind-the-scenes videos showing development progress | Bi-weekly from Sprint 3 onward | 🟡 MEDIUM |
| **Discord Server** | Central community hub for playtesters, feedback, announcements | Set up immediately (Week 1) | 🟡 MEDIUM |
| **Steam Community Posts** | Development updates posted to the game's Steam Community hub | Weekly from Store Page launch | 🟡 MEDIUM |
| **Indie Game Festivals** | Submit to online indie showcases (Day of the Devs, Indie Arena Booth) | Submit applications by mid-Aug | 🟢 HIGH |

### **24.3. Content Creator & Streamer Outreach**

Social deduction + voice chat + visual chaos = **perfect streamer bait**. Target small-to-mid streamers (500–10K followers) who play *Lethal Company*, *Content Warning*, *Among Us*, or *Gartic Phone*.

> **Outreach Template (Email / DM):**  
> *Subject: Free Steam keys — New social deduction game for your friend group*  
>  
> *Hi [Name],*  
>  
> *I'm building Double-Blind Canvas — a 3D first-person social deduction game where you paint together using paintball guns, but nobody knows if they're the traitor. Think "Among Us meets Gartic Phone in 3D" with proximity voice chat.*  
>  
> *It's built for friend groups and designed to create hilarious, clippable moments. I'd love to send you and your friends free Steam keys for the upcoming Steam Next Fest demo (Oct 19–26).*  
>  
> *Here's a 30-second gameplay clip: [link]*  
> *Steam page: [link]*  
>  
> *No obligations — just hoping you'll have fun with it.*  
>  
> *Thanks,*  
> *[Your name]*

> **Outreach Timeline:**  
> * **Sprint 6–7 (Sep 8–21):** Compile target list of 50–100 small streamers/YouTubers  
> * **Sprint 8 (Sep 22–28):** Send initial outreach batch (20–30 creators) with gameplay clip + Steam page link  
> * **Sprint 9–10 (Sep 29–Oct 12):** Follow up with remaining creators; send keys to confirmed interested parties  
> * **Sprint 11 (Oct 13–18):** Send final "Next Fest starts Monday!" reminder to all confirmed creators  
> * **Next Fest Week (Oct 19–26):** Monitor creator streams, retweet/share clips, engage in their chats

### **24.4. Social Media Content Calendar**

| Week | Sprint | Content Type | Platform | Example Post |
| :---- | :---- | :---- | :---- | :---- |
| Week 2 | Sprint 2 | First painting clip | Twitter, Reddit | *"First time painting in 3D multiplayer. The paintball gun works!"* [15s clip] |
| Week 3 | Sprint 3 | State machine demo | Twitter | *"The game now has rounds. Lobby → Paint → Discuss → Vote → Eliminate."* [GIF] |
| Week 4 | Sprint 4 | "The Spy realizes" moment | TikTok, Reddit | *"POV: Everyone is painting an apple but you got 'banana'"* [30s clip] |
| Week 5 | Sprint 5 | First full match | YouTube, Twitter | *"We played our first complete match. Chaos."* [3-min devlog] |
| Week 6 | Sprint 6 | Polished gameplay | All platforms | *"The voting tribunal is in. Someone is going to paint jail."* [GIF] |
| Week 7 | Sprint 7 | Room reveal | Reddit, Twitter | *"The clinical testing chamber is ready for experiments."* [screenshot] |
| Week 8 | Sprint 8 | Store page announcement | All platforms | *"DOUBLE-BLIND CANVAS is now on Steam. Wishlist now!"* [capsule image + link] |
| Week 9 | Sprint 9 | "1 month to Next Fest" | Twitter, Discord | Countdown post with gameplay montage |
| Week 10 | Sprint 10 | Alpha tester reactions | TikTok, Twitter | Clips of real players reacting to the Double-Blind mechanic |
| Week 11 | Sprint 11 | Launch countdown | All platforms | *"Steam Next Fest starts MONDAY. Demo is live. Play with friends."* |

# ---

**25\. COMMUNITY BUILDING & PLAYTESTING PIPELINE**

### **25.1. Discord Server Structure**

Set up a Discord server immediately. This is the central hub for playtesters, bug reports, and community engagement.

> **Channels:**  
> * `#announcements` — Development updates, Steam page launch, Next Fest dates  
> * `#devlogs` — Behind-the-scenes screenshots, GIFs, and progress updates  
> * `#general` — Open community chat  
> * `#looking-for-group` — Players finding friends to play with during Next Fest  
> * `#bug-reports` — Structured bug reports from alpha testers (use a template: Steps to Reproduce, Expected, Actual, Screenshot)  
> * `#feedback` — General gameplay feedback and suggestions  
> * `#prompt-suggestions` — Community-submitted word pairs for the prompt database  
> * `#clips-and-memes` — Player-generated content (encourage sharing for organic marketing)  
> * `#alpha-testers` (role-locked) — Private channel for confirmed playtesters  
>  
> **Roles:** `@Developer`, `@Alpha Tester`, `@Community Member`, `@Content Creator`

### **25.2. Playtesting Recruitment Pipeline**

| Phase | Timing | Testers | Source | Focus |
| :---- | :---- | :----: | :---- | :---- |
| **Internal Dogfooding** | Sprint 3–5 (Aug 18–Sep 7) | 2–4 | Developer + close friends via MPPM | Core loop functionality, crash bugs, desync |
| **Friends & Family Alpha** | Sprint 6–7 (Sep 8–21) | 6–10 | Personal network, Discord friends | Game feel, prompt difficulty, round pacing |
| **Community Closed Alpha** | Sprint 8–10 (Sep 22–Oct 12) | 15–30 | Discord server recruits, r/playmygame | UI/UX flow, Steam P2P stability, first impressions |
| **Open Alpha (Demo)** | Sprint 10–11 (Oct 6–18) | 30–100 | Discord + Reddit + Steam | Stress test, matchmaking, final polish |
| **Steam Next Fest Public** | Oct 19–26 | Unlimited | Steam Store | Global stress test, wishlist conversion, creator content |

### **25.3. Playtester Feedback Collection**

> * **Post-Session Survey (Google Forms):** Sent after every closed alpha session.  
>   * *"On a scale of 1–5, how fun was the painting phase?"*  
>   * *"Did you figure out who the Spy was? How?"*  
>   * *"Was any prompt too easy or too hard? Which one?"*  
>   * *"What was the funniest moment?"*  
>   * *"What frustrated you the most?"*  
>   * *"Would you wishlist this game on Steam? Why or why not?"*  
> * **Bug Report Template (Discord):**  
>   ```
>   **Bug:** [One-sentence description]
>   **Steps to Reproduce:** [1. 2. 3.]
>   **Expected:** [What should happen]
>   **Actual:** [What actually happened]
>   **Screenshot/Clip:** [Attach if possible]
>   ```
> * **Session Recording:** Ask alpha testers for permission to record their voice chat reactions for marketing clips (with consent).

### **25.4. Key Metrics to Track**

| Metric | Target (Pre-Next Fest) | Target (During Next Fest) | How to Track |
| :---- | :---- | :---- | :---- |
| **Steam Wishlists** | 500–1,000 | 2,000–5,000 | Steamworks Partner Dashboard |
| **Discord Members** | 50–100 | 200–500 | Discord Server Insights |
| **Demo Downloads** | N/A | 1,000+ | Steamworks Partner Dashboard |
| **Demo Median Playtime** | N/A | 20+ minutes (3+ rounds) | Steamworks Playtest Analytics |
| **Demo-to-Wishlist Conversion** | N/A | 15–25% | Steamworks funnel data |
| **Social Media Impressions** | 10,000+ total | 50,000+ total | Twitter/TikTok analytics |
| **Content Creator Streams** | 3–5 confirmed | 10+ live streams | Manual tracking |
| **Alpha Tester Survey Score** | 3.5+/5 average fun rating | N/A | Google Forms |

# ---

**26\. STEAM NEXT FEST WEEK PLAYBOOK (October 19–26, 2026)**

Next Fest is a 7-day sprint. Every hour counts. The goal is **maximum wishlist conversion** and **maximum demo visibility**.

### **26.1. Day-by-Day Plan**

| Day | Date | Priority Actions |
| :---- | :---- | :---- |
| **Day 1 (Mon)** | Oct 19 | 🚀 Demo goes live. Post launch announcement across ALL channels. Pin "Demo is LIVE" in Discord. Monitor for Day 1 crash bugs. |
| **Day 2 (Tue)** | Oct 20 | Fix any critical Day 1 bugs. Push hotfix build if needed. Engage with Steam community discussions. Respond to every review/comment. |
| **Day 3 (Wed)** | Oct 21 | **LIVESTREAM:** Do a 2-hour developer livestream on Steam (Next Fest livestream slot). Play the game with community members on-stream. |
| **Day 4 (Thu)** | Oct 22 | Post "best moments so far" compilation clip to TikTok/Twitter/Reddit. Share player-generated clips. Thank early players publicly. |
| **Day 5 (Fri)** | Oct 23 | Second push: Post to r/Steam, r/SocialDeduction, r/IndieGaming with "Weekend plans? Try our free demo." Ping content creators for weekend streams. |
| **Day 6 (Sat)** | Oct 24 | Peak weekend traffic. Monitor servers. Engage in player Discord voice channels. Host a community game night. |
| **Day 7 (Sun)** | Oct 25 | Final push: "Last day to try the demo!" post. Thank the community. Compile feedback for V1.0 roadmap. Upload final demo analytics screenshot to devlog. |
| **Post-Fest** | Oct 27+ | Analyze wishlist data. Post "What we learned" devlog. Begin V1.0 development using Next Fest feedback. Keep demo available (or remove strategically). |

### **26.2. Steam Next Fest Livestream Checklist**

Steam gives participating developers a **dedicated livestream slot** during Next Fest. This is free visibility directly on the Steam front page.

> * **Sign up for a livestream slot** via the Steamworks Next Fest registration page (register early — slots fill up)  
> * **Duration:** 2 hours minimum  
> * **Format:** Play the game LIVE with community members from Discord. Show the Double-Blind mechanic in action. Let viewers hear the voice chat reactions.  
> * **Setup:** OBS Studio, 1080p, game audio + Discord voice mixed, face cam optional  
> * **Call-to-Action:** Every 15 minutes, say "If you're enjoying this, hit that Wishlist button on Steam"  
> * **Have a co-host:** If possible, have a friend or community moderator help manage chat while you play

### **26.3. Post-Next Fest Analysis**

After Next Fest ends, compile:

> * Total wishlists gained during the event  
> * Demo download count and median playtime  
> * Wishlist conversion rate (downloads → wishlists)  
> * Top 5 bugs reported by players  
> * Top 5 feature requests from community feedback  
> * Content creator coverage list (who streamed it, viewer counts)  
> * Decision: Keep demo available, or pull it to build anticipation for Early Access?

# ---

**27\. MARKETING CALENDAR (Integrated with Sprint Plan)**

```
DEVELOPMENT                              MARKETING
─────────────────────────────────────────────────────────────────
Aug 04 ── Sprint 1: Canvas Engine        Set up Discord server
Aug 11 ── Sprint 2: Gun + Net Paint      First gameplay clip (Twitter/Reddit)
Aug 18 ── Sprint 3: State Machine        Devlog #1 (YouTube) + GIF posts
Aug 25 ── Sprint 4: Roles & Prompts      "POV: You're the spy" TikTok
Sep 01 ── Sprint 5: Voting System        Devlog #2 + Full match clip
Sep 08 ── Sprint 6: HUD & Audio          Compile streamer outreach list
Sep 15 ── Sprint 7: Level Polish         Send first outreach batch (20-30 creators)
Sep 22 ── Sprint 8: Store Page           🔴 STEAM STORE PAGE LIVE → Wishlist push
Sep 29 ── Sprint 9: Bug Fixing           Follow up outreach + send keys
Oct 06 ── Sprint 10: Closed Alpha        Alpha tester reaction clips → TikTok
Oct 13 ── Sprint 11: Final Polish        "Next Fest starts Monday!" countdown
Oct 19 ── 🚀 NEXT FEST                   DEMO LIVE → Livestream → Daily posts
Oct 26 ── Next Fest Ends                 Post-mortem analysis + V1.0 roadmap
```

# ---

\[END OF MASTER PRODUCTION BIBLE\]

*The blueprint is complete. The networking foundation is built and battle-tested.*  
*The marketing engine is defined. The community pipeline is ready.*  
*11 weeks remain. The clock is ticking.*  
**Next sprint: Sprint 1 — Canvas Painting Engine (August 4–10, 2026).**