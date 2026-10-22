# Aether Labs — Official Website

**Brand Tagline:** *Intelligence, engineered.*

A complete, responsive, Apple-inspired static website for **Aether Labs**, an AI engineering and software development studio specializing in:
1. **AI Engineering**
2. **Digital Product Development and Web Development**
3. **Intelligent Automation**
4. **Cloud Solutions**

---

## 1. Project Structure

```text
/
├── index.html                  # Home page (Hero, Services overview, Selected works, Principles)
├── about.html                  # About Us (Mission, 4-stage approach, Engineering philosophy, Values)
├── services.html               # Services (Detailed specs & architecture diagrams for all 4 disciplines)
├── portfolio.html              # Portfolio (4 concept systems + interactive vanilla JS category filtering)
├── contact.html                # Contact (Accessible form, client-side validation & demonstration receipt)
├── css/
│   └── style.css               # Shared Apple-inspired design system, tokens, and responsive layouts
├── js/
│   └── script.js               # Shared vanilla JS (mobile navigation, portfolio filters, form validation)
├── assets/
│   ├── icons/
│   │   └── favicon.svg         # Brand geometric SVG favicon
│   └── images/
│       ├── hero-architecture.svg
│       ├── about-blueprint.svg
│       ├── atlas-ai.svg
│       ├── pulse-commerce.svg
│       ├── flowdesk.svg
│       └── nova-cloud.svg
└── README.md                   # Project documentation
```

---

## 2. Design System Tokens

All styling is authored in native CSS3 (`css/style.css`) using CSS custom properties:

| Token | Hex | Role |
| :--- | :--- | :--- |
| `--gallery-white` | `#FFFFFF` | Primary canvas & elevated card background |
| `--studio-mist` | `#F5F5F7` | Secondary section surface & segmented control track |
| `--paper-frost` | `#FAFAFC` | Subtle container & form surface |
| `--hairline-silver` | `#D6D6D6` | Restrained 1px card and input borders |
| `--control-gray` | `#E6E6E8` | Section dividers & internal hairlines |
| `--ink` | `#1D1D1F` | High-contrast primary typography |
| `--slate` | `#707070` | Secondary body prose & metadata |
| `--steel` | `#86868B` | Muted captions, hints, and separators |
| `--blue-accent` | `#0066CC` | Editorial links & technical indices |
| `--primary-action-blue` | `#0071E3` | Primary CTA buttons & focus rings |
| `--launch-orange` | `#B64400` | Restrained section kickers & required field indicators |

---

## 3. Running the Static Website

Because the website is built with standard HTML5, CSS3, and vanilla JavaScript (`css/style.css` and `js/script.js`), it requires **no framework runtime or compilation step**:

1. **Direct Browser Open:** Open `index.html` directly in any modern browser.
2. **Any Static HTTP Server:**
   - Python: `python3 -m http.server 3000`
   - Node / npx: `npx serve .`
   - Existing preview server: `npm run dev` (serves root static pages on port 3000).

---

## 4. Known Limitations & Contact Form Demonstration Mode

- **Contact Form Transport:** No backend mail server or third-party form-processing API key is configured in this static repository. Submitting the form on `contact.html` executes full client-side validation and displays a clearly labeled **Static Demonstration Mode** confirmation receipt in the browser without sending external emails.
- **Concept Portfolio:** As specified, `Atlas AI`, `Pulse Commerce`, `Flowdesk`, and `Nova Cloud` are fictional concept architectures created to demonstrate Aether Labs' engineering capabilities.
