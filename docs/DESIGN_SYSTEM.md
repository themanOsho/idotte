Perfect timing.

Before we build **Allocation Upload**, we need to establish the **Idotte Design System**. This is what every screen will follow. The goal is that six months from now, every new page still looks like it belongs to the same product.

---

# Idotte Design Principles

Our inspiration:

* **Linear** → Clean spacing
* **Vercel** → Typography
* **Stripe** → Professional feel
* **Notion** → Simplicity

**Not** government portals.

---

# Personality

If Idotte was a person:

> Calm.
> Professional.
> Fast.
> Trustworthy.

No flashy gradients.

No oversized icons.

No unnecessary animations.

---

# Color System

Inspired by Lagos State without copying its branding.

## Primary

```css
Emerald 700
```

Used for:

* Primary buttons
* Active states
* Progress
* Success

---

## Accent

```css
Amber 500
```

Used sparingly.

Only for:

* Warnings
* Highlights
* Statistics

---

## Neutral

```css
Slate
```

This becomes 90% of the interface.

---

## Semantic Colors

| Purpose    | Light     | Dark      |
| ---------- | --------- | --------- |
| Background | White     | Zinc 950  |
| Surface    | Slate 50  | Zinc 900  |
| Border     | Slate 200 | Zinc 800  |
| Text       | Slate 900 | Slate 100 |
| Muted      | Slate 500 | Slate 400 |
| Success    | Emerald   | Emerald   |
| Warning    | Amber     | Amber     |
| Error      | Red       | Red       |

---

# Typography

One font.

**Geist**

Nothing else.

---

## Heading 1

Used only once.

```text
48px
Bold
```

Example

```
Placement Report Generator
```

---

## Heading 2

```text
30px
SemiBold
```

---

## Heading 3

```text
24px
Medium
```

---

## Body

```text
16px
Regular
```

---

## Small Text

```text
14px
```

---

## Caption

```text
12px
```

---

# Spacing

Everything should align to an **8px grid**.

Never invent spacing.

Use:

```text
4

8

12

16

24

32

48

64
```

Nothing random like

```text
19px

27px

53px
```

---

# Border Radius

Cards

```text
16px
```

Buttons

```text
12px
```

Inputs

```text
12px
```

Dialogs

```text
18px
```

---

# Shadows

Very subtle.

Like Linear.

```text
shadow-sm
```

Mostly.

Only large dialogs use

```text
shadow-lg
```

---

# Cards

This will become our most-used component.

Every major section lives inside a card.

Example

```
+-------------------------------------------+

Upload Allocation Dataset

Upload the official allocation workbook.

[ Choose Excel ]

+-------------------------------------------+
```

---

# Buttons

Only three types.

## Primary

Green.

```
Generate Report
```

---

## Secondary

Outline.

```
Cancel
```

---

## Ghost

Text only.

```
Process Another Client
```

---

# Inputs

Simple.

Never floating labels.

Always:

```
Label

[input]
```

---

# Upload Zone

Probably the most important component.

```
+---------------------------------------+

📄

Upload Allocation Dataset

Drag & drop

or

Choose Excel File

Supported

.xlsx

+---------------------------------------+
```

Later

Same component

```
Upload Client List

Excel

or

PDF
```

---

# Tables

Very clean.

```
Name

Sex

DOB

School

Centre
```

No vertical borders.

Only horizontal separators.

---

# Icons

Only Lucide.

No emoji.

Examples

```
Upload

File

Check

Alert

Download

Search

Sun

Moon
```

Consistent.

---

# Motion

Very little.

Fade

150ms

Hover

100ms

Nothing bouncy.

---

# Layout

Desktop

```
+--------------------------------------+

Navbar

----------------------------------------

Content

----------------------------------------

Footer

+--------------------------------------+
```

---

# Page Width

Never full width.

```text
max-w-7xl
```

or

```text
max-w-6xl
```

Centered.

---

# Empty States

Instead of blank pages.

```
No Allocation Uploaded

Upload your Allocation workbook
to begin.

[ Upload ]
```

---

# Success State

```
✓ Allocation Loaded

5234 Candidates

Ready
```

---

# Error State

Red left border.

Simple.

```
Unable to read workbook.

Try another file.
```

---

# Loading

Skeletons.

Not spinners.

Except

Processing.

---

# Theme

Light

↓

Default.

Dark

↓

Fully supported.

---

# Component Naming

```
PageHeader

SectionCard

UploadDropzone

StatusBadge

SummaryCard

ReportTable
```

Predictable.

---

# Folder Structure

I'd slightly improve our components folder.

```
components/

layout/

navigation/

upload/

cards/

tables/

feedback/

theme/

ui/
```

Instead of

```
allocation/

client/
```

Because upload cards can be reused everywhere.

---

# My First Screen

When Idotte opens:

```
+----------------------------------------------------+

                 IDOTTE

Placement Report Generator

Generate placement reports from allocation
datasets in minutes.

──────────────────────────────────────────────────────

Upload Allocation Dataset

[ Choose Excel ]

──────────────────────────────────────────────────────

No allocation loaded

──────────────────────────────────────────────────────

© Idotte

+----------------------------------------------------+
```

Notice something?

Only **one action**.

Upload Allocation.

No clutter.

---

# 🎯 Before We Build UI

I'd like us to create **design tokens** so we don't hardcode colors and spacing throughout the app.

Let's add a `src/config` folder:

```text
src/
├── config/
│   ├── site.ts
│   └── theme.ts
```

`theme.ts` can export reusable values like spacing, border radius, and semantic colors if we need them later, while CSS variables handle the visual implementation.

Then we'll customize `globals.css` with our brand colors (emerald-inspired palette), typography, and reusable utility classes such as:

* `.page-container`
* `.page-header`
* `.section-card`
* `.upload-zone`

That way, when we start building screens, we're composing with a design system instead of rewriting styles each time.

**This is how products like Linear and Vercel stay visually consistent, and it's exactly the habit I want us to build with Idotte.**
