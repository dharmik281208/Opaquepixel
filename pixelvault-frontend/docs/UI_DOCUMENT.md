# PixelVault — UI Design Document

**Product:** PixelVault Advanced Steganography Platform  
**Domain:** opaquepixel.app  
**Document Version:** 1.0  
**Stack:** React 18 · Vite · Tailwind CSS 3 · React Router 6  
**Classification:** Internal — Frontend Reference

---

## Table of Contents

1. [Overview](#1-overview)
2. [Design System](#2-design-system)
3. [Application Shell](#3-application-shell)
4. [Navigation & Routing](#4-navigation--routing)
5. [Page Specifications](#5-page-specifications)
6. [Component Catalog](#6-component-catalog)
7. [User Flows](#7-user-flows)
8. [States & Feedback](#8-states--feedback)
9. [Responsive Behavior](#9-responsive-behavior)
10. [API Integration](#10-api-integration)
11. [File Structure](#11-file-structure)
12. [Accessibility & UX Notes](#12-accessibility--ux-notes)

---

## 1. Overview

### 1.1 Purpose

PixelVault provides a **simple, beautiful web interface** for non-technical users to hide and reveal secret content inside ordinary image and video files. The UI prioritizes clarity, progressive disclosure, and real-time feedback over technical complexity.

### 1.2 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Dark-first** | Deep navy background reduces eye strain; accent indigo draws attention to actions |
| **Step-by-step** | Hide workflow split into numbered cards: Carrier → Payload → Encrypt |
| **Immediate feedback** | Capacity bar, toasts, loading states on every async action |
| **Minimal jargon** | Algorithm names explained inline; educational content on separate page |
| **Mobile-ready** | Responsive grids, stacked layouts, touch-friendly tap targets |

### 1.3 Target Users

- Cybersecurity students and researchers
- Privacy-conscious individuals (lawful use)
- Hackathon and academic project evaluators
- Non-technical users hiding personal messages or documents

---

## 2. Design System

### 2.1 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `vault-bg` | `#0a0e17` | Page background |
| `vault-surface` | `#111827` | Header, input backgrounds |
| `vault-card` | `#1a2234` | Card panels, secondary buttons |
| `vault-border` | `#2d3a52` | Borders, dividers |
| `vault-accent` | `#6366f1` | Primary actions, active nav, focus rings |
| `vault-accentHover` | `#818cf8` | Hover states, headings |
| `vault-success` | `#10b981` | Success toasts, result cards, capacity OK |
| `vault-warning` | `#f59e0b` | Legal disclaimer callouts |
| `vault-danger` | `#ef4444` | Errors, capacity exceeded |
| `vault-muted` | `#94a3b8` | Secondary text, hints, placeholders |

### 2.2 Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Headings (H1) | Inter | 700 (bold) | 24px (`text-2xl`) |
| Section labels | Inter | 600 (semibold) | 14px uppercase |
| Body | Inter | 400 | 14px (`text-sm`) |
| Monospace | JetBrains Mono | 400–500 | 14px (messages, filenames) |
| Footer | Inter | 400 | 12px (`text-xs`) |

**Google Fonts loaded:** Inter, JetBrains Mono

### 2.3 Spacing & Layout

- **Max content width:** `max-w-5xl` (1024px)
- **Page padding:** `px-4 py-8`
- **Card padding:** `p-6`
- **Section gap:** `space-y-6` to `space-y-8`
- **Border radius:** `rounded-lg` (8px) for controls, `rounded-xl` (12px) for cards

### 2.4 Reusable CSS Classes

Defined in `src/index.css`:

| Class | Description |
|-------|-------------|
| `.btn-primary` | Indigo filled button — main CTAs |
| `.btn-secondary` | Outlined card-style button — secondary actions |
| `.card` | Elevated panel with border and shadow |
| `.input-field` | Text input / textarea / select styling |

### 2.5 Iconography

- **Logo:** 4-pixel grid SVG (varying opacity squares) inside indigo rounded square
- **Payload modes:** Emoji icons (📝 📄 🖼️ 🎬 🎵)
- **Carrier types:** Emoji (🖼️ Image, 🎬 Video)
- **Upload:** Cloud-upload SVG in DropZone
- **Success:** Checkmark SVG in ResultCard

---

## 3. Application Shell

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (sticky)                                            │
│  [Logo] PixelVault / opaquepixel.app    Hide | Reveal | …  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MAIN CONTENT (container, max-w-5xl, centered)              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Page Title + Subtitle                               │   │
│  │  ┌──────────────┐  ┌──────────────┐                 │   │
│  │  │  Card 1      │  │  Card 2      │                 │   │
│  │  └──────────────┘  └──────────────┘                 │   │
│  │  [ Primary CTA Button — full width ]                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER                                                     │
│  PixelVault — Educational steganography · opaquepixel.app   │
│  For lawful privacy, research, and cybersecurity only.      │
└─────────────────────────────────────────────────────────────┘
                              ┌──────────────┐
                              │ Toast (fixed)│  ← bottom-right
                              └──────────────┘
```

### 3.1 Header

- **Position:** Sticky top, `z-50`, backdrop blur
- **Left:** Logo + brand name (links to `/`)
- **Right:** Three nav links with active-state highlight
- **Active state:** `bg-vault-accent/20 text-vault-accentHover`

### 3.2 Footer

- Fixed at bottom of flex column layout
- Two lines: product tagline + legal disclaimer
- Muted text, centered

---

## 4. Navigation & Routing

| Route | Page | Default |
|-------|------|---------|
| `/` | HidePage | ✓ (landing) |
| `/reveal` | RevealPage | |
| `/how-it-works` | HowItWorksPage | |

**Router:** React Router 6 `BrowserRouter` with client-side navigation (no full page reload).

---

## 5. Page Specifications

### 5.1 Hide Page (`/`)

**Title:** Hide a Secret  
**Subtitle:** Encrypt and embed messages or files invisibly inside an image or video carrier.

#### Section 1 — Carrier Type

| Element | Type | Options / Behavior |
|---------|------|-------------------|
| Carrier toggle | Button pair | Image (PNG/JPG) · Video (MP4) |
| Cover upload | DropZone | Drag-and-drop or click; resets on carrier type change |
| Algorithm selector | AlgorithmSelector | LSB / DST — **visible only for image carriers** |

**Hints:**
- Image: *"PNG or JPG — higher resolution = more capacity"*
- Video: *"MP4 video carrier"*

#### Section 2 — Payload

| Element | Type | Options / Behavior |
|---------|------|-------------------|
| Mode selector | ModeSelector | Text · Document · Photo · Video · Audio |
| Text input | Textarea | Shown when mode = Text (max 100,000 chars) |
| File upload | DropZone | Shown for all other modes |
| Capacity bar | CapacityBar | Live comparison of payload size vs carrier capacity |

**Accepted payload formats:**

| Mode | Extensions |
|------|------------|
| Text | — (inline textarea) |
| Document | `.pdf`, `.docx`, `.pptx`, `.xlsx` |
| Photo | `.png`, `.jpg`, `.jpeg` |
| Video | `.mp4` |
| Audio | `.mp3` |

#### Section 3 — Encrypt

| Element | Type | Validation |
|---------|------|------------|
| Password field | PasswordField | Minimum 8 characters |
| Helper text | Static | *"AES-256-GCM with PBKDF2 (600,000 iterations)"* |

#### Primary Action

- **Button:** "Hide Payload" (full width)
- **Loading:** "Hiding payload…" + disabled state
- **Success:** Navigate to ResultCard view

#### Result State

- ResultCard with download button (`stego.png` or `stego.mp4`)
- "Hide Another" resets all form state

---

### 5.2 Reveal Page (`/reveal`)

**Title:** Reveal a Secret  
**Subtitle:** Extract and decrypt hidden content from a stego image or video using your password.

#### Carrier File Section

| Element | Type | Options / Behavior |
|---------|------|-------------------|
| Carrier toggle | Button pair | Stego Image · Stego Video |
| Stego upload | DropZone | `.png`, `.jpg`, `.jpeg` or `.mp4` |
| Algorithm override | Select dropdown | Auto-detect · DST · LSB (image only) |

#### Decryption

| Element | Type | Validation |
|---------|------|------------|
| Password field | PasswordField | Minimum 8 characters |

#### Primary Action

- **Button:** "Reveal Payload" (full width)
- **Loading:** "Revealing…" + disabled state
- **Success:** Navigate to RevealResult view

#### Result State

| Payload Type | Display |
|--------------|---------|
| Text | Message shown in monospace panel |
| File | FormatBadge + download button |
| All | "Reveal Another" reset button |

---

### 5.3 How It Works Page (`/how-it-works`)

**Title:** How PixelVault Works

**Content blocks:**

1. **The Pipeline** — 4-step numbered list (Package → Compress → Encrypt → Embed)
2. **Algorithm cards** — Side-by-side LSB vs DST comparison
3. **Supported formats** — Carriers vs Payloads grid
4. **Legal disclaimer** — Warning-styled callout (Acceptable Use Policy)

---

## 6. Component Catalog

### 6.1 Layout Components

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `Header` | `Header.jsx` | — | Sticky nav bar with logo and routes |
| `Toast` | `Toast.jsx` | `message`, `type`, `onClose` | Fixed bottom-right notification |

### 6.2 Form Components

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `DropZone` | `DropZone.jsx` | `label`, `accept`, `file`, `onFile`, `hint` | Drag-and-drop file upload |
| `ModeSelector` | `ModeSelector.jsx` | `value`, `onChange` | 5-mode payload type grid |
| `AlgorithmSelector` | `AlgorithmSelector.jsx` | `value`, `onChange`, `disabled` | LSB / DST picker with descriptions |
| `PasswordField` | `PasswordField.jsx` | `value`, `onChange`, `label` | Password input with show/hide toggle |
| `CapacityBar` | `CapacityBar.jsx` | `payloadSize`, `capacity`, `loading` | Progress bar with size labels |

### 6.3 Result Components

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `ResultCard` | `ResultCard.jsx` | `blob`, `filename`, `onReset` | Hide success + download |
| `RevealResult` | `RevealResult.jsx` | `result`, `onReset` | Reveal success + message/file display |
| `FormatBadge` | `FormatBadge.jsx` | `type` | Color-coded payload type badge |

### 6.4 Component States

#### DropZone

| State | Visual |
|-------|--------|
| Empty | Dashed border, muted hint text |
| File selected | Green border tint, filename shown |
| Drag hover | Accent border (via hover class) |

#### CapacityBar

| State | Bar Color | Label |
|-------|-----------|-------|
| Loading | — | *"Calculating carrier capacity…"* |
| OK (payload ≤ capacity) | Indigo (`vault-accent`) | Green checkmark |
| Exceeded | Red (`vault-danger`) | *"— too large"* |
| Hidden | — | When no carrier uploaded |

#### Toast

| Type | Border / Background |
|------|---------------------|
| `success` | Green tint |
| `error` | Red tint |
| `info` | Indigo tint |

---

## 7. User Flows

### 7.1 Hide Flow

```
Landing (/)
    │
    ├─ Select carrier type (Image / Video)
    ├─ Upload cover file
    ├─ [Image only] Select LSB or DST
    │
    ├─ Select payload mode
    ├─ Enter text OR upload file
    ├─ Review capacity bar
    │
    ├─ Enter password (≥ 8 chars)
    │
    └─ Click "Hide Payload"
            │
            ├─ [Error] → Toast with API message
            └─ [Success] → ResultCard
                    │
                    ├─ Download stego.png / stego.mp4
                    └─ "Hide Another" → reset to form
```

### 7.2 Reveal Flow

```
/reveal
    │
    ├─ Select carrier type (Image / Video)
    ├─ Upload stego file
    ├─ [Optional] Override algorithm
    ├─ Enter password
    │
    └─ Click "Reveal Payload"
            │
            ├─ [Error] → Toast ("Wrong password" / API error)
            └─ [Success] → RevealResult
                    │
                    ├─ Text → display message inline
                    ├─ File → download extracted payload
                    └─ "Reveal Another" → reset to form
```

### 7.3 Validation Rules (Client-Side)

| Rule | Message |
|------|---------|
| No carrier file | *"Please upload a carrier file"* |
| No payload (text) | *"Please enter a message to hide"* |
| No payload (file) | *"Please upload a payload file"* |
| Password < 8 chars | *"Password must be at least 8 characters"* |
| No stego file (reveal) | *"Please upload a stego carrier file"* |

---

## 8. States & Feedback

### 8.1 Loading States

| Context | Button Text | Disabled |
|---------|-------------|----------|
| Hide in progress | "Hiding payload…" | Yes |
| Reveal in progress | "Revealing…" | Yes |
| Capacity calculating | CapacityBar loading message | — |

### 8.2 Error Handling

- API errors surfaced via Toast (bottom-right)
- FastAPI `detail` field parsed when available
- Blob error responses fall back to generic message

### 8.3 Success Feedback

- Toast confirmation on hide/reveal success
- Result card replaces form (full-page state change)
- Download triggered via programmatic `<a>` click

---

## 9. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **Mobile** (`< sm`) | ModeSelector: 2-column grid; domain subtitle hidden in header |
| **Tablet+** (`≥ sm`) | ModeSelector: 5-column grid; AlgorithmSelector: 2-column |
| **All sizes** | Main content centered, max 1024px; full-width CTAs |

**Touch targets:** Buttons and DropZones use minimum ~44px height (`py-3` / `p-8`).

---

## 10. API Integration

**Client:** `src/api/pixelvault.js` (Axios)  
**Base URL:** `VITE_API_URL` env var (default: `/api` via Vite proxy)

### 10.1 Hide Request

```
POST /api/hide
Content-Type: multipart/form-data

Fields:
  carrier        File
  payload_type   string
  password       string
  carrier_type   "image" | "video"
  stego_method   "lsb" | "dst"     (image only)
  payload        File               (file modes)
  payload_text   string             (text mode)

Response: application/octet-stream (blob)
```

### 10.2 Reveal Request

```
POST /api/reveal
Content-Type: multipart/form-data

Fields:
  carrier        File
  password       string
  carrier_type   "image" | "video"
  stego_method   string (optional)

Response: application/json
{
  payload_type, filename, mime_type,
  size_bytes, data_base64, message
}
```

### 10.3 Capacity Estimation (Client-Side)

Computed in `src/utils/mimeTypes.js` without API call:

| Carrier | Formula |
|---------|---------|
| Image + LSB | `(width × height × 3 − 32) / 8` bytes |
| Image + DST | `(blocks) / (8 × 3)` bytes (redundancy factor) |
| Video | `(selected_frames × blocks) / (8 × 3)` bytes |

---

## 11. File Structure

```
pixelvault-frontend/
├── public/
│   └── favicon.svg
├── docs/
│   └── UI_DOCUMENT.md          ← this file
├── src/
│   ├── App.jsx                 Root router + shell
│   ├── main.jsx                Vite entry
│   ├── index.css               Global styles + utility classes
│   ├── api/
│   │   └── pixelvault.js       Axios API client
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── TabBar.jsx          (not used — nav in Header)
│   │   ├── DropZone.jsx
│   │   ├── ModeSelector.jsx
│   │   ├── AlgorithmSelector.jsx
│   │   ├── CapacityBar.jsx
│   │   ├── PasswordField.jsx
│   │   ├── ResultCard.jsx
│   │   ├── RevealResult.jsx
│   │   ├── FormatBadge.jsx
│   │   └── Toast.jsx
│   ├── pages/
│   │   ├── HidePage.jsx
│   │   ├── RevealPage.jsx
│   │   └── HowItWorksPage.jsx
│   └── utils/
│       ├── formatSize.js
│       └── mimeTypes.js
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env                        VITE_API_URL=http://localhost:8000/api
```

---

## 12. Accessibility & UX Notes

### 12.1 Current Implementation

- Toast uses `role="alert"`
- Form inputs have associated labels
- Focus rings on inputs (`focus:ring-vault-accent`)
- Password show/hide toggle for usability

### 12.2 Recommended Improvements (Future)

- [ ] Add `aria-label` to DropZone upload areas
- [ ] Keyboard navigation for ModeSelector / AlgorithmSelector
- [ ] Screen reader announcements for capacity bar changes
- [ ] High-contrast mode option
- [ ] Reduce motion preference support

### 12.3 UX Tips for Users (in-app guidance)

- Use **high-resolution carriers** for large payloads
- Choose **DST** when sharing via WhatsApp/Telegram
- Send stego PNGs as **document attachments** (not photos) to avoid re-compression
- **Remember your password** — AES-256-GCM cannot be brute-forced feasibly

---

## Appendix A — Format Badge Colors

| Type | Badge Label | Color Theme |
|------|-------------|-------------|
| `text` | TEXT | Blue |
| `document` | DOC | Amber |
| `image` | IMG | Purple |
| `video` | VID | Rose |
| `audio` | AUD | Emerald |

---

## Appendix B — Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` | Backend API base URL |

**Development:** `http://localhost:8000/api`  
**Production:** `https://opaquepixel.app/api`

---

*— End of PixelVault UI Document —*
