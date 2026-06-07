# WorkLog V3 — Portfolio Version

WorkLog V3 is a polished portfolio version of the LLM work-hour logging idea. It demonstrates natural language input, structured extraction, productivity reporting, CSV export, project tracking, and a responsive dashboard.

This version is safe to upload to GitHub because it does not contain API keys and runs locally using `localStorage`.

## Features

- Natural language work-hour logging
- Project-based time tracking
- Weekly summary dashboard
- Project breakdown report
- Overtime indicator
- CSV export
- Dark/light theme toggle
- Responsive interface
- Local browser storage

## Example Inputs

```text
I worked 6 hours on Monday for LLM App
Log 4.5 hours Tuesday for Website Project
Show my weekly summary
Show project breakdown
Am I in overtime?
```

## Tech Stack

- HTML
- CSS
- JavaScript
- Browser localStorage

## Why This Version Exists

V2 is closer to the original team prototype using Gemini and Supabase. V3 is designed for a public portfolio because it is easier to run, does not expose credentials, and includes visible features that demonstrate front-end development and product thinking.

## Future Improvements

- Add user authentication
- Connect to Supabase backend
- Add real calendar dates
- Add charts with Chart.js
- Add AI-generated productivity insights
