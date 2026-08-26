# Project UI & Design System Guidelines

This document standardizes the visual aesthetic and typography hierarchy for the application, based on the approved design inspiration and typography system specifications.

---

## 🎨 1. Visual Aesthetics & Design Language

- **Overall Feel**: Modern, clean, friendly product/UI with light neutral backgrounds, rounded containers, and soft drop shadows.
- **Card Aesthetics**: Soft pastel containers (`rounded-2xl` / `20px-24px` radius) with high-contrast text and vibrant accent highlights.
- **Primary Accent**: Energetic Blue (`#3b82f6` / `#2563eb`).
- **Pastel Palette**:
  - Soft Blue: `#eef2ff`
  - Soft Emerald Green: `#ecfdf5`
  - Soft Warm Amber: `#fffbeb`
  - Soft Rose: `#fff1f2`
  - Soft Lavender: `#f5f3ff`
- **Component Styling**:
  - Pill buttons (`rounded-full`)
  - Elevated cards (`shadow-sm`, `shadow-md` with soft ambient blur)
  - Clean floating action buttons & circular progress rings

---

## 🔤 2. Typography System (Inter Font)

**Primary Font Family**: `Inter`, sans-serif

### Font Weight Hierarchy
| Weight | Level | Usage |
| :--- | :--- | :--- |
| **800** | Extra Bold / Display | Main hero titles / prominent stats / key metrics |
| **750 / 700** | Bold / Heavy | Page titles (`h1`) & section headings (`h2`) |
| **600** | Semi-Bold | Card titles (`h3`), buttons, important badges & labels |
| **500** | Medium | Navigation links, sub-labels, emphasized body text |
| **400** | Regular | Body copy, paragraph text |

---

## 📐 3. Type Scale & CSS Reference

| Element | Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Hero / Display Headline** | 48px – 50px | 750 – 800 | `1.05` | `-1.5px` |
| **Section Heading (`h2`)** | 28px – 30px | 700 | `1.2` | `-0.5px` |
| **Card Heading (`h3`)** | 18px – 20px | 600 | `1.3` | `normal` |
| **Body Text (`body`)** | 15px – 16px | 400 | `1.5` | `normal` |
| **Secondary / Muted** | 13px – 14px | 400 – 500 | `1.4` | `normal` |
| **Small Labels / Badges** | 11px – 13px | 500 – 600 | `1.2` | `normal` |

---

## 📌 4. Core Design Rules

1. **Fixed Typography Hierarchy**: Keep typography sizing, weight, spacing, and hierarchy strictly consistent across all pages and components.
2. **Compact Heading Style**: Main headlines should feel confident and compact with tight line height and negative letter-spacing (`letter-spacing: -0.5px` to `-1.5px`).
3. **Harmonious Color Usage**: Use soft pastel backdrops for cards and content blocks to keep the layout clean, readable, and visually pleasing.
