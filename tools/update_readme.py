#!/usr/bin/env python3
"""
Update the README.md "Today's Proverb" section from proverbs.json deterministically.

Rules:
- Select based on UTC day-of-year modulo length for consistency
- Idempotent: Only rewrite between markers
- Dry-run option prints the would-be content
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib
import sys
from typing import List, Dict

MARKER_START = "<!-- PROVERB-OF-THE-DAY:START -->"
MARKER_END = "<!-- PROVERB-OF-THE-DAY:END -->"


def load_proverbs(json_path: pathlib.Path) -> List[Dict[str, str]]:
    with json_path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError("proverbs.json must contain a list of objects")
    for item in data:
        for key in ("proverb", "translation", "meaning"):
            if key not in item:
                raise ValueError(f"Each proverb must include '{key}'")
    return data


def ordinal_day_utc(date: dt.date | None = None) -> int:
    if date is None:
        try:
            # For Python 3.11+ using UTC directly
            date = dt.datetime.now(dt.UTC).date()
        except AttributeError:
            # For older Python versions using timezone.utc
            date = dt.datetime.now(dt.timezone.utc).date()
    return (date - dt.date(date.year, 1, 1)).days


def render_block(proverb: Dict[str, str], when: dt.datetime) -> str:
    # Keep a simple readable block that mirrors README style
    updated = when.strftime("%Y-%m-%d (UTC)")
    lines = [
        MARKER_START,
        "> " + proverb["proverb"],
        "",
        f'"{proverb["translation"]}"',
        "",
        f"Meaning: {proverb['meaning']}",
        "",
        f"— Updated: {updated}",
        MARKER_END,
        "",
    ]
    return "\n".join(lines)


def replace_between_markers(readme_text: str, replacement_block: str) -> str:
    start_idx = readme_text.find(MARKER_START)
    end_idx = readme_text.find(MARKER_END)
    if start_idx == -1 or end_idx == -1:
        raise RuntimeError("README.md missing required markers for proverb section")
    end_idx += len(MARKER_END)
    # Preserve surrounding whitespace: we will ensure a trailing newline in our block
    return readme_text[:start_idx] + replacement_block + readme_text[end_idx:] 


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(description="Update README with today's proverb.")
    parser.add_argument("--root", type=pathlib.Path, default=pathlib.Path(__file__).resolve().parents[1], help="Project root path")
    parser.add_argument("--date", type=str, default=None, help="Override date as YYYY-MM-DD (UTC)")
    parser.add_argument("--dry-run", action="store_true", help="Do not write, just print changes")
    args = parser.parse_args(argv)

    root: pathlib.Path = args.root
    readme_path = root / "README.md"
    json_path = root / "proverbs.json"

    if args.date:
        try:
            date_obj = dt.datetime.strptime(args.date, "%Y-%m-%d").date()
            now = dt.datetime(date_obj.year, date_obj.month, date_obj.day)
        except ValueError:
            print("Invalid --date format, expected YYYY-MM-DD", file=sys.stderr)
            return 2
    else:
        try:
            # For Python 3.11+ using UTC directly
            now = dt.datetime.now(dt.UTC)
        except AttributeError:
            # For older Python versions using timezone.utc
            now = dt.datetime.now(dt.timezone.utc)

    proverbs = load_proverbs(json_path)
    if not proverbs:
        print("No proverbs found in proverbs.json", file=sys.stderr)
        return 3

    idx = ordinal_day_utc(now.date()) % len(proverbs)
    proverb = proverbs[idx]

    with readme_path.open("r", encoding="utf-8") as f:
        readme = f.read()

    new_block = render_block(proverb, now)
    updated = replace_between_markers(readme, new_block)

    if args.dry_run:
        sys.stdout.write(updated)
        return 0

    if updated != readme:
        with readme_path.open("w", encoding="utf-8") as f:
            f.write(updated)
        print(f"README.md updated with proverb index {idx}")
    else:
        print("README.md already up-to-date")

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
