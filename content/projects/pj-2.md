---
title: "Caesar Cipher"
badgeIcon: "🔐"
xpReward: 200
expectedKeywords:
  - Khoor
instructions:
  - "In the encode loop, replace the encoded += char placeholder with code that shifts the letter forward by shift positions. Hint: use ord() to get the character's number, add shift, wrap with % 26 to stay in the alphabet, then convert back with chr()."
  - "In the decode loop, replace the decoded += char placeholder with code that shifts the letter backward. Subtract shift instead of adding it — and use % 26 to wrap around."
  - "Run your code — message = \"Hello\" with shift = 3 should print Encoded: Khoor and Decoded: Hello."
concepts:
  - name: "Loops"
    note: "You looped through each character in the message to process it one at a time — that's the heart of the cipher."
  - name: "Conditions (if/else)"
    note: "You checked whether each character is a letter before shifting it, leaving spaces and punctuation unchanged."
  - name: "Variables"
    note: "You built the encoded and decoded strings character by character using +=, growing the result one letter at a time."
  - name: "Built-in functions"
    note: "ord() converted letters to their number values, chr() converted numbers back to letters, and % 26 kept you inside the 26-letter alphabet."
scaffoldedCode: |
  message = "Hello"
  shift = 3

  # Task 1: Encode — shift each letter forward by 'shift' positions
  # Non-letters (spaces, punctuation) stay unchanged.
  # Hint: ord() gives a letter's number; chr() turns a number back into a letter.
  # Use % 26 so you wrap around from Z back to A.
  encoded = ""
  for char in message:
      if char.isalpha():
          base = ord('A') if char.isupper() else ord('a')
          encoded += char  # replace this line: shift the letter forward
      else:
          encoded += char

  # Task 2: Decode — shift each letter backward by 'shift' positions
  decoded = ""
  for char in encoded:
      if char.isalpha():
          base = ord('A') if char.isupper() else ord('a')
          decoded += char  # replace this line: shift the letter backward
      else:
          decoded += char

  print("Encoded:", encoded)
  print("Decoded:", decoded)
solution: |
  message = "Hello"
  shift = 3

  # Encode — shift each letter forward
  encoded = ""
  for char in message:
      if char.isalpha():
          base = ord('A') if char.isupper() else ord('a')
          encoded += chr((ord(char) - base + shift) % 26 + base)
      else:
          encoded += char

  # Decode — shift each letter backward
  decoded = ""
  for char in encoded:
      if char.isalpha():
          base = ord('A') if char.isupper() else ord('a')
          decoded += chr((ord(char) - base - shift) % 26 + base)
      else:
          decoded += char

  print("Encoded:", encoded)
  print("Decoded:", decoded)
---
