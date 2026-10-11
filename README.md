# Marcell Juniar Wijaya — Personal Portfolio

A professional portfolio presenting my interests in Informatics, software engineering,
application development, data and database systems, and web technologies.

The site includes an introduction, areas of technical focus, a practical toolkit,
academic project case studies, education, and contact information. All website copy
is written in English. Areas of interest are distinguished from demonstrated project
experience; the featured projects are browser-based applications.

## Local preview

This is a static website built with HTML, CSS, and vanilla JavaScript. No build step
or package installation is required. From the repository root, run:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000 in a browser.

## Structure

- `index.html`: page content, metadata, and project detail dialogs.
- `css/style.css`: responsive layout, shared styles, and light/dark themes.
- `js/script.js`: navigation, theme persistence, dialogs, and screenshot galleries.
- `assets/`: profile images, project screenshots, technology icons, and the existing CV.

## Content maintenance

Keep the introduction, technical focus, project summaries, dialog descriptions, and
metadata consistent when updating the portfolio. Preserve accurate technology names
and distinguish learning interests from completed work. Update the linked CV separately
when the underlying resume changes.

Before publishing, check desktop and mobile layouts in both themes, navigation,
project dialogs, screenshot galleries, and local asset links. The site can be hosted
directly on GitHub Pages.
