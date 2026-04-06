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

## What even is a variable?

Think of a variable like a labelled box. You put something inside it, give the box a name, and then you can grab it whenever you need it.

```python
name = "Alex"
```

That line creates a box called `name` and puts the text `"Alex"` inside it. Done.

## The four main types

Python has four types you'll use constantly:

| Type | Example | What it is |
|------|---------|------------|
| `str` | `"hello"` | Text (short for *string*) |
| `int` | `42` | A whole number |
| `float` | `3.14` | A number with a decimal |
| `bool` | `True` | Either `True` or `False` |

Python figures out the type automatically — you never have to spell it out.

## Naming your variables

A few quick rules:

- Use lowercase with underscores: `player_name` not `PlayerName`
- Make the name describe what's inside — `score` beats `x` every time
- No spaces — use `_` instead

## Checking what's inside

Use `print()` to see what a variable holds:

```python
score = 100
print(score)  # 100
```
