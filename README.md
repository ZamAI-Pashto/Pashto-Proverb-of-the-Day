# Pashto Proverb of the Day

A simple, elegant web application that displays a random Pashto proverb (`متل`) each day, along with its English translation and contextual meaning.

## Today's Proverb (auto-updated)

<!-- PROVERB-OF-THE-DAY:START -->
> دلته متل به په اوتومات ډول تازه شي.

"The proverb will auto-update here."

Meaning: The contextual meaning will appear here.

— Updated: 1970-01-01 (UTC)
<!-- PROVERB-OF-THE-DAY:END -->

## Features

- **Daily Proverbs**: Get a new, insightful Pashto proverb every time you click the "New Proverb" button.
- **Bilingual Display**: See the proverb in its original Pashto script and its literal English translation.
- **Contextual Meaning**: Understand the deeper wisdom behind each proverb with a clear explanation.
- **Copy & Share**: Easily copy the proverb to your clipboard or share it via native device sharing.
- **Elegant Design**: A clean, minimalist UI with a focus on beautiful typography to honor the content.

## How to Run Locally

1.  Navigate to the project directory.
2.  Start a simple Python HTTP server:
    ```bash
    python -m http.server
    ```
3.  Open your web browser and go to `http://localhost:8000`.

## Project Structure

- `index.html`: The main HTML file containing the structure of the page.
- `static/css/styles.css`: The stylesheet responsible for the visual design and typography.
- `static/js/scripts.js`: The JavaScript file that fetches proverbs from the JSON file and handles user interactions.
- `proverbs.json`: A JSON file containing the collection of Pashto proverbs, their translations, and meanings.
- `README.md`: This file.
