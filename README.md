# Business Analyst Portfolio (static website)

A static portfolio for Dr Sharon Mbacham Ngwafor, Health Tech Business Analyst. It uses only HTML, CSS and JavaScript. There is no Node.js, npm, React or build step: upload the files and it works.

## Upload to GitHub
1. Sign in to GitHub and click **New repository**. Name it (for example `portfolio`) and click **Create repository**.
2. Click **uploading an existing file**.
3. Drag in **everything inside** the project folder (`index.html`, `assets`, `favicon.ico`, `README.md` and the rest). `index.html` must sit at the top level of the repository, not inside another folder.
4. Click **Commit changes**.

## Publish with GitHub Pages
**Settings → Pages → Build and deployment → Deploy from a branch → Branch: `main` → Folder: `/ (root)` → Save.**
After a minute or two your site appears at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`. GitHub Pages opens `index.html` automatically.
(If you name the repository `HTBA-SMN.github.io`, the address is simply `https://HTBA-SMN.github.io/`.)

Then open `index.html`, find `YOUR-SITE-URL` in the `og:image` line and replace it with your real address, so link previews show your photo.

## Where to change things
Almost all text lives in **`assets/js/data.js`**. Edit only what is between the quotation marks, and keep the commas and brackets.

| What | Where in `data.js` |
|---|---|
| Name, title, location | `name`, `displayName`, `title`, `location` |
| Bio and About text | `tagline`, `shortBio`, `about`, `approach`, `facts` |
| Skills | `competencies` |
| Experience | `experience` (add a block per job) |
| Education and certifications | `education`, `certifications` |
| Projects | `projects` |
| CV file and button text | `resume`, `resumeText` |
| Email, phone, LinkedIn, GitHub | `email`, `phone`, `linkedin`, `github` |
| Formspree endpoint | `formspreeEndpoint` (also in the `<form action>` in `index.html`) |
| Page title and link-preview text | The `<head>` of `index.html` |

Experience dates written as `[Insert confirmed start date]` show in brass colour on the page. Replace them with real dates. The navigation brand name is in `index.html` (`class="brand"`).

## Images
Put images in `assets/images/`. The profile photo is `assets/images/profile.jpg` (keep the same name, or change `photo` in `data.js`). Keep photos under about 300 KB.
Project thumbnails are `assets/images/lakeside-ai-readmission-workflow.jpg` (the hackathon cover slide) and `assets/images/closed-loop-medication-workflow.jpg`. The hackathon slides are in `assets/images/hackathon/` and appear in the case study as a view-only slide viewer.

## CV (view only)
The CV opens in an on-page viewer built from page images, so visitors can read it but there is no download button or PDF file in the site. To update it, export each CV page as a JPG, save them as `assets/images/cv/cv-1.jpg`, `cv-2.jpg` (and so on), and list them in `cvPages` in `data.js`. Note: nothing on the web can fully stop a determined visitor from taking a screenshot.

## Add or edit a project
1. Add your image to `assets/images/` and any document to `assets/documents/`.
2. In `data.js`, copy one block inside `projects: [ ... ]`, paste it after a comma, and change the text. Give it a unique `id`.
3. Each project becomes a card and a case study (problem → objective → approach → analysis → findings → recommendations → outcome → impact).
4. Set `documentReady: true` once a BRD file is uploaded, so a link appears for projects that use a document. Files expected:
   - `assets/documents/Lakeside_Health_Network_BRD.docx`
   - `assets/documents/closed-loop-medication-BRD.pdf`

## Contact form (Formspree)
The form posts to your Formspree endpoint and shows loading, success and error messages. Your first submission may ask you to confirm your email in Formspree. Only the public endpoint is used; there are no secrets in this site.

## Colours and fonts
Open `assets/css/style.css`. The first lines hold the **CSS variables**: `--accent` (main colour), `--brass` (highlight), `--bg`, `--text`, and a darker set under `[data-theme="dark"]`. Fonts are `--font-head` (headings) and `--font-body`. They load from Google Fonts in `index.html`; to change them, swap the font link there and the names in the CSS.

## Favicon
`favicon.ico` is a simple "SM" monogram. Replace it with your own `.ico` file of the same name.

## Test locally
Double-click `index.html`. Everything works offline except the web fonts and the contact form.
