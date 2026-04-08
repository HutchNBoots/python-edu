# Python Education Site — project rules

## Who I am
I am the product owner. I review diagrams and acceptance criteria.
I do not review code directly.

## Before writing any code for a new feature you must:
1. Confirm which story from BACKLOG.md you are implementing
2. Generate a PlantUML component diagram and save to /docs/diagrams/
3. Generate a PlantUML sequence diagram for the main user flow
4. Tell me: "Diagrams are ready for review in /docs/diagrams/"
5. Wait for my explicit approval before writing any implementation code

## Tech stack
Framework:      Next.js (React)
Styling:        Tailwind CSS
Python runtime: Pyodide (runs in browser, no server execution)
Database:       Supabase (progress tracking)
Hosting:        Vercel

## After building each feature you must:
1. Write tests covering every acceptance criterion in the story
2. Run the tests and show me the results
3. Summarise what was built in plain English (no code in the summary)

## General rules
- Keep components small and single-purpose
- All lesson content lives in /content/ as markdown files
- Never store lesson content in the database
- Before modifying any existing component, explicitly state which story originally built it and confirm the change is intentional. If a story requires changes to a shared component such as TitleBar, NavLink, or any layout component, list those changes in the diagram review before touching any code.
- Commit after each story: "feat(PY-00X): short description"