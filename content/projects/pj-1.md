---
title: "Password Checker"
badgeIcon: "🔒"
xpReward: 200
expectedKeywords:
  - weak
  - okay
  - strong
instructions:
  - "Fill in is_long_enough — True if the password has 8 or more characters. Hint: use len()."
  - "Fill in has_uppercase — True if at least one character is uppercase. Hint: loop through the password and use .isupper()."
  - "Fill in has_number — True if at least one character is a digit. Hint: loop through the password and use .isdigit()."
concepts:
  - name: "Variables"
    note: "You stored the password and each check result in a named variable, making your code easy to read."
  - name: "Conditions (if/else)"
    note: "You used if/elif/else to decide the strength rating based on how many checks passed."
  - name: "Built-in functions"
    note: "len() counted characters. .isupper() and .isdigit() tested individual characters one at a time."
scaffoldedCode: |
  password = "Dragon123"

  # Task 1: Check if password is long enough (8 or more characters)
  # Hint: use len() to count the characters in password
  # is_long_enough = ...

  # Task 2: Check if the password has at least one uppercase letter
  # Hint: loop through each character and use .isupper()
  # has_uppercase = ...

  # Task 3: Check if the password has at least one number
  # Hint: loop through each character and use .isdigit()
  # has_number = ...

  # --- Do not change the code below ---
  checks_passed = 0
  if is_long_enough:
      checks_passed += 1
  if has_uppercase:
      checks_passed += 1
  if has_number:
      checks_passed += 1

  if checks_passed == 3:
      print("strong")
  elif checks_passed == 2:
      print("okay")
  else:
      print("weak")
solution: |
  password = "Dragon123"

  # Task 1: Check if password is long enough (8 or more characters)
  is_long_enough = len(password) >= 8

  # Task 2: Check if the password has at least one uppercase letter
  has_uppercase = any(c.isupper() for c in password)

  # Task 3: Check if the password has at least one number
  has_number = any(c.isdigit() for c in password)

  # --- Do not change the code below ---
  checks_passed = 0
  if is_long_enough:
      checks_passed += 1
  if has_uppercase:
      checks_passed += 1
  if has_number:
      checks_passed += 1

  if checks_passed == 3:
      print("strong")
  elif checks_passed == 2:
      print("okay")
  else:
      print("weak")
---
