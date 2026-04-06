---
title: "Variables & Data Types"
xp: 50
keyConcept: "A variable is a named container that stores a value. You can update it, read it, and pass it around your program. Python figures out the type automatically — you just give it a name and a value."
codeExample: |
  # Variables store information you want to use later
  name = "Alex"
  age = 14
  height = 1.65
  is_cool = True

  # Print them out
  print(name)    # Alex
  print(age)     # 14
  print(height)  # 1.65
---

**Think of a variable like a labelled box.** You put something inside it, give the box a name, and then you can grab it whenever you need it. In Python, creating a variable is as simple as writing `name = "Alex"` — that's it, no extra setup needed.

**Python has four data types you'll use constantly.** Each one stores a different kind of value. A `str` holds text, an `int` holds a whole number, a `float` holds a decimal number, and a `bool` holds either `True` or `False`. Python figures out which type to use automatically based on the value you give it.

| Type | What it stores | Example |
|------|----------------|---------|
| `str` | Text — anything in quotes | `"hello"` |
| `int` | A whole number | `42` |
| `float` | A number with a decimal point | `3.14` |
| `bool` | True or False — nothing else | `True` |

**Naming your variables well makes your code much easier to read.** Use lowercase letters and underscores, like `player_name` or `high_score`. Make the name describe what's inside — `score` is way better than `x`. Spaces aren't allowed, so use `_` to separate words.

**Use `print()` any time you want to check what a variable holds.** You can pass it a single variable like `print(score)`, or combine several values in one line like `print(player, "scored", score, "points")`. This is one of the most useful tools for understanding what your code is doing as you write it.
