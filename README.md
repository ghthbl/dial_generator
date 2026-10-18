# Podvig 02 Night Relay — Metric Dial & Handset Studio

A self-contained parametric SVG workshop for the **39 × 47 mm Podvig watch case**. The current project uses a **hand-wound Sellita SW210-1**, with the specified **SW200-compatible Ø33.00 mm dial interface**. SW200 and SW300 have their own selectable profiles. The original SW260 project template is retained, with its small-seconds limitation identified explicitly.

**Studio:** [ghthbl.github.io/dial_generator](https://ghthbl.github.io/dial_generator/)

The application is entirely inside [`index.html`](index.html). Open it directly in a modern browser, or serve it through GitHub Pages. **No build, CDN, external font, runtime package, account or server is required.** The npm development dependencies are used only by the regression tests.

## Quick start

1. Open `index.html` or the Pages studio. The default is the 33 mm SW210 Podvig design.
2. Choose a movement and dial diameter. Selecting a movement loads its interface and nominal dial size.
3. Set the crown position, date position and optional open-heart aperture. Review the movement note and geometry status.
4. Select a handset, pose, dial finish and lighting. The original octagon, date and visibility controls remain available.
5. Download a layered presentation SVG, a closed-outline CAD SVG, or an individual factory plate.

**Reset All to Spec** restores the complete SW210 Podvig configuration, including the original 33 mm geometry and handset settings.

## GitHub Pages

The repository root contains `index.html` and `.nojekyll`, so GitHub Pages can serve it without a build step. In **Settings → Pages**, choose **Deploy from a branch → main → /(root)** and save. The expected studio URL is the link above. A private repository needs a GitHub plan that supports Pages for private repositories; deployment visibility is controlled by GitHub's Pages settings.

Adding `index.html` makes the source ready for Pages; it does not itself enable the account-level Pages setting. The old `dial_generator.html` URL redirects to `index.html` for existing bookmarks.

## Metric contract

Every exported document uses exactly:

```xml
<svg width="40mm" height="40mm" viewBox="0 0 40 40">
```

- **1 SVG user unit = 1.0000 mm.** No export rescaling or DPI conversion is applied.
- The dial centre and central hand arbor stay at **(20.0000, 20.0000)**.
- Coordinates and dimensional attributes use `fmt = n => Number(n).toFixed(4)`. SVG arc flags remain the required integer `0`/`1`; the fixed root dimensions/viewBox retain the syntax above.
- Dial-front axes: **+X right, +Y down**. Watch angles increase clockwise from 12H: 12H = 0°, 3H = 90°, 6H = 180°, 9H = 270°.
- The viewport enlarges the SVG for inspection; its apparent screen size is not a physical calibration.

The normal diameter slider covers **28.50–35.00 mm**. **Extended manual diameter** permits **5.00–39.80 mm**. The 39.80 mm limit leaves room on the fixed 40 mm page. Some small diameters are mechanically impossible for the selected movement; the studio reports those conflicts and blocks downloads rather than shrinking the movement interface.

Changing diameter scales the artwork and hand silhouettes about the arbor. The octagon-radius slider is referenced to a 33 mm dial: physical radius = slider value × diameter / 33; its badge shows both values when they differ. **Date dimensions/radius, centre hole, dial feet, open-heart dimensions/offset, hand bosses and fitting references do not scale.** Octagon stroke width, minute-tick width and the selected radial gap remain physical dimensions. Stencil numerals and closed wordmark shapes follow artwork scale. The applied hexagon retains its physical dimensions and pin pitch while its centre follows the artwork's radial placement.

## Sellita SW210 / SW200 project coordinates

These are the preserved project defaults. The SW210 uses the same project dial interface as SW200. They are also retained as the original SW260 **dial template**, not as a complete SW260 mechanism drawing.

| Feature | Relative to arbor (mm) | Absolute SVG coordinates / dimensions (mm) |
|---|---|---|
| Dial perimeter | R = 16.5000 | Centre (20.0000, 20.0000), Ø33.0000 |
| Centre clearance hole | R = 1.0000 | Ø2.0000; project clearance for Ø1.50 hour-wheel pipe |
| 6H date inner edge | +8.8500 in Y | Y = 28.8500 |
| 6H date outer edge | +11.5500 in Y | Y = 31.5500 |
| 6H date tangential width | ±1.0000 in X | X = 19.0000…21.0000; width 2.0000 |
| 6H date radial height | 2.7000 | 2.0000 × 2.7000 aperture |
| Foot 1, 3H orientation | (−11.6000, +3.7800) | (8.4000, 23.7800), Ø0.7500 |
| Foot 2, 3H orientation | (+11.6000, −3.7800) | (31.6000, 16.2200), Ø0.7500 |
| Foot 1, alternative +90° | (−3.7800, −11.6000) | (16.2200, 8.4000), Ø0.7500 |
| Foot 2, alternative +90° | (+3.7800, +11.6000) | (23.7800, 31.6000), Ø0.7500 |
| Applied-logo locating pin 1 | (−0.5500, −8.2500) | (19.4500, 11.7500), Ø0.4000 |
| Applied-logo locating pin 2 | (+0.5500, −8.2500) | (20.5500, 11.7500), Ø0.4000 |

The white date-frame centreline is 0.10 mm outside the aperture. Its physical **0.15 mm** print weight extends another 0.075 mm on each side. The cut contour and the print frame are distinct geometries.

**Alternative dial feet are reference choices.** Plate 0 contains the requested two Swiss foot orientations in separately named layers. Choose the correct pair before generating toolpaths; do not infer that four feet should be drilled or fitted simultaneously. Coordinates are front-view coordinates, not a mirrored back-view drilling jig.

SW260-1 is a **small-seconds movement**, with the seconds axis 6.4 mm from the centre. The preserved Layer 10 is a central-seconds design preview. A functional SW260 dial needs the appropriate subsidiary arbor, display and handset engineering, which this template does not add automatically.

## Movement profiles and calibration

Profiles are data in the `MOVEMENTS` object, separate from decoration generation. Each specifies nominal dial size, centre hole, two feet, foot diameter, optional date geometry, optional open heart, fitting references, source and limitations.

| Profile | Interface offered | Scope |
|---|---|---|
| Sellita SW210-1 | Current Podvig / shared SW200 project interface | Default, manual winding |
| Sellita SW200-1 | Preserved Podvig project interface | Automatic variant |
| Sellita SW300-1 | Separate slim automatic profile | Foot/aperture dimensions checked against the SW300 drawing |
| Sellita SW260-1 | Original shared project template | Small-seconds layout still needs engineering |
| Other Sellita | Editable starting interface | Calibrate against the exact calibre; not blanket Sellita compatibility |
| TMI NH34A | GMT movement dial interface | Larger centre hole; no fourth GMT hand generated |
| TMI NH35A | Date dial interface | Separate from NH34 |
| TMI NH36A | Date-only interface | Day disc remains covered |
| TMI NH37A | Main dial/date interface | Subsidiary 24-hour display not generated |
| TMI NH38A | No date, open heart | Manufacturer opening preset |
| TMI NH39A | Main dial/open-heart interface | Subsidiary 24-hour display not generated |
| TMI NH25 / NH26 | Legacy family starting templates | NH35-derived, explicitly **unverified**; calibrate before manufacture |
| Miyota 9015 | 9-series date interface | Matching disc needed for a different date position |
| Miyota 9039 | 9-series no-date interface | No native open heart |
| Miyota 90S5 | 9-series open-heart interface | Manufacturer opening preset |
| Miyota 8215 | 8-series date interface | Different feet from 9-series |
| Miyota 8205 | 8-series date-only interface | Day disc remains covered |
| Miyota 82S0 | 8-series open-heart interface | Manufacturer opening preset |

Representative manufacturer dimensions encoded in these profiles:

| Interface | Foot 1 offset (mm) | Foot 2 offset (mm) | Foot Ø | Centre hole Ø | Date: inner radius / tangential width / radial height |
|---|---|---|---:|---:|---|
| SW210 / SW200 project; SW300 rectangular aperture | (−11.6000, +3.7800) | (+11.6000, −3.7800) | 0.7500 | 2.0000 | 8.8500 / 2.0000 / 2.7000 |
| NH35A, date portion used for NH36A/NH37A | (+9.6720, −8.6670) | (−9.4660, +8.9300) | 0.6400 | 2.0500 | 9.1000 / 2.0000 / 2.9000 |
| NH34A, current Dial drawing | (+9.6720, −8.6670) | (−9.4660, +8.9300) | 0.6400 | 2.8800 | 9.1000 / 2.0000 / 2.9000 |
| Miyota 9015 | (−11.6000, +3.7600) | (+11.8500, −2.8300) | 0.7000 | 2.0000 | 8.8500 / 2.0000 / 2.7000 |
| Miyota 8215 / 8205 | (−9.8700, −6.0000) | (+9.3200, +6.0000) | 0.7500 | 2.0000 | 8.8500 / 2.0000 / 2.7000 |

Drawing revisions matter. TMI's current downloads can differ from older indexed drawings. The encoded NH35/NH34 figures above come from the downloaded **Dial-1 / Dial** drawings, with dimensions converted from their stated units. A foot diameter is nominal component geometry; machining clearance, welding procedure and drawing tolerances still need an explicit manufacturing decision.

Use **Calibrate movement interface** to enter another centre hole and foot coordinates/diameter. The separate date and heart controls complete the editable interface. The generic Sellita and legacy NH2x options are useful starting points, but are labelled unverified because inherited coordinates cannot establish physical compatibility.

### Crown and date are independent

For crown angle `c`, the movement rotates by `δ = c − 90°`:

```text
x′ = x cos δ − y sin δ
y′ = x sin δ + y cos δ
```

This rotates feet and the balance opening about (20,20). It does not rotate the printed hour numerals or the whole dial.

The date selector offers **3H, 6H, 9H, 12H, 4:30H, no date, custom angle**, or **follow movement / crown rotation**. The date rectangle is constructed at 6H with its inner edge at the specified radius, then rotated by `dateAngle − 180°`. Thus “width” means tangential extent; “height” means radial extent, even at 3H.

**An aperture can be drawn at an angle where the installed calendar disc cannot display an upright, centred numeral.** The studio reports differences from the preset. It does not claim to reindex a day wheel or change the printing on a date disc.

### Open heart

| Movement | Balance-opening centre offset at a 3H crown | Opening diameter |
|---|---|---:|
| NH38A / NH39A | (−6.8270, +0.5580) mm | Maximum 10.0000 mm |
| Miyota 90S5 | (+7.4000, +4.7000) mm | 8.6000 mm |
| Miyota 82S0 | (−7.0000, −0.7000) mm | 9.0000 mm |

Heart offsets are entered in the movement's 3H frame and rotate with crown position. Adding a window to a movement without a native balance opening is a custom design study; it does not make an opaque movement plate transparent.

The same heart/date contours cut the preview base, sandwich base and brass export. Print elements whose conservative bounds intersect an aperture are omitted as whole elements, avoiding broken glyph fragments. This can omit more ink than a Boolean contour subtraction would. Mechanical checks detect aperture/perimeter, centre-hole and foot conflicts with a 0.10 mm geometric margin. That margin is a collision check, not a validated minimum structural web for every material or process.

## Why the octagon is hour-aligned

For watch angle θ and vertex radius R:

```text
V(θ) = (20 + R sin θ, 20 − R cos θ)
θ ∈ {30°, 60°, 120°, 150°, 210°, 240°, 300°, 330°}
```

Let `a = R cos 30°` and `b = R sin 30°`. Relative vertices are `(±b,±a)` and `(±a,±b)`. Connecting consecutive vertices gives horizontal/vertical and 45° diagonal edges. The cardinal edge length is `2b = R`; the diagonal edge length is `√2(a−b)`. These lengths differ: this is intentionally **not a regular octagon**.

A regular octagon has vertices every **45°**, commonly starting at **22.5°**. Watch hour rays occur every **30°**. A 45° progression cannot place all eight non-cardinal corners on the 30°/60° hour rays. Rotating a regular octagon does not fix that mismatch.

### Corridor clip

For a full selected gap `g`, set `d = g/2`. The virtual corner stays on its hour ray at radius R. Clip each adjacent edge where its perpendicular distance from the ray reaches d:

```text
horizontal/vertical truncation = d / cos 30°
diagonal truncation along edge = d / cos 15°
diagonal X and Y step          = d / (√2 cos 15°)
```

At the default `g = 1.00 mm`, these distances are approximately 0.5774, 0.5176 and 0.3660 mm. Endpoints lie on the two parallel corridor boundaries ±0.50 mm from the ray. Each segment retains its original edge direction.

### Symmetric equal-radius normal offset

With ray unit vector `u = (sin θ, −cos θ)` and normal `n = (cos θ, sin θ)`:

```text
P− = C + R u − d n
P+ = C + R u + d n
```

Both endpoints have radius `√(R²+d²)` and equal/opposite bearings around the hour ray. This gives equal-radius symmetry instead of clipping the edges of the same virtual polygon.

Both methods preserve the original top emblem opening and the selectable 6H / all-cardinal openings. The **1.00 mm parameter describes the centreline endpoint corridor**. A 0.34 mm-wide stroke has a finite projection into that corridor; no extra ink-gap compensation is silently added by the CAD exporter.

## Complete ten-layer SVG structure

| Layer | Contents |
|---:|---|
| 1 | Dial base; centre/date/heart contours; sandwich construction; optional feet/crown references |
| 2 | Hour-aligned octagon, metallic hexagon emblem, vector `Подвиг` wordmark, date print frame and date preview |
| 3 | Minute ticks, 11 outer pips, eight inner batons plus 6H baton, stencil 12/3/9 |
| 4 | Set 1 hour hand — Classic Military Sword |
| 5 | Set 1 minute hand — Classic Military Sword |
| 6 | Set 2 hour hand — Center-Skewed Kite |
| 7 | Set 2 minute hand — Center-Skewed Kite |
| 8 | Set 3 hour hand — Tactical Rangefinder / Collimator |
| 9 | Set 3 minute hand — Tactical Rangefinder / Collimator |
| 10 | Yellow seconds needle and silver quadcopter counterweight |

All ten groups retain `inkscape:groupmode="layer"`, stable IDs and descriptive labels. Every layered download contains all three handsets; the selected handset controls layer visibility. Feet, alternate sets and the seconds hand remain toggleable. Verification rays/calipers are an auxiliary preview group and are excluded from downloads.

The three silver architectures preserve their original silhouettes, facets, bosses and lume insets. The seconds hand retains its yellow needle, silver arms/stem, rotor shrouds and four contrasting rotor pins.

## CAD closed-outline mode

Check **Convert All Strokes to Closed Outlines (CAD / Fusion 360 Mode)** to update the viewport immediately. Normal downloads follow that checkbox. **Download 12:00 CAD SVG always enables outlines**, sets hand angles to zero, and removes verification guides.

The conversion uses explicit filled paths with `stroke="none"`:

- Lines become physical-width rectangles, square-ended rectangles or analytic round-ended stadiums through `lineToClosedPolygon()`.
- The octagon becomes closed **0.34 mm** polygons with butt ends.
- All 48 non-hour minute ticks become radial rectangles, **0.18 mm** wide.
- The date frame becomes a compound, opposite-winding **0.15 mm** rectangular ring with `fill-rule="evenodd"`.
- Six custom Cyrillic glyphs use closed contours and real counters, with a **0.18 mm** default design weight.
- Drone arms/stem become round-ended paths. Rotor shrouds become compound annular outlines with their counters preserved.
- Remaining visible decorative strokes, including the handset details, are outlined too. Closed polygon joins use offsets and the selected join/miter limit; decorative Bézier stroke edges use adaptive **0.001 mm** chord tolerance. Mechanical straight edges and circles/rings are analytic.

Four-decimal serialization is coordinate precision, not a claim of 0.0001 mm manufacturing accuracy. Decorative curve flattening, the machine, material and process determine practical accuracy.

### Fusion, FreeCAD, Shapr3D and printing

1. Use a CAD SVG for raised or recessed print geometry; use Plate 0 for blank cutting contours.
2. Import onto a sketch plane **in millimetres**, at **100% / scale 1.0**. Verify the Ø33.00 mm default perimeter and 2.00 mm centre hole before extrusion. Importers that interpret SVG units incorrectly may need an explicit unit correction.
3. Choose the desired named layer/set. Union overlapping visual facets when creating a single hand or raised solid; retaining visual facets is intentional, so the full studio SVG is not a one-click fused solid.
4. Use nested loops as holes/counters. If a CAD importer ignores SVG fill rules, select the intended nested sketch regions explicitly.
5. Extrude to your chosen prototype thickness and export STEP/STL/3MF from CAD. **The studio exports SVG, not DXF or a mesh.** DXF conversion and Bambu Studio's supported import route depend on your installed software; a CAD extrusion is the dependable path for a 3D print.

The preview includes hand-fitting circles as references. It does not define pipe lengths, press-fit tolerances, axial stack clearances or the finished hand's mass balance. Use the selected movement's hand-height drawing for those operations.

## Factory cliché plates and brass blueprint

All four exports use the current geometry on the same **40 × 40 mm sheet**, in black only. They contain no raster image, live text/font, gradients, glow, hands, preview date digits or cyan guides.

Each has four registration targets at **(3,3), (37,3), (37,37), (3,37)**. Targets use a **Ø1.00 mm circle centreline** and **2.00 mm crosshair centreline lengths**, with 0.05 mm physical hairline weight, represented as closed paths. They are in a separate registration group.

| Export | Default filename | Contents |
|---|---|---|
| Plate 0 | `podvig_plate0_brass_blank_sw210.svg` | Mechanical outer perimeter, centre/date/heart contours, active feet, alternate Swiss feet reference layer, applied-logo pins and separate sandwich-cut layer |
| Cliché A | `podvig_cliche_A_octagon.svg` | Closed octagon print polygons |
| Cliché B | `podvig_cliche_B_white_print.svg` | 48 minute ticks, six closed wordmark glyphs and enabled date frame |
| Cliché C | `podvig_cliche_C_lume_mask.svg` | Stencil 12/3/9, eight inner batons, 6H baton and 11 outer pips |

Selecting SW200 gives the originally requested Plate 0 filename, **`podvig_plate0_brass_blank_sw200.svg`**. Other movements receive their own Plate 0 suffix. Cliché artwork is a black positive mask regardless of the intended ink/lume colour. The plate title/description records the movement and diameter; do not distinguish plates solely by filename when producing multiple designs.

Plate 0 uses **`stroke="#000000" stroke-width="0.0500" fill="none"`** mechanical centreline contours. The 0.05 mm display stroke is **not laser kerf allowance**. Its sandwich layer contains 23 marker paths in the unobstructed default design. Overlapping marks are suppressed when apertures move. **Select the manufacturing layers deliberately**: registration marks, alternate feet and sandwich cuts are not all necessarily part of one cutting operation.

Plate B respects **Show Printed White Frame** and the date/no-date setting. Factory exports are independent of handset visibility, lighting, finish preview and whether the live CAD checkbox is enabled. Apertures and marker suppression are shared with the preview.

Hand the toolmaker the required polarity, mirror direction, ink, etch depth, substrate thickness and kerf/clearance specification separately. The SVGs establish nominal planar geometry; they do not choose those process settings.

## Sources and engineering limits

- [Sellita movement catalogue](https://sellita.ch/index.php/en/movements): movement families; SW210 is the user's current project selection.
- [Sellita SW300-1 technical documentation](https://sellita.ch/scripts/calibres/images/DocTec_SW300-1.pdf), *Indications for dial*: feet and rectangular date aperture.
- [Sellita catalogue, SW260 entry](https://sellita.ch/images/documents/Catalogue2020_FR.pdf): small-seconds architecture.
- TMI specification sheets: [NH34](https://www.timemodule.com/upload/category/23/spec_sheet/NH34_SS.pdf), [NH35](https://www.timemodule.com/upload/category/24/spec_sheet/NH35_SS.pdf), [NH36](https://www.timemodule.com/upload/category/25/spec_sheet/NH36_SS.pdf), [NH37](https://www.timemodule.com/upload/category/26/spec_sheet/NH37_SS.pdf), [NH38](https://www.timemodule.com/upload/category/27/spec_sheet/NH38_SS.pdf), [NH39](https://www.timemodule.com/upload/category/28/spec_sheet/NH39_SS.pdf).
- Miyota drawings: [9015](https://miyotamovement.com/uploads/product/product_C0gp6HBJ5yn8VSLoQl.pdf), [9039](https://miyotamovement.com/uploads/product/product_wvsNLx6tfbemgQMaJP.pdf), [90S5](https://miyotamovement.com/uploads/product/product_fQKr6dC1qcPEJenVsR.pdf), [8215](https://miyotamovement.com/uploads/product/product_e1LVWPzublqQIDFgYh.pdf), [8205](https://miyotamovement.com/uploads/product/product_IPGm1qWaQ3zUKMCHA8.pdf), [82S0](https://miyotamovement.com/uploads/product/product_fLUnS0DTbqcoxth1Vw.pdf).

The Swiss project dimensions are preserved as requested. Shared dimensions do not imply identical movement height, stem height, movement spacer or hand stack. Legacy NH2x and generic Sellita profiles are explicitly calibration templates. The studio does not yet generate day apertures, GMT fourth hands, chronograph/subsidiary displays or arbitrary movement-specific extra arbor holes.

## Regression tests

```sh
npm ci
npm test
```

Tests run the complete inline application in jsdom and exercise DOM events/download handlers. They verify the fixed sheet/arbor/default geometry, both octagon methods, cap geometry, live CAD toggling, all ten layers, all nine export buttons, plate contents and monochrome output, four-decimal dimensions, movement-independent sizing, crown/date independence, invalid geometry handling and a matrix of movement/size/crown configurations.

These are geometry and DOM interaction checks, **not a substitute for an import test in your actual CAD or toolmaking software**. No runtime dependency is introduced by the test harness.

## Further development

Extend the data registry one exact movement/revision at a time. Useful next steps are named user calibration presets, configurable day windows, subsidiary arbors/GMT hands, true Boolean artwork subtraction, material/process allowances, alternate applied-emblem layouts, calibrated import/export fixtures for CAD applications and automated Pages deployment where repository settings permit it.

The long-term goal is a general SVG dial tool for common movements. The engineering rule is simple: **scale decoration; preserve the movement interface; make unsupported geometry explicit.**
