# Personal Portfolio Website

## About

A personal portfolio website for a final-year Computer Engineering student, built with plain HTML, CSS, and vanilla JavaScript. It's designed to be simple enough to fully understand and explain in an interview: *"I used semantic HTML for structure, CSS for responsive design and animations, and JavaScript for interactive features like the mobile menu, theme switching, scroll effects, and form validation."*

## Technologies Used

- HTML5
- CSS3 (custom properties, Flexbox, Grid, media queries — no framework)
- Vanilla JavaScript (no libraries)

## Features

- Responsive layout (mobile, tablet, laptop, desktop)
- Sticky navigation with a mobile hamburger menu
- Active nav-link highlighting as you scroll
- Smooth scrolling between sections
- Scroll-reveal animations (respects `prefers-reduced-motion`)
- Light/dark theme toggle, remembered between visits
- Skills shown with honest "Comfortable / Familiar / Currently Learning" labels instead of fake percentages
- Project cards that are easy to duplicate for new projects
- Resume download button
- Contact form with client-side validation (opens a pre-filled email — see the note below)
- Back-to-top button
- Auto-updating copyright year

## Project Structure

```
portfolio/
│
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   ├── favicon.svg
│   ├── avatar-placeholder.svg
│   ├── project-expense-manager.svg
│   └── project-ai-chatbot.svg
├── assets/
│   └── resume.pdf
└── README.md
```

## How to Run

No build step or server is required.

- **Quickest:** double-click `index.html` to open it directly in your browser.
- **Recommended:** run a simple local server from the project folder so paths behave exactly like they will once deployed, e.g.:
  ```
  python3 -m http.server 8000
  ```
  then open `http://localhost:8000` in your browser.

To publish it, upload the whole `portfolio/` folder to any static host — GitHub Pages, Netlify, and Vercel all work well for a plain HTML/CSS/JS site like this one.

## Customization

Everything below is a placeholder — search for it in the file listed and replace it with your real information.

| What to change | Where |
|---|---|
| GitHub / LinkedIn URLs and email address | `index.html` — appears in the hero, the contact section, and the footer (search for `yourusername` and `your.email@example.com`) |
| Same email address for the contact form's mailto link | `js/script.js` — the `MAILTO_ADDRESS` constant near the top of `initContactForm()` |
| About text | `index.html` — the `#about` section |
| Skills and their status labels | `index.html` — the `#skills` section. Each tag has a `data-level` of `comfortable`, `familiar`, or `learning`, which controls its color in `css/style.css` |
| Projects | `index.html` — the `#projects` section. Copy an existing `<article class="project-card">` block to add a new project, and swap its status, image, text and links |
| Currently Learning items | `index.html` — the `#learning` section |
| Education details (college, university, graduation year) | `index.html` — the `#education` section |
| Resume file | `assets/resume.pdf` — replace this file with your real resume (keep the filename the same and the Download Resume buttons keep working automatically) |
| Profile photo | `images/avatar-placeholder.svg` — replace with a real photo (e.g. `images/profile.jpg`) and update the `src` in the `#about` section of `index.html` |
| Colors, fonts, spacing | `css/style.css` — the `:root` and `[data-theme="dark"]` blocks at the top of the file |

### About the contact form

There's no backend, so the form currently opens the visitor's email app with a pre-filled message when they hit "Send Message" (a `mailto:` link built in `js/script.js`). If you'd rather receive messages directly without the visitor needing an email client, connect the form to a free service like [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com) and point the form's `action` at the endpoint they give you.

## Browser Support

Built with standard, widely-supported CSS and JavaScript (CSS custom properties, Flexbox, Grid, `IntersectionObserver`). Works in all current versions of Chrome, Firefox, Safari, and Edge.
