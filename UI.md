This is the raw, napkin-sketch version of the UI specification, ready for fast implementation during the Fixathon.

We are prioritizing speed over beauty. The aesthetic is "Cyberpunk Terminal."

-----

# PROJECT: VALKYRIE - UI SKETCHES

## PART 1: THE USER MOBILE APP (Web Client)

**Goal:** Zero friction. A panic button that feels responsive.

### State A: Idle (The "Red Button")

Currently feeling safe, but ready. The background is a dark, muted map of their location.

```ascii
.-------------------------------------.
|  VALKYRIE PROTOCOL         [STATUS] |
|-------------------------------------|
|                                     |
|          ( Map view dimly lit )     |
|             You are here: (X)       |
|                                     |
|                                     |
|       ._____________________.       |
|       |                     |       |
|       |                     |       |
|       |  REQUEST DRONE      |       |
|       |  ESCORT NOW         |       |
|       |                     |       |
|       |_____________________|       |
|                                     |
|     (HOLD 3 SEC TO TRIGGER)         |
|                                     |
'-------------------------------------'
```

### State B: Active Summoning (The Arrival)

Button pressed. Immediate feedback. The map lights up.

```ascii
.-------------------------------------.
|  ** DRONE DISPATCHED ** [HELP!]  |
|-------------------------------------|
| STATUS: In Transit                  |
| ETA: < 2 MINUTES                    |
|_____________________________________|
|                                     |
|         [MAP VIEW BRIGHTENS]        |
|                                     |
|      (X) <---------- =D=            |
|    Your Loc        Drone Incoming   |
|                                     |
|                                     |
|-------------------------------------|
| [ PIP: LIVE DRONE EYE VIEW ]        |
| (A tiny, grainy feed showing it     |
|  sees you)                          |
'-------------------------------------'
```

-----

## PART 2: THE ADMIN DESKTOP DASHBOARD

**Goal:** Situational awareness and AI-assisted decision-making.

This is a single-screen "command center" layout.

```ascii
+==============================================================================+
|  VALKYRIE COMMAND CENTER // FIXATHON EDITION v0.1                            |
+======================+============================+==========================+
| PANEL 1: ESCALATION  | PANEL 2: FLEET MAP         | PANEL 3: THE AI "EYE"    |
| (Manual Controls)    | (Global Awareness)         | (Active Incident Feed)   |
+======================+============================+==========================+
|                      |                            |                          |
| CURRENT TICKET:      |    [ MAPBOX / GOOGLE ]     |  [ LIVE VIDEO STREAM ]   |
| User ID: #5591       |                            |                          |
| Loc: Sveavägen 24    |    . . . . . (D) . . .     |  (Grainy night vision    |
| Status: EVALUATING   |    . . . . . . . . . .     |   from drone hovering    |
|                      |    . (D) . . . . . . .     |   above user)            |
|                      |    . . . . . . . . . .     |                          |
| ==================== |    . . =D= ---> (X) . .    |                          |
| || DISPATCH       || |    . . . . . . . . . .     |                          |
| || POLICE (SEPO)  || |                            |                          |
| ==================== |    (D) = Idle Drone        |                          |
| *Only use if AI      |    =D= = Active Drone      |                          |
| confirms danger OR   |    (X) = Distress Signal   |                          |
| visual confirmation. |                            |                          |
|                      |                            |==========================|
|                      |                            | GEMINI 1.5 ANALYSIS      |
| [Manual Drone Jog]   |                            | [Scanning frame...]      |
|  ^                   |                            |                          |
| < >  (Last resort)   |                            | THREAT SCORE: 8/10 (HIGH)|
|  v                   |                            |                          |
|                      |                            | "Gemini sees: 2 figures  |
|                      |                            | rapidly closing distance.|
|                      |                            | Metallic object visible."|
|                      |                            |                          |
|                      |                            | REC: DISPATCH POLICE     |
+----------------------+----------------------------+--------------------------+
```

-----

### Hackathon Implementation Notes (Attack, Attack, Attack\!)

To build this in 24 hours:

1.  **The User Button:** It doesn't need a real backend initially. Make the button stick a "help request" object into a Firebase/Supabase realtime database.
2.  **The Admin Map:** Just grab user locations from that database and plot them on a free Mapbox tier. Don't worry about real drone physics yet; just draw a straight line.
3.  **The Gemini Link (CRITICAL):**
      * Don't try to stream live video *to* Gemini. It's too slow.
      * **The Hack:** On the admin page, use JS to take a screenshot (canvas `toDataURL`) of the video feed every 3 seconds. Send that JPG to a simple Next.js API route that calls Gemini Vision. Display the text result below the video.

Lycka till\! Go break things.