---
name: Dark Fantasy TTRPG Engine
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#e4beba'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#ab8986'
  outline-variant: '#5b403e'
  surface-tint: '#ffb3ad'
  primary: '#ffb3ad'
  on-primary: '#68000a'
  primary-container: '#ff5451'
  on-primary-container: '#5c0008'
  inverse-primary: '#b91a24'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#c4c7c9'
  on-tertiary: '#2d3133'
  tertiary-container: '#8e9193'
  on-tertiary-container: '#272a2c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3ad'
  on-primary-fixed: '#410004'
  on-primary-fixed-variant: '#930013'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Epilogue
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Epilogue
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Epilogue
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Epilogue
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  title-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
  stat-display:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system crafts a sleek, tactical digital grimoire engineered for high-intensity tabletop roleplaying. It balances dark fantasy immersion with high-density data legibility, rejecting faux-parchment skeuomorphism in favor of an arcane-industrial aesthetic: deep obsidian depths, obsidian-glass layers, razor-sharp status indicators, and luminous crimson and amber visual charges.

Targeting modern tabletop players and Dungeon Masters who operate at speed, the interface conveys tactical precision, arcane mystery, and authoritative game state management. The visual language utilizes a hybrid approach: dark glassmorphism merged with refined, tonal surface layering, illuminated by subtle internal edge-lighting and enchanted glowing accents that react dynamically to combat and spellcasting states.

## Colors
The palette is rooted in atmospheric dark slate and obsidian foundational tiers, accented by visceral dragon crimson and mystic gold/amber to govern interaction states, combat urgency, and mystical reserves.

- **Foundational Neutrals**: Surface zero sits at Obsidian Base (`#0a0f1d`), rising through Slate Void (`#0f172a`), Surface Container (`#1e293b`), and Surface Hover (`#334155`). Subdued text uses muted ash (`#94a3b8`), while primary text remains luminous off-white (`#f8fafc`).
- **Dragon Crimson (Primary)**: `#ef4444` functions as the core pulse for martial actions, health deficits, critical indicators, active combat buttons, and destructive spell mechanics, backed by a deeper blood-crimson (`#dc2626`) for pressed and active states.
- **Arcane Amber / Gold (Secondary)**: `#f59e0b` and `#fbbf24` dictate experience values, inspiration toggles, spell slot stars, legendary actions, and active proficiencies.
- **Parchment Ghost (Subtle Support)**: `#fef3c7` with 5% to 12% opacity provides soft structural lines, card divider runes, and parchment-scented background card gradients without cluttering the screen with faux paper textures.
- **Status Accents**: Emerald Guard (`#10b981`) indicates stabilization and healing surges; Ethereal Violet (`#8b5cf6`) marks ritual spells and concentration checks.

## Typography
The system employs a dual-discipline typographic hierarchy designed for split-second legibility during encounters:

1. **Display & Section Headers (Epilogue)**: Imparts a sculpted, authoritative structure reminiscent of runic stone monuments, giving major sheet headers, character names, and sheet sections a commanding presence.
2. **Operational Body (Inter)**: Delivers uncompromised clarity for complex Spanish spell mechanics, item descriptions, and feature rulings. High x-height prevents fatigue during low-light sessions.
3. **Tactical Data & Scores (JetBrains Mono)**: Handles all numerical statistics, ability modifiers, dice formulas (e.g., `1d8 + 4`), and compact UI badges. Its monospaced rhythm ensures numbers do not shift during live modifier adjustments.

All core sheet terminology must strictly adhere to standardized Spanish 5e nomenclature (e.g., *Fuerza, Destreza, Constitución, Inteligencia, Sabiduría, Carisma, Puntos de Golpe, Clase de Armadura, Inspiración, Salvaciones, Conjuros, Acciones, Rasgos, Inventario*).

## Layout & Spacing
The layout follows a modular tactical dashboard pattern designed to avoid vertical scrolling whenever possible during combat.

- **Grid Structure**: A responsive 12-column system for wide viewports, transitioning to an 8-column layout on tablets and a single-column stacked tab flow on mobile. Gutter width remains locked at `1rem` on compact displays, expanding to `1.5rem` on monitors above 1280px.
- **Sheet Architecture**: 
  - **Desktop**: A three-tier column layout: Left anchor (Attributes, Saving Throws, Senses, Skills), Center battlefield (Vitals, Health Tracker, Active Weapons, Combat Actions), Right codex (Tabbed container for Conjuros, Rasgos, and Inventario).
  - **Mobile / Tablet**: The vitality bar (Puntos de Golpe, CA, Iniciativa) remains pinned to the upper display, while a docked bottom-rail switches between *Estadísticas*, *Combate*, *Conjuros*, and *Equipo*.
- **Rhythm**: Compact vertical padding (`0.25rem` to `0.5rem`) keeps stat modifiers and spell lists scannable, while major module partitions maintain `1.5rem` breathing room.

## Elevation & Depth
Elevation is realized through obsidian glass surfaces, tinted edge luminosity, and focused atmospheric lighting rather than generic black drop shadows.

- **Surface 0 (Background)**: `#0a0f1d` matte finish with an ambient top-centered radial falloff (`rgba(220, 38, 38, 0.04)`).
- **Surface 1 (Card Foundation)**: `#0f172a` tinted with 80% opacity and `backdrop-filter: blur(12px)`. Enclosed by a 1px border of `rgba(248, 250, 252, 0.08)`.
- **Surface 2 (Interactive Modules & Stat Blocks)**: `#1e293b` with a crisp 1px top border of `rgba(248, 250, 252, 0.15)` and bottom border of `rgba(0, 0, 0, 0.4)`. Casts an ambient shadow: `0 8px 24px -4px rgba(0, 0, 0, 0.6)`.
- **Surface 3 (Modals, Context Menus & Rolling Trays)**: `#1e293b` elevated with a double border: an interior `1px solid rgba(245, 158, 11, 0.2)` ring and an exterior shadow `0 16px 40px -8px rgba(0, 0, 0, 0.8)`.
- **Arcane Luminescence**: Hovered attack rolls and active spell preparation trigger localized inner glows:
  - Martial / Lethal actions: `box-shadow: 0 0 12px 1px rgba(239, 68, 68, 0.35)`
  - Inspiration & Spell slots: `box-shadow: 0 0 14px 2px rgba(245, 158, 11, 0.3)`

## Shapes
The design uses rounded forms (`0.5rem` base, `1rem` on container cards) to balance ergonomic modern software conventions with fantasy aesthetics.

- **Primary Cards & Containers**: Feature `1rem` corners (`rounded-lg`), softening technical tables and preventing the sheet from feeling sterile.
- **Ability Score Modifier Pods**: Styled as vertical pill-rounded modules with cut inner facets (`0.5rem` outer radius) that place the large numerical modifier (e.g., `+4`) front and center, nesting the raw base score (e.g., `18`) in a compact badge below.
- **Vitals & Counters (CA, Puntos de Golpe, Velocidad)**: Diamond-inspired squircle shapes or rounded shields (`rounded-lg` with 45-degree corner chamfer accents) designate armor class and defensive metrics.
- **Action Pills & Badges**: Fully rounded (`9999px`) for quick-glance chips like spell components (*V, S, M*), damage types (*Cortante, Fuego*), and action economy markers (*Acción, Acción Adicional, Reacción*).

## Components

### Ability Score Pods (Puntuaciones de Característica)
- Compact vertical cards displaying *Fuerza*, *Destreza*, *Constitución*, *Inteligencia*, *Sabiduría*, and *Carisma*.
- Top region displays the calculated modifier using `stat-display` typography with an explicit `+` or `-` sign. Hover triggers a fiery amber or crimson aura.
- Lower pill displays the base attribute score in `label-sm` monospaced type against `#0f172a`.
- Clicking the modifier directly sends a `d20 + MOD` check to the dice log.

### Vitality Hub (Puntos de Golpe & CA)
- **Clase de Armadura (CA)**: Shield-shaped module with an active obsidian reflective surface, holding a high-contrast monospaced figure.
- **Puntos de Golpe (PG)**: Multi-state health bar. Green-to-amber-to-red gradient fill based on current percentage. Features quick-action modifier inputs (`+ Curar`, `- Daño`, and temporary HP tracking (`PG Temporales`)).
- **Iniciativa & Inspiración**: Inspiration functions as an arcane coin toggle that radiates a gold glow (`#f59e0b`) when active.

### Buttons & Interactive Triggers
- **Primary Action (Lanzar Conjuro / Atacar)**: Crimson base (`#dc2626`) with bright crimson hover (`#ef4444`), crisp white label, and micro-embossed top highlight.
- **Secondary Action (Descanso Corto / Descanso Largo)**: Slate surface (`#1e293b`) with subtle parchment border (`rgba(254, 243, 199, 0.2)`), brightening on hover.
- **Roll Button**: Miniature dice icon embedded into a `label-md` chip, executing roll animation on click.

### Tabs & View Selectors
- Flat horizontal rail featuring items like *Acciones*, *Conjuros*, *Inventario*, *Rasgos*, and *Notas*.
- Selected tab is highlighted by an obsidian-slate pill background and an active Dragon Red or Amber bottom border line (`2px solid #ef4444`) with an ambient underglow.

### Spell Slots (Espacios de Conjuro) & Resource Trackers
- Tiered grids representing spell levels (Nivel 1 to Nivel 9).
- Slot counters render as glowing circular or diamond glyph pips: empty slots show a hollow dark ring with an amber border; filled slots show an incandescent amber ember that dims upon consumption.

### Lists & Inventory (Inventario)
- Alternating subtle rows (`#0f172a` and `#141f36`) with thin dividers (`rgba(248, 250, 252, 0.04)`).
- Items display encumbrance weight, attuned status (indicated by an amber runic ring), quantity counter, and a single-click roll trigger for weapon attacks.
- Integrated search bar with instant autocomplete for items, traits, and spells.

### Form Inputs & Checkboxes
- Checkboxes for *Competencias* (Proficiencies) and *Salvaciones* (Saving Throws) render as stylized diamond toggles: empty indicates non-proficient, single gold fill marks proficiency, and a double-ring crimson glow marks expertise (*Pericia*).
- Inputs feature recessed dark backgrounds (`#0a0f1d`) with an active crimson/amber outline on focus.