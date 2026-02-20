# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Meduyeket (מדויקת)** is a Hebrew Wordle clone extended to 10 simultaneous game boards per day. It's a static web app with no build system, no framework, and no package manager — just vanilla HTML, CSS, and JavaScript served from the `app/` directory.

Live at: https://meduyeket.net

## Running Locally

Open `app/index.html` directly in a browser. No server or build step is required.

## Architecture

### Game Boards (1 + 9 pattern)

The original single-board game uses functions like `type_letter()`, `erase_letter()`, `make_guess()`, `handle_key()`. Boards 2–10 are handled by duplicated "Ex" functions (`type_letterEx(letter, number)`, `erase_letterEx(number)`, `make_guessEx(number)`, etc.) that take a board number parameter and use `eval()` to access numbered variables (`guesses2`–`guesses10`, `word_of_the_day2`–`word_of_the_day10`, `current_pos2`–`current_pos10`).

Board 1's DOM elements are in `index.html`. Boards 2–10 are dynamically created by `add_nodes()` at DOMContentLoaded. Each board gets a unique color from the `COLOR` array and its own on-screen keyboard with class `key{N}`.

### Key Files

- **`app/meduyeket.js`** — All game logic: input handling, guess validation, match checking, UI updates, localStorage persistence, modals (help/settings/success/finish), keyboard coloring, result sharing
- **`app/words3.js`** — Word data and selection: `HEBREW_KEYMAP` (QWERTY-to-Hebrew mapping), `FINAL_LETTERS`/`FINALED_LETTERS` (sofit letter handling), `CONCATED_WORDS` (all valid 5-letter words concatenated), `POSSIBLE_MEDUYAKOT` (candidate daily words), `calculate_meduyeket(date)` (deterministic word selection based on date)
- **`app/meduyeket.css`** — Styles with CSS variables (`--unit`) for responsive sizing. Styles are duplicated per board (e.g., `#header`, `#header2`...`#header10`, `.key`, `.key2`...`.key10`)
- **`word_lists/generate_words.py`** — Python script that generates word data from Hspell dictionary files and CC100 corpus frequency data
- **`word_lists/hspell_generation.sh`** — Shell commands to extract word lists from the Hspell Hebrew spell-checker distribution

### Word Selection Logic

`calculate_meduyeket(date)` picks 10 words per day deterministically: it computes a day number from Jan 1, 2022, multiplies by 10, and indexes into `WORDS_NO_REPEAT` (isograms only — words with no repeated letters after normalizing sofit forms).

### State Management

All state is in `localStorage`: `guesses`/`guesses{2-10}`, `finished`/`finished{2-10}`, `results`/`results{2-10}`, `date`, `difficulty`, `colorblind`. On each new day (`date !== today`), guesses and finished flags are reset.

### Hebrew-Specific Logic

- `HEBREW_KEYMAP` maps both English QWERTY keys and Hebrew letters to their base Hebrew form
- `FINAL_LETTERS` maps sofit (final) forms to regular forms (e.g., ם→מ, ן→נ)
- `FINALED_LETTERS` maps regular forms to sofit (e.g., מ→ם) — used for auto-finalization at position 5
- `un_finalize()` normalizes words before comparison in `get_matches()`

## Language

The UI, variable names in comments, and user-facing strings are in Hebrew (RTL). Code identifiers are in English.
