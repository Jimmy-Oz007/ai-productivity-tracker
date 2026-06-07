# WorkLog V3 – AI Productivity Tracker

## Overview

WorkLog V3 is a productivity tracking application that allows users to log work hours using natural language and generate reports through an interactive dashboard. The project focuses on making time tracking simpler and more intuitive by allowing users to interact with the system conversationally rather than filling out traditional forms.

This project was inspired by a university group assignment that explored whether conversational AI systems could be used as an alternative to traditional database-driven applications. Our team developed a prototype that combined Large Language Models (LLMs) with structured data storage to investigate the strengths and limitations of conversational data management. After completing the assignment, I created WorkLog V3 as an independent portfolio project to further develop the concept and add additional productivity-focused features.

---

## Features

- Natural language work-hour logging
- Project-based time tracking
- Weekly productivity summaries
- Project breakdown reports
- Overtime monitoring
- CSV export functionality
- Dark and light mode support
- Responsive design for desktop and mobile devices
- Local data storage using browser localStorage

---

## Example Inputs

```text
I worked 6 hours on Monday for Website Project

Log 4.5 hours Tuesday for LLM App

Show my weekly summary

Show project breakdown

Am I in overtime?
```

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Browser Local Storage

---

## Project Structure

```text
worklog-v3/
│
├── index.html
├── style.css
├── app.js
├── README.md
└── .gitignore
```

---

## How It Works

The application uses natural language pattern matching to identify:

- Hours worked
- Day worked
- Project name

The extracted information is then stored locally and used to generate:

- Weekly reports
- Project analytics
- Productivity summaries
- Overtime indicators

The dashboard automatically updates as new entries are added, giving users a quick overview of their work patterns and project allocation.

---

## Motivation

The idea for this project originated from a university group assignment where my team explored the concept of LLM-native applications. The original prototype investigated whether users could interact with an application entirely through conversational input instead of traditional forms and interfaces.

While the university project focused on the feasibility of conversational data management using AI, WorkLog V3 expands on that concept by introducing:

- Improved user interface design
- Productivity reporting
- Project-based tracking
- Data export capabilities
- Responsive dashboard features

This project demonstrates how an academic concept can be developed into a practical software application with real-world use cases.

---

## Skills Demonstrated

This project showcases experience in:

- Front-End Development
- JavaScript Programming
- User Interface Design
- State Management
- Local Data Persistence
- Data Visualization
- Software Design and Development
- Human-Computer Interaction Concepts

---

## Future Improvements

Planned future enhancements include:

- User authentication
- Supabase database integration
- Cloud synchronization
- Chart.js visualizations
- Calendar integration
- Team collaboration features
- AI-generated productivity insights
- Mobile application version

---

## Author

**Jigme Dorji**  
Bachelor of Information Technology  
University of Canberra

Part of my **100 Projects Challenge**, where I build software, AI, and hardware projects to strengthen practical development skills and expand my portfolio.

---

## License

This project is available for educational, learning, and portfolio purposes.
