# Batch 3 footage re-QC (dense 6-frame sampling)

Triggered after the owner caught, during 1x1 review, a tourist-on-camel
(shepherds-towers) and a modern car (lizards-hole) that the original
single-frame QC missed. This pass samples 6 frames per clip (8/25/42/58/75/92%)
and eye-checks every frame.

Scrapped by owner: lizards-hole, unwanted-charity.

## Flagged clips (need replacement)

### moon-split (3)
- beat 2 `33446280` - person silhouette dominates foreground + modern town with electric streetlights; not literal.
- beat 3 `32097578` - star-trail (not "one bright object rising") + bright cliff/blue sky, wrong grade.
- beat 4 `34626522` - modern white apartment blocks/houses along the bottom of every frame.

### jerusalem-test (6)
- beat 0 `37426379` - power/cable lines across night sky + modern LED strip lighting.
- beat 1 `34142319` - bright daylight + European hilltop castle/abbey (possible non-Islamic monastery).
- beat 2 `14862729` - tourist camel trek (rider + guide, modern dress).
- beat 3 `37994821` - harsh daylight + modern city (satellite dishes, concrete, national flag).
- beat 4 `37426375` - modern LED floodlights/strip fixture, flat grey, no shaft of light (borderline).
- beat 6 `16668201` - overhead power cables, white plastic chair, wall lamps, bollards, European alley, bright.
- beat 7 `37994817` - bright daylight + solar panels, water tanks, satellite dishes, modern concrete.

### shepherds-towers (5)
- beat 0 `14257968` - harsh bright daylight + close-up goats, not vast dunes/distant herd.
- beat 2 `32018898` - tourist in shorts/Nike sneakers smoking, riding a guided camel.
- beat 3 `12705917` - modern paved highway with street lamps and cars in background.
- beat 6 `35440227` - readable "DAMAC" building signage/logo every frame + bright daylight.
- (beat 1 title `32410813`, beats 4/5/7 skyscrapers, cover: PASS)

### forelock (4)
- beat 2 `30493727` - modern bamboo garden tiki torch, not ancient columns.
- beat 4 `4434132` - bright blue-sky sunlit daylight, wrong grade.
- beat 6 `36935813` - lone identifiable man with a staff + modern houses/power poles + bright sky.
- beat 7 `28452231` - identifiable seated man reading (subject) + modern plastic stool.

### verse-of-honey (5) - most serious
- beat 0 `7255134` - amber liquid in a STEMMED GLASS, reads as wine/whisky (opening beat).
- beat 1 `7255135` - swirling amber liquid in a glass (title card), reads as whisky swirl.
- beat 3 `28256672` - modern apiary hive box with red metal roof + equipment, bright.
- beat 4 `8298098` - harsh high-key white, reads as herbal tea, honey not clearly shown.
- beat 5 `7143963` - subject is green matcha pancakes + banana (honey only a bg prop), bright.
- beat 6 `8406984` - the insect is a FLY/hoverfly, not a honeybee (closing beat about "the bee").

### mosque-boast (1)
- beat 2 `30226373` - two tourists (teal shirt + phone) at ~92% + bright blue sky + wall plaque.

### night-and-day (2)
- beat 0 `35221616` - bright daytime aerial of terrain with tiny modern towns; wrong grade.
- beat 4 `8484385` - parchment scroll on blown-out high-key white studio bg; wrong grade.

### greeting-grown-cold (3 + cover)
- beat 4 `34711278` - legible signage "PORT OF HAYDARPASA" on cranes.
- beat 5 `25401762` - legible rooftop brand "HILAL CONCEPT".
- beat 6 `33472428` - blown-out sunrise street, Japanese shop signage, van/tram/power lines, tail cuts to a night scene with two people.
- cover `10636652` - legible road signage ("P", "85", arrows).

### protected-ceiling (0) - CLEAN, no changes needed.

### yasbahun (3)
- beat 1 `30039749` - legible license plate "BA VE 03199" + vehicle on the title card.
- beat 2 `28981397` - bright daytime rock badlands; wrong grade + not literal (no sky/stars).
- beat 4 `12564702` - bright daytime blue-sky clouds; wrong grade + generic (no sun/moon orbit).

### time-speeds-up (1 hard + cautions)
- beat 2 `34307917` - desert dune-bashing tourism (4x4 + dune buggies + logo banner), bright.
- caution: beat 3 bright grey overcast.

### constantinople (2 hard incl a CROSS + cautions)
- beat 0 `28277078` - modern marina (yachts, lamp post, handrail), bright; small ruined fort, not sea walls.
- beat 5 `8720606` - CHRISTIAN monastery gate with a carved CROSS + cross-motif frieze (other-faith symbol, hard reject).
- cautions: beat 2 lit modern ferry, beat 4 bright overcast, beat 6 rusted metal (not parchment), beat 7 small motorboats + bright sun.

### expander (1 hard + cautions)
- beat 4 `10936886` - airplane-window aerial of modern farmland grid/airfield, bright; not earth's curve.
- cautions: beat 3 moon (not stars), beat 6 tropical palms (not desert plain).

## Tally (13 remaining shorts, after scrapping lizards-hole + unwanted-charity)
- CLEAN: protected-ceiling (0 fixes).
- Light fixes (1-2): mosque-boast (1), time-speeds-up (1), expander (1), night-and-day (2).
- Medium (3): moon-split (3), greeting-grown-cold (3+cover), yasbahun (3).
- Heavy (4): shepherds-towers (4), forelock (4).
- Near-total (rework/scrap candidates): jerusalem-test (~7/8), verse-of-honey (6/7).
- CRITICAL, must not ship: constantinople beat 5 (Christian cross); verse-of-honey beats 0+1 (read as alcohol).

Root cause: single-frame, delegated footage QC AND the contact-sheet sign-off
gate was skipped for batch 3 (rendered without owner approval of footage sheets).
Fix forward: re-source to strict dark / no-people / no-modern / no-text / literal
standard, rebuild per-short contact sheets, owner signs off BEFORE any re-render.
