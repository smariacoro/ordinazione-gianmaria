# BRIEF: Ordinazione di fra Gian Maria Candelora

Self-authored under explicit creative delegation (the user chose "Decidi tu").
Facts come only from `context.txt` and the user's answers.

## Verbatim requirements from the user

- "super user friendly (mi aspetto tutte persone non tecniche e forse alcuni anziani, sopratutto i preti) e possibilmente una sola pagina a scorrimento"
- "Super descrittivo ma pulito"
- "Multilingua (italiano, inglese, francese, tedesco, spagnolo)"
- "Responsive e funzionante su pc, android, mac, ios"
- "Hostato su github pages"

Constraints from the delegation: practical information is always legible and never
behind an animation; no invented facts; no paid generated assets.
Confirmed by the user: ordination on Saturday 12 December 2026 at 11:00. Images: free
Wikimedia Commons photos, replaceable later.

## The eight topics (authored decisions)

1. **Vibe:** sober, solemn, warm, plainly useful. References: a printed Mass booklet, the Roman capitals carved on the sanctuary façade, a parish noticeboard that is actually readable.
2. **Journey:** the invitation (what, when, where) > crossing the threshold of the sanctuary > the day > how to get there > parking > the meal > where to sleep > for priests > confirm your presence, closing with the letter.
3. **Energy:** calm, one single lift at the threshold, then still and practical to the end.
4. **Feeling:** see curve below.
5. **Unique thing:** scrolling walks you through the sanctuary's door. See signature move.
6. **Aesthetic family:** editorial with heritage restraint. Not premium-minimal dark.
7. **World or scenes:** distinct scenes. A continuous world would hide information.
8. **Assets:** real photographs of the real place (CC0 / public domain). No photo of fra Gian Maria yet.

## Feeling curve

```
1  Welcome     a plain title page: name, date, hour, place, already complete on arrival
2  Awe         the façade fills the screen, an arch opens in it, the altar appears
3  Orientation the day laid out in order, nothing to work out
4  Assurance   "Genazzano, not Genzano", one button that opens the map
5  Relief      parking is honest: it is scarce, here are the seven places, a real photo of the landmark
6  Warmth      the meal after the celebration
7  Being cared for  where to sleep, with phone numbers you can tap
8  Being addressed  priests get their own page: bring these two things
9  Intimacy    the letter, in his words, and the one thing he asks: confirm by 2 December
```

## The peak

"Scrolling, I walked through the door of the church and the altar opened up in front of me."
Lives in act 2. It has the largest scroll span on the page, the only full-bleed imagery,
and the quiet title page in front of it (authored silence: no imagery motion in act 1).

**Tell-someone sentence:** it's the site where you walk through the door of the sanctuary
by scrolling, and then everything you need for the day is written out plainly.

## Grammar: "Libretto" (new, defined here)

The page is a printed Mass booklet that opens once and then behaves like paper.

- **Sequence:** title page, one threshold, then chapters on hard-cut grounds.
- **Navigation:** a permanent top bar that says in words where you are, with a plain Menu button and the five languages. Not decoration: older visitors need it.
- **Ending:** a signed letter that holds, with the request set inside it, not a button island.
- **Bans:** `scrub` and video, `pan`, `kinetic`, `tilt`, `magnet`, `spotlight`, scroll cues, `drift` gradients, any entrance animation or cue on practical text, more than one pinned act, generated imagery.

Why the eight stock grammars lost: filmic one-shot forbids visible sequence and jumping, which these readers need. Chaptered editorial is closest but forbids a fixed nav and a full-bleed moment, and it sets the close as small running text, wrong for older eyes. Live surface: nothing to operate. Continuous world: information would sit inside a moving canvas. Typographic poster: real place deserves real pictures, and extreme scale harms reading. Gallery: this is not a range to browse. Split stage: no two-sided argument. Cutlist: speed is the opposite of the brief.

## Signature move: the door

An arch cut from the façade's own arched lunette grows under scroll and the altar shows through it, while the façade pushes forward and the interior settles back. Two real photographs at independent rates with true occlusion, drawn with `clip-path` from `--sc-p` in page CSS. Under reduced motion it is two still photographs, one after the other.

## Layer contract (hero threshold)

| Plane | Asset | Movement | Occlusion |
|---|---|---|---|
| Far | Altar photograph | Scales 1.14 to 1.0 | Seen only through the arch |
| Near | Façade photograph | Scales 1.0 to 1.28 toward the arch | Frames the opening |
| Text | Greeting from the letter | Fixed, cue only after the arch opens | Solid plate, not essential information |

## Score

| Beat | Device | Why |
|---|---|---|
| Welcome | `flow` | Paper. Complete at once |
| Awe | `pin` + bespoke arch, `cue` | The peak; the hand moves the door |
| Orientation | `flow` | Timeline as plain list |
| Where + parking | `reveal` + `parallax` on the castle photo only | Text stays still; the landmark is a state change |
| Sleep | `parallax` on the etching only | Quiet variation |
| Priests | hard-cut ground | Being addressed needs a change of page |
| Letter | `flow`, final hold | It resolves and stops |

Four device families: flow, pin, reveal, parallax. No device twice in a row among the animated ones. About 9 to 11 viewport-heights depending on device, mostly reading.

## Colour and type

Marian navy, stone white, one cobalt hue in two stops for the hard cut between grounds. Display: Source Serif 4 semibold, because the page is literally a booklet and it stays sturdy at small sizes. Text: Source Sans 3, the companion face of the serif and very legible. (Atkinson Hyperlegible was tried first and rejected on the render: its slashed zero turned 2026 and 11:00 into something an older reader would stumble on.) Body about 22px on desktop, 21px on phones. Controls at least 56px tall.

## Known gaps (must be asked, never invented)

- Link of the RSVP form behind the invitation's QR code, and a contact for fra Gian Maria.
- Website and address of the B&Bs La Taverna and Brancaleone, link of Dimora Genista.
- Aminta Resort: the text says Via Trovano 5, its website says Via Trovano 3.
- A photo of fra Gian Maria.

## Revision: "un po' più moderno"

User's words: "Possiamo farlo un po' più moderno? Poi non mettere "fra" nel titolo" and "In conferma la presenza serve un qualcosa semplice direttamente dal sito".

The structure (title page, door, chapters, closing letter) and the signature move stay. The aesthetic family moves from editorial to contemporary: Bricolage Grotesque for display, Figtree for text, vivid cobalt, rounded panels, a floating bar, very large type. The etching is removed because it pulled the page backward. "Fra" is gone from the title, the page title and the bar; it stays in running text and in calendar entries, where it is part of the sentence.

User's words on the replies: "Qualcosa di semplice che GianMaria possa vedere. Magari un documento condiviso tra me e lui (anche google) dove il colpo d'occhio del numero totale e delle persone è importantissimo". The form therefore writes to a shared Google Sheet through an Apps Script web app (`foglio-google/conferme.gs`), with the total in very large type frozen at the top. The sheet exists and was tested end to end with a real submission. The form stays hidden if `RSVP_ENDPOINT` is empty and only thanks the visitor after the script has answered yes.
