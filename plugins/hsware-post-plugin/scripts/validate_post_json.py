#!/usr/bin/env python3
"""Lightweight validator for HSWare JSON drafts.

Usage:
  python validate_post_json.py post.json --focus-keyword "Discord"

This validates JSON syntax, recursively checks feature-description minimums,
and reports a generic exact-match keyword density over textual content.
The live HSWare runtime contract remains authoritative for which fields are
included in its own density denominator.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

WORD_RE = re.compile(r"\b[\w'-]+\b", re.UNICODE)


def words(text: str) -> list[str]:
    return WORD_RE.findall(text)


def iter_strings(value: Any, path: str = ""):
    if isinstance(value, str):
        yield path, value
    elif isinstance(value, list):
        for i, item in enumerate(value):
            yield from iter_strings(item, f"{path}[{i}]")
    elif isinstance(value, dict):
        for key, item in value.items():
            child = f"{path}.{key}" if path else key
            yield from iter_strings(item, child)


def feature_issues(value: Any, min_words: int) -> list[str]:
    issues: list[str] = []
    if isinstance(value, dict):
        for key, item in value.items():
            if key == "features" and isinstance(item, list):
                for i, feature in enumerate(item, 1):
                    if isinstance(feature, dict):
                        desc = feature.get("description", "")
                        if isinstance(desc, str):
                            n = len(words(desc))
                            if n < min_words:
                                issues.append(
                                    f"Feature {i} description is too short: {n} words < {min_words}."
                                )
            issues.extend(feature_issues(item, min_words))
    elif isinstance(value, list):
        for item in value:
            issues.extend(feature_issues(item, min_words))
    return issues


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("json_file", type=Path)
    p.add_argument("--focus-keyword", default="")
    p.add_argument("--feature-min", type=int, default=35)
    p.add_argument("--density-min", type=float, default=0.6)
    p.add_argument("--density-max", type=float, default=2.2)
    p.add_argument("--density-target-max", type=float, default=1.2)
    args = p.parse_args()

    try:
        data = json.loads(args.json_file.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"FAIL JSON: {exc}")
        return 2

    if not isinstance(data, dict):
        print("FAIL JSON: top-level value must be an object")
        return 2

    issues = feature_issues(data, args.feature_min)

    if args.focus_keyword:
        # Exclude the focus_keyword metadata value itself from generic content counting.
        texts = []
        for path, text in iter_strings(data):
            if path.endswith("focus_keyword"):
                continue
            texts.append(text)
        combined = " ".join(texts)
        total_words = len(words(combined))
        pattern = re.compile(re.escape(args.focus_keyword), re.IGNORECASE)
        occurrences = len(pattern.findall(combined))
        density = (occurrences / total_words * 100.0) if total_words else 0.0
        print(
            f"Focus keyword: {args.focus_keyword!r}; occurrences={occurrences}; "
            f"words={total_words}; density={density:.2f}%"
        )
        if density < args.density_min or density > args.density_max:
            issues.append(
                f"Focus Keyword density {density:.2f}% is outside hard range "
                f"{args.density_min:.2f}%-{args.density_max:.2f}%."
            )
        elif density > args.density_target_max:
            print(
                f"WARN density passes hard range but exceeds preferred "
                f"{args.density_target_max:.2f}% target."
            )

    if issues:
        for issue in issues:
            print("FAIL:", issue)
        return 1

    print("PASS: JSON syntax and configured checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
