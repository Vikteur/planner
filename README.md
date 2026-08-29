# Rekord Match, for planners

React implementation of the planner side of Rekord Match, built from the Claude Design
mock [`planner/Planner UI Mock.dc.html`](https://claude.ai/design/p/beb3e117-c7a2-43eb-b9c0-88bdbb6c3ffc?file=planner%2FPlanner+UI+Mock.dc.html).

React 19 + Vite 8 + react-router 7, TypeScript, no UI library. Colours, fonts and the
mock's `font:` shorthands live in `src/theme.ts`; screens use inline style objects for
everything fixed and `src/responsive.css` for everything that has to move.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run typecheck
```

## Screens

| Mock | Route | File |
| --- | --- | --- |
| 1a Planner events overview | `/weddings` | `src/screens/WeddingsOverview.tsx` |
| 1b Planner vendor directory | `/catering`, `/photographers`, `/locations`, `/djs` | `src/screens/VendorDirectory.tsx` |
| 1c Planner create wedding | `/weddings/new`, `/weddings/:id/edit` | `src/screens/NewWedding.tsx` |
| 1d Planner wedding detail | `/weddings/:id` | `src/screens/WeddingDetail.tsx` |

## Responsive

Every rule in `src/responsive.css` that sits outside a media query holds the mock's own
value, so the 1180x740 design size renders exactly as drawn. The breakpoints only take
over above and below it:

| Width | What changes |
| --- | --- |
| 1440px+ | header, main and footer stop widening and centre |
| ≤1120px | wedding rows reflow: date and `open →` flank a stacked couple / venue / vendors / playlists column |
| ≤1080px | the wedding detail moves the music panel below the team instead of beside it |
| ≤900px | the directory drops to one column |
| ≤700px | the sidebar becomes a top bar with a scrolling nav, rows stack, page padding tightens to 20px |

Headings use `clamp()` rather than a breakpoint. The app shell is `height: 100dvh` with
internal scrolling on wide screens and switches to normal document scrolling under 700px.

Checked for horizontal overflow on all six routes at 360, 480, 640, 768, 900, 1024,
1180, 1440 and 1920: none.

## Fidelity

`reference/mock.html` is a static copy of the four mock screens. `reference/diff.html`
loads it beside the running app in two 1180x740 iframes and compares every painted box
(position, size, background, each border, radius, shadow, opacity) and every run of text
(position, size, colour, font, weight, style, letter-spacing, line-height). Open
`http://localhost:5173/reference/diff.html` with the dev server running and call
`await loadPair('s1a'); runDiff()`. `reference/widths.html` renders any route at any
width via `show(width, height, route)`.

Screen 1a is still an exact match: 18/18 boxes and 52/52 text runs, zero differences.

The other three screens now differ from the mock **only** where changes were requested,
which the harness confirms one by one:

- **1b** the five `CALL` text pills became ten mail/call icon buttons (17 → 22 boxes),
  which shifts the five phone numbers left. Plus the search field, which is a real
  `<input>` rather than a static label.
- **1c** the vendor chips and static values became `<select>` pickers, so their text is
  no longer a text node; the three DJ chip boxes are gone; `change` became
  `assigned` / `not needed` / `pick one`; the closing note became a `Save as draft`
  button. Plus the couple / date / guests fields, which are real inputs.
- **1d** `SHARE WITH VENUE` removed and an `Edit` button added in its place; mail/call
  icons on every team member and both partners; the `THEIR PAGE` link moved from the
  middle of the team column down into the footer, where it keeps the team column's width
  rather than running under the playlists; the `PAST WEDDINGS OPEN THE SAME WAY…` footer
  caption removed. Everything else shifts up 5px because the header lost the pill.

Two other deliberate departures: scrolling regions use `overflow: auto` where the mock
uses `overflow: hidden` (identical at the design size, but content stays reachable in a
smaller window), and hover styles come from the mock's `style-hover` attributes via
`src/components/Hov.tsx`.

## Content beyond the mock

The mock draws four screens; the app needs a few more surfaces so nothing dead-ends.
These reuse the mock's components and its own cast of characters:

- The photographers, locations and DJs directory tabs. The mock draws catering only and
  says the rest work the same, so `src/data/directory.ts` fills them with the people the
  mock already names (Merel Jansen, Karin Smit, Sanne de Groot, the three DJs) plus a few
  more in the same voice. The catering tab is verbatim.
- Email addresses for every contact, needed by the mail buttons.
- Wedding detail for the other four weddings, and the "Schema of the day" tab, in
  `src/data/weddingDetail.ts`. Emma & Julian's event tab is otherwise verbatim.
- `/weddings/:id/edit` reuses the create form with the wedding filled in. Vendors are
  matched back from the team by contact name (`vendorIdFor`), since the detail data
  stores the person rather than the company.
