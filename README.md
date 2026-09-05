# Planificator Activitati

A small Romanian-language activity planner built with plain HTML, CSS, and JavaScript. It lets you add daily tasks with a date, title, description, start time, and end time, while preventing time overlaps and keeping the schedule saved in the browser.

## Features

- Add activities with date and time details
- Prevent overlapping activities on the same day
- Filter activities for the current day
- Delete selected activities or clear all selected entries
- Automatically remove expired entries
- Persist data in `localStorage` without a backend

## Project structure

- `index.html` — page structure and form layout
- `style.css` — styling for the planner interface
- `script.js` — scheduling logic, validation, filtering, and local storage behavior

## Run locally

Because this is a static web app, you can simply open `index.html` in a browser.

For a local web server, run:

```bash
python -m http.server 8000
```

Then open: `http://localhost:8000`

## Notes

- This app is fully client-side.
- Data is stored in the browser's `localStorage`, so it remains available on the same browser/device until cleared.
- There is no server-side database or authentication.
