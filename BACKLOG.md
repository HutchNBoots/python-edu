# Python Education Site — Product Backlog

## Project Vision
A personal Python education website for teenage beginners, built around
learning by building real things. Learners progress through a skill tree
(Variables, Loops, Conditions) via easy/mid/hard paths, earning XP as they
go. Projects unlock once the required skills are complete. Each project is
scaffolded — partial code is provided and the learner fills in the gaps —
resulting in a working, satisfying program they built themselves.

AI support is embedded as stateless contextual hints and plain-English error
explanations, powered by Claude Haiku. No agent architecture, no memory store.
The tone throughout is encouraging, informal, and age-appropriate for teenagers.

---

## Epics

| ID    | Epic                    | Description                                              |
|-------|-------------------------|----------------------------------------------------------|
| EP-01 | Core experience         | Lesson pages, code editor, in-browser Python execution   |
| EP-02 | Skill tree              | Variables, Loops, Conditions — easy/mid/hard paths + XP  |
| EP-03 | Scaffolded projects     | Five projects that unlock on skill completion            |
| EP-04 | AI support              | Stateless hints and error explanation via Claude Haiku   |
| EP-05 | Progress and gamification | XP tracking, unlock gates, progress dashboard          |

---

## Skill Tree Definition

### Core skills (required by all projects)
| Skill                  | Easy path          | Mid path              | Hard path                  |
|------------------------|--------------------|-----------------------|----------------------------|
| Variables & data types | Guided exercises   | Apply independently   | Solve without scaffolding  |
| Loops                  | Guided exercises   | Apply independently   | Solve without scaffolding  |
| Conditions (if/else)   | Guided exercises   | Apply independently   | Solve without scaffolding  |

### Additional skills (introduced per project)
| Skill               | Introduced in  |
|---------------------|----------------|
| Lists               | Project 4      |
| Files               | Project 4      |
| Functions           | Project 5      |
| Dictionaries        | Project 5      |

---

## Project Curriculum

| ID   | Project                   | Complexity | Unlock gate                                      |
|------|---------------------------|------------|--------------------------------------------------|
| PJ-1 | Password checker          | Starter    | Variables + Conditions — easy path               |
| PJ-2 | Caesar cipher             | Starter    | Variables + Loops + Conditions — easy path       |
| PJ-3 | Number guessing game      | Mid        | Variables + Loops + Conditions — mid path        |
| PJ-4 | Quiz game with scoreboard | Mid        | Core skills mid + Lists/Files easy path          |
| PJ-5 | Newspaper guessing game   | Advanced   | All core skills mid + Functions/Files/Dicts easy |

---

## Stories

---

### EP-01 · Core experience

---

#### PY-001 · Learner can view a lesson page

**User story**
As a learner, I want to open a skill lesson so that I can read a clear
explanation and see a code example before attempting an exercise.

**Acceptance criteria**
- [x] Lesson page loads within 2 seconds
- [x] Page displays: title, explanation text, syntax-highlighted code example
- [x] A "Try it" button is visible and navigates to the exercise
- [x] Page is readable on mobile (min width 320px)
- [x] Lesson content is loaded from a markdown file in /content/ — not hardcoded
- [x] Language and tone is age-appropriate for teenagers

**Diagrams required before build**
- Component diagram: lesson page structure
- Data flow: markdown file → rendered lesson page

---

#### PY-002 · Learner can write and run Python code in the browser

**User story**
As a learner, I want to type Python code and see the output immediately,
so that I can experiment without installing anything on my computer.

**Acceptance criteria**
- [x] Code editor is syntax-highlighted and supports tab indentation
- [x] "Run" button executes the code and shows output within 3 seconds
- [x] Output area clears before each new run
- [x] Execution runs entirely in the browser using Pyodide — no server execution
- [x] Editor retains the learner's code if they navigate away and return
- [x] Works on Chrome and Edge on Windows

**Diagrams required before build**
- Sequence diagram: learner clicks Run → Pyodide executes → output displayed
- Component diagram: editor panel + output panel layout

---

#### PY-003 · Learner sees a friendly error message when their code fails

**User story**
As a learner, I want runtime errors explained in plain English, so that I
understand what went wrong without being confused by technical jargon.

**Acceptance criteria**
- [x] When Pyodide returns an error, the raw traceback is not shown to the learner
- [x] A Claude Haiku API call is made with the error and the learner's code
- [x] A plain English explanation is displayed within 3 seconds
- [x] The explanation is encouraging in tone — never critical
- [x] The raw error is available via a "Show technical detail" toggle for curiosity
- [x] If the AI call fails, a sensible fallback message is shown

**Diagrams required before build**
- Sequence diagram: error → API call → friendly message displayed
- Component diagram: error display panel with toggle

---

### EP-02 · Skill tree

---

#### PY-004 · Learner can see the skill tree and their progress

**User story**
As a learner, I want to see all available skills and which ones I have
completed, so that I know what to work on next.

**Acceptance criteria**
- [x] Skill tree page shows all skills: Variables, Loops, Conditions (core) plus additional skills
- [x] Each skill shows which paths are completed (easy / mid / hard) with a clear visual state
- [x] Locked skills are visually distinct from available ones
- [x] Completed paths show XP earned
- [x] Clicking a skill navigates to the first incomplete path for that skill
- [x] Page works on mobile

**Diagrams required before build**
- Component diagram: skill tree layout
- Data model: skill + path + completion state

---

#### PY-005 · Learner can attempt an easy path exercise for a skill

**User story**
As a learner, I want to complete a guided exercise for a skill so that I
can learn the concept with support before trying it independently.

**Acceptance criteria**
- [x] Easy path exercise loads with clear instructions and starter code pre-filled
- [x] Learner fills in the missing parts and runs their code
- [x] If the output matches the expected result, the path is marked complete
- [x] XP is awarded and displayed immediately on completion
- [x] Learner cannot skip to mid or hard path without completing easy first
- [x] A "Give me a hint" button is available (links to PY-008)

**Diagrams required before build**
- Sequence diagram: exercise attempt → output check → XP award
- Component diagram: exercise page layout

---

#### PY-006 · Learner can attempt mid and hard path exercises

**User story**
As a learner, I want to attempt harder exercises once I've completed the
easy path, so that I can deepen my understanding of each skill.

**Acceptance criteria**
- [x] Mid path: less scaffolding, learner writes more of the solution themselves
- [x] Hard path: minimal guidance, learner solves independently
- [x] Mid path unlocks only after easy path is complete for that skill
- [x] Hard path unlocks only after mid path is complete
- [x] Each path awards XP on completion — hard path awards more XP than mid, mid more than easy
- [x] Completion state persists between sessions

**Diagrams required before build**
- Sequence diagram: path unlock flow
- Data model: XP values per path level

---

### EP-03 · Scaffolded projects

---

#### PY-007 · Project 1 — Password checker

**User story**
As a learner, I want to build a password strength checker so that I can
practise variables and conditions while making something genuinely useful.

**Acceptance criteria**
- [ ] Project page unlocks when: Variables + Conditions easy path complete
- [ ] Scaffolded starter code is provided — core structure present, logic gaps left for learner
- [ ] Learner fills in: length check, uppercase check, number check
- [ ] Running the completed program checks any password the user types
- [ ] A worked solution is available after 3 failed attempts
- [ ] Completing the project awards a project badge and bonus XP
- [ ] Project summary explains in plain English what Python concepts were used

**Diagrams required before build**
- Sequence diagram: learner completes project → badge awarded
- Component diagram: project page layout with scaffolded editor

---

#### PY-008 · Learner can request AI support
**User story**
As a learner, I want to ask for help at any point in my learning so that I get age-appropriate support without being given the answer outright.

**Acceptance criteria**

- [ ] A "Help me" button is available on every lesson page, exercise page and project page
- [ ] On a lesson page the button sends the lesson content to Claude Haiku with the prompt "explain this concept differently in casual language for a teenager"
- [ ] On an exercise or project page the button sends the exercise description and the learner's current code to Claude Haiku
- [ ] The system prompt instructs Claude to: give one short response, use casual teenage-friendly language, never reveal the answer directly, be encouraging
- [ ] Response is displayed in a slide-in panel without leaving the current page
- [ ] Panel closes when the learner clicks away or presses Escape
- [ ] Each request is stateless — no conversation history is maintained
- [ ] If the API call fails a static fallback message is shown
- [ ] Response displayed within 3 seconds

**Diagrams required before build**

- Sequence diagram: help request → Haiku API call → response displayed in panel
- Component diagram: help panel UI showing three contexts (lesson / exercise / project)

---

#### PY-009 · Project 2 — Caesar cipher

**User story**
As a learner, I want to build a secret message encoder and decoder so that
I can practise loops and conditions while making something fun to share.

**Acceptance criteria**
- [ ] Project unlocks when: Variables + Loops + Conditions easy path complete
- [ ] Scaffolded starter: alphabet shift logic partially provided
- [ ] Learner fills in: the encoding loop, the decoding reversal
- [ ] Completed program encodes and decodes any message with any shift key
- [ ] Worked solution available after 3 failed attempts
- [ ] Completing awards badge and bonus XP

**Diagrams required before build**
- Sequence diagram: encode/decode flow
- Component diagram: project page layout

---

#### PY-010 · Project 3 — Number guessing game

**User story**
As a learner, I want to build a number guessing game so that I can
practise loops and conditions in a game I can play with my family.

**Acceptance criteria**
- [ ] Project unlocks when: Variables + Loops + Conditions mid path complete
- [ ] Scaffolded starter: game loop structure provided, logic gaps left
- [ ] Learner fills in: random number generation, hot/cold feedback, win condition
- [ ] Completed game runs and tells the player how many guesses they took
- [ ] Worked solution available after 3 failed attempts
- [ ] Completing awards badge and bonus XP

**Diagrams required before build**
- Sequence diagram: game loop flow
- Component diagram: project page layout

---

#### PY-011 · Project 4 — Quiz game with scoreboard

**User story**
As a learner, I want to build a quiz game with a saved scoreboard so that
I can practise lists and file handling while making something my friends can play.

**Acceptance criteria**
- [ ] Project unlocks when: core skills mid path + Lists/Files easy path complete
- [ ] Scaffolded starter: question list structure and file read/write skeleton provided
- [ ] Learner fills in: question loop, score tracking, file save and leaderboard display
- [ ] Learner can customise the quiz questions in the content file
- [ ] Completing awards badge and bonus XP

**Diagrams required before build**
- Sequence diagram: quiz run → score saved → leaderboard displayed
- ERD: question and score data model
- Component diagram: project page layout

---

#### PY-012 · Project 5 — Newspaper guessing game (capstone)

**User story**
As a learner, I want to build a full login-based guessing game with a
leaderboard so that I can bring together everything I have learned in one
real-world project.

**Acceptance criteria**
- [ ] Project unlocks when: all core skills mid path + Functions/Files/Dicts easy path complete
- [ ] Scaffolded starter: login validation skeleton, scoring logic skeleton provided
- [ ] Learner fills in: username/password validation, game loop, score persistence, top 5 display
- [ ] Completed game supports multiple players with persistent scores
- [ ] Completing awards a special capstone badge, bonus XP, and a congratulations screen
- [ ] Congratulations screen summarises every skill the learner used across all five projects

**Diagrams required before build**
- Sequence diagram: login → game → score saved → leaderboard
- ERD: user, score, newspaper data model
- Component diagram: full project page layout

---

### EP-05 · Progress and gamification

---

#### PY-013 · Learner progress is saved between sessions

**User story**
As a learner, I want the site to remember my progress so that I can pick
up exactly where I left off each time I return.

**Acceptance criteria**
- [x] Completed paths, earned XP, and unlocked projects persist after browser close
- [x] Progress is associated with a learner profile (simple username, no password required at MVP)
- [x] A progress summary is shown on the home page: XP total, skills complete, projects complete
- [x] Progress resets only when the learner explicitly clicks "Reset my progress"

**Diagrams required before build**
- ERD: learner profile + progress data model
- Sequence diagram: lesson complete → progress saved → home page updated

---

#### PY-014 · Learner can see which projects are locked and why

**User story**
As a learner, I want to see all five projects on the projects page, with
locked ones showing exactly what I need to do to unlock them, so that I
always have a clear next goal.

**Acceptance criteria**
- [x] All five projects are visible on the projects page at all times
- [x] Locked projects show: which skills are still needed and at which path level
- [x] Unlocked projects show: a Start or Continue button
- [x] Completed projects show: the badge earned and XP awarded
- [x] Visual design is engaging and motivating — not clinical

**Diagrams required before build**
- Component diagram: projects page layout
- Data flow: skill completion state → unlock gate evaluation → project state displayed

---

## Backlog status

| Story  | Epic  | Status      | Priority |
|--------|-------|-------------|----------|
| PY-001 | EP-01 | Done        | High     |
| PY-002 | EP-01 | Done        | High     |
| PY-003 | EP-01 | Done        | High     |
| PY-004 | EP-02 | Done        | High     |
| PY-005 | EP-02 | Done        | High     |
| PY-006 | EP-02 | Done        | Medium   |
| PY-007 | EP-03 | To do       | Medium   |
| PY-008 | EP-03 | To do       | Medium   |
| PY-009 | EP-03 | To do       | Medium   |
| PY-010 | EP-03 | To do       | Medium   |
| PY-011 | EP-03 | To do       | Low      |
| PY-012 | EP-03 | To do       | Low      |
| PY-013 | EP-05 | Done        | High     |
| PY-014 | EP-05 | Done        | Medium   |