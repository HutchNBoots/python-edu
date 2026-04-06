---
title: "Variables & Data Types"
codeExample: |
  # Variables store information you want to use later
  name = "Alex"
  age = 14
  height = 1.65
  is_cool = True

  print(name)   # Alex
  print(age)    # 14
---

## What even is a variable?

Think of a variable like a labelled box. You put something inside it, give the box a name, and then you can grab it whenever you need it.

```python
name = "Alex"
```

That line creates a box called `name` and puts the text `"Alex"` inside it. Simple as that.

## The four main types

Python has four types you'll use constantly:

| Type | Example | What it is |
|------|---------|------------|
| `str` | `"hello"` | Text (short for *string*) |
| `int` | `42` | A whole number |
| `float` | `3.14` | A number with a decimal point |
| `bool` | `True` | Either `True` or `False` |

Python figures out the type automatically — you don't have to tell it.

## Naming your variables

A few quick rules:

- Use lowercase letters and underscores: `my_score` not `MyScore`
- Make the name describe what's inside: `player_name` is way better than `x`
- No spaces allowed — use `_` instead

## Checking what's inside

Use `print()` to see what's stored in a variable:

```python
score = 100
print(score)  # prints: 100
```

You can print multiple things at once too:

```python
player = "Jordan"
score = 250
print(player, "scored", score, "points")
# prints: Jordan scored 250 points
```

Give it a go in the exercise below!
