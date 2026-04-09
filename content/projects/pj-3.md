---
title: "Number Guessing Game"
badgeIcon: "🎯"
xpReward: 300
expectedKeywords:
  - Got it
instructions:
  - "Fill in Task 1 — check if guess equals secret_number. If it does, set found = True and break out of the loop."
  - "Fill in Task 2 — give a hint. Print \"Too high!\" if guess is greater than secret_number, otherwise print \"Too low!\"."
  - "Run your code — with secret_number = 7 and guesses = [3, 10, 7] you should see two hints and then \"Got it in 3 guesses!\"."
concepts:
  - name: "Loops"
    note: "You looped through each guess one at a time, checking it against the secret — that's the game loop."
  - name: "Conditions (if/else)"
    note: "You used if/elif/else to check for a correct guess and give the right hot/cold hint."
  - name: "Variables"
    note: "You tracked the guess count and whether the number was found using variables that updated as the loop ran."
  - name: "break"
    note: "You used break to exit the loop early the moment the correct guess was made — no point checking the rest!"
scaffoldedCode: |
  secret_number = 7
  guesses = [3, 10, 7]

  guess_count = 0
  found = False

  for guess in guesses:
      guess_count += 1

      # Task 1: Check if the guess is correct
      # If guess equals secret_number, set found = True and break out of the loop
      # FILL IN YOUR CODE HERE

      # Task 2: Give a hint
      # Print "Too high!" if guess > secret_number, otherwise print "Too low!"
      # FILL IN YOUR CODE HERE

  if found:
      print(f"Got it in {guess_count} guesses!")
  else:
      print(f"The number was {secret_number}. Better luck next time!")
solution: |
  secret_number = 7
  guesses = [3, 10, 7]

  guess_count = 0
  found = False

  for guess in guesses:
      guess_count += 1

      if guess == secret_number:
          found = True
          break

      if guess > secret_number:
          print("Too high!")
      else:
          print("Too low!")

  if found:
      print(f"Got it in {guess_count} guesses!")
  else:
      print(f"The number was {secret_number}. Better luck next time!")
---
