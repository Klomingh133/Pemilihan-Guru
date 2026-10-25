# Design System: Pemilihan Guru Favorit Hari Guru

A clean, high-performance, accessible design system tailored for offline-first, high-traffic school kiosk environments and Kahoot-style celebratory auditorium projection.

---

## 1. Visual Theme & Atmosphere

- **Atmosphere:** Clean, intentional, modern, and trustworthy. Combines the tactile responsiveness and hairline crispness of modern developer tools (Linear-inspired) with the human-centric legibility and smooth micro-interactions of Apple interfaces.
- **Kiosk Mode (Student Voting):** Pure, distraction-free environment with high contrast, large touch targets, 5-column desktop layout (preventing vertical scroll overwhelm), and zero decorative noise.
- **Celebration Mode (Kahoot Results):** Dramatic, high-contrast dark canvas (`#0b0f19` / Deep Midnight Obsidian) optimized for projector contrast, with jewel-toned metallics (Gold, Silver, Bronze) and clear hierarchy.

---

## 2. Color Palette & Roles

### Student Kiosk & Neutral Surfaces
- **Canvas Base (`#f8fafc` / Slate-50):** Soft, non-glare background for prolonged tablet/laptop usage.
- **Card Surface (`#ffffff` / Pure White):** High-clarity elevated surface for teacher cards and interactive dialogs.
- **Hairline Border (`#e2e8f0` / Slate-200):** 1px subtle separation keeping layout defined without visual clutter.
- **Ink Primary (`#0f172a` / Slate-900):** Deepest charcoal for primary headings and candidate names. High contrast (WCAG AAA).
- **Ink Muted (`#475569` / Slate-600):** Secondary guidance text, counter metrics, and helper copy.
- **Ink Subtle (`#94a3b8` / Slate-400):** Placeholder text, numbering badges, and timestamp metadata.

### Accent & Interaction
- **Brand Primary (`#2563eb` / Royal Blue-600):** Primary action color, active selection ring, and interactive focus states.
- **Brand Hover (`#1d4ed8` / Royal Blue-700):** High-intent press and hover state.
- **Success (`#059669` / Emerald-600):** Vote submission confirmation, checkmark pulses, and verified status.
- **Warning / Alert (`#e11d48` / Rose-600):** Destructive actions, reset confirmations, and critical error states.

### Celebration & Podium Accents
- **Gold (`#f59e0b` / Amber-500):** Rank 1 (Juara Emas) with warm radial bloom (`rgba(245, 158, 11, 0.25)`).
- **Silver (`#94a3b8` / Slate-400):** Rank 2 (Juara Perak) with cool metallic tone.
- **Bronze (`#d97706` / Amber-600):** Rank 3 (Juara Perunggu) with warm copper tone.

---

## 3. Typography & Lettering

- **Typeface:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
- **Display Headings (`font-black tracking-tight`):**
  - Hero Display: 36px–48px / Line-height 1.1 / Tight negative tracking (`-0.03em`).
  - Section Title: 24px–30px / Line-height 1.2 / Snug tracking (`-0.02em`).
- **Teacher Names:**
  - Kiosk Grid: 15px–16px (`text-sm sm:text-base font-extrabold`).
  - Confirmation Modal: 24px–28px (`text-2xl sm:text-3xl font-black`).
- **Body & Captions:**
  - Body Text: 14px (`text-sm font-medium`).
  - Badges & Numbers: 11px–12px (`text-xs font-black uppercase tracking-wider`).

---

## 4. Component Stylings & Micro-Interactions

### Teacher Card (`TeacherCard.tsx`)
- **Dimensions & Ratio:** 4:5 vertical proportion or balanced square on mobile; consistent photo header with 1:1 aspect ratio.
- **Unselected State:** White card, 1px `#e2e8f0` border, subtle shadow (`shadow-xs`), hover elevation (`-translate-y-1` and `shadow-md`).
- **Selected State:** Ring-2 in Royal Blue (`ring-2 ring-blue-600 border-blue-600`), soft blue fill (`bg-blue-50/40`), elevated blue check badge.
- **Photo Placeholder:** Neutral slate avatar with clear uppercase `"FOTO BELUM TERSEDIA"` indicator when `photoUrl` is `null`.

### Confirmation & Feedback Modal (`StudentConfirmation.tsx`)
- **Structure:** Single clean floating card (`max-w-sm rounded-3xl p-6 sm:p-7 shadow-2xl`), eliminating nested sub-containers.
- **Loading State:** Centered card with gentle spinner and animated bar with `"Tunggu..."`.
- **Success Pop-In:** Spring-eased check icon pulse with `"Terkirim"` text, followed by immediate seamless transition to next voter session.

### Navigation & Actions
- **Kiosk Submit Button:** Large, full-finger tap target (`h-12` to `h-14`), accessible to both touch and mouse users.
- **Active State:** Tactile spring feedback (`active:scale-95` / `active:scale-[0.98]`).

---

## 5. Responsive Grid & Layout Principles

- **Desktop (>= 1280px):** 5-column grid (`grid-cols-5`). Provides optimal scanability for 21 candidates without requiring excessive vertical scrolling.
- **Tablet / Medium Screens (768px - 1279px):** 3 to 4 columns.
- **Mobile (< 768px):** 2 columns with optimized compact margins and sticky action bar.
- **Offline Reliability:** All styles, animations, and icons are bundled locally with zero external network dependencies.
