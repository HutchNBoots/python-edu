---
title: "Quiz Game with Scoreboard"
badgeIcon: "🏆"
xpReward: 400
expectedKeywords:
  - "Correct!"
instructions:
  - "Fill in Task 1 — loop through zip(questions, player_answers). For each pair, check if the player's answer matches the question's answer (case-insensitive). If correct, add 1 to score and print \"Correct!\". If wrong, print f\"Wrong! The answer was {question['answer']}\"."
  - "You can customise the quiz — change the questions list and player_answers to test your own questions and answers."
  - "Run your code. With the default answers, you should see two \"Correct!\" messages and a score of 2 out of 3."
concepts:
  - name: "Lists"
    note: "You stored your quiz questions as a list of dictionaries, and looped through two lists at once using zip()."
  - name: "Loops"
    note: "You used a for loop to work through every question in sequence — the engine of the quiz."
  - name: "Conditions (if/else)"
    note: "You used if/else to decide whether each answer was correct, and .lower() to make the check case-insensitive."
  - name: "Files"
    note: "You used open() in append mode to save the score and read mode to display the leaderboard — real file I/O in Python."
  - name: "Variables"
    note: "You tracked the running score in a variable that updated every time a correct answer was found."
scaffoldedCode: |
  # Your quiz questions — feel free to change these!
  questions = [
      {"question": "What is the capital of France?", "answer": "paris"},
      {"question": "What is 7 times 8?",             "answer": "56"},
      {"question": "What colour is the sky?",         "answer": "blue"},
  ]

  # Simulated player answers (in a real game these would be typed in)
  player_answers = ["Paris", "56", "green"]

  score = 0

  # Task 1: Loop through questions and player_answers together using zip()
  # For each pair: print the question, then check if the player's answer matches
  # (use .lower() on both sides so the check is case-insensitive).
  # If correct: add 1 to score and print "Correct!"
  # If wrong:   print f"Wrong! The answer was {question['answer']}"
  pass  # remove this line and fill in your loop

  # --- Already done for you below ---
  print(f"Your score: {score} out of {len(questions)}")

  scores_file = "scores.txt"
  with open(scores_file, "a") as f:
      f.write(f"Score: {score}\n")

  with open(scores_file, "r") as f:
      print("--- Leaderboard ---")
      print(f.read())
solution: |
  # Your quiz questions — feel free to change these!
  questions = [
      {"question": "What is the capital of France?", "answer": "paris"},
      {"question": "What is 7 times 8?",             "answer": "56"},
      {"question": "What colour is the sky?",         "answer": "blue"},
  ]

  # Simulated player answers
  player_answers = ["Paris", "56", "green"]

  score = 0

  for question, player_answer in zip(questions, player_answers):
      print(question["question"])
      if player_answer.lower() == question["answer"].lower():
          score += 1
          print("Correct!")
      else:
          print(f"Wrong! The answer was {question['answer']}")

  print(f"Your score: {score} out of {len(questions)}")

  scores_file = "scores.txt"
  with open(scores_file, "a") as f:
      f.write(f"Score: {score}\n")

  with open(scores_file, "r") as f:
      print("--- Leaderboard ---")
      print(f.read())
---
