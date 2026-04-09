---
title: "Newspaper Guessing Game"
badgeIcon: "🗞️"
xpReward: 500
expectedKeywords:
  - Leaderboard
instructions:
  - "Fill in Task 1 — loop through sessions. For each one, check if the username is in players AND the password matches. If valid, print f\"{username} logged in\" and count how many of their guesses appear in secret_word, storing the result in scores[username]. If invalid, print f\"{username}: invalid login\"."
  - "Fill in Task 2 — print the leaderboard. Sort scores by value (highest first) using sorted(scores.items(), key=lambda x: x[1], reverse=True), then print each player name and score."
  - "Run your code. You should see alice log in and score 6, bob fail once then log in and score 2, then a leaderboard with alice at the top."
concepts:
  - name: "Dictionaries"
    note: "You used a players dict to look up passwords by username, and a scores dict to record each player's result — the key data structure of this project."
  - name: "Functions"
    note: "You used built-in functions like sorted(), len(), and lambda to sort and display the leaderboard cleanly."
  - name: "Loops"
    note: "You looped through every game session and through each player's guesses — loops were the engine of the whole game."
  - name: "Conditions (if/else)"
    note: "You used if/else to validate logins and check whether each guessed letter appears in the secret word."
  - name: "Variables"
    note: "Used in every project — you stored the secret word, scores, session data, and counts in named variables throughout."
  - name: "Lists"
    note: "Each session's guesses were stored as a list, and you iterated through them to count correct letters."
  - name: "Files"
    note: "You used file read/write in the Quiz Game to save and display scores — a skill that carries into real-world Python."
  - name: "Built-in functions"
    note: "ord() and chr() powered the Caesar cipher. any(), len(), zip(), sorted() made the later projects clean and readable."
scaffoldedCode: |
  # Player database
  players = {
      "alice": "password1",
      "bob":   "password2",
  }

  # Simulated game sessions (username, password attempt, letter guesses)
  sessions = [
      {"username": "alice", "password": "password1", "guesses": ["P", "Y", "T", "H", "O", "N"]},
      {"username": "bob",   "password": "wrong",      "guesses": []},
      {"username": "bob",   "password": "password2",  "guesses": ["P", "Y", "Z"]},
  ]

  secret_word = "PYTHON"
  scores = {}

  # Task 1: Loop through sessions
  # For each session: validate the login (username in players AND password matches).
  # If valid:   print f"{username} logged in", then count how many guesses are in
  #             secret_word and store the result in scores[username].
  # If invalid: print f"{username}: invalid login"
  pass  # remove this line and fill in your code

  # Task 2: Print the leaderboard — sorted by score, highest first
  # Hint: sorted(scores.items(), key=lambda x: x[1], reverse=True)
  pass  # remove this line and fill in your code
solution: |
  # Player database
  players = {
      "alice": "password1",
      "bob":   "password2",
  }

  # Simulated game sessions
  sessions = [
      {"username": "alice", "password": "password1", "guesses": ["P", "Y", "T", "H", "O", "N"]},
      {"username": "bob",   "password": "wrong",      "guesses": []},
      {"username": "bob",   "password": "password2",  "guesses": ["P", "Y", "Z"]},
  ]

  secret_word = "PYTHON"
  scores = {}

  # Task 1: Validate login and score each session
  for session in sessions:
      username = session["username"]
      if username in players and players[username] == session["password"]:
          print(f"{username} logged in")
          correct = len([g for g in session["guesses"] if g in secret_word])
          scores[username] = correct
      else:
          print(f"{username}: invalid login")

  # Task 2: Print the leaderboard
  print("--- Leaderboard ---")
  for name, score in sorted(scores.items(), key=lambda x: x[1], reverse=True):
      print(f"{name}: {score}")
---
