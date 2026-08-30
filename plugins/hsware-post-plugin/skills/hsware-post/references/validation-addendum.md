# HSWare Validation Addendum

This reference documents the v1.0 hardening rules used by the HSWare Post Plugin.

## Keyword density

Formula:

`density_percent = exact_case_insensitive_focus_keyword_occurrences / total_validated_article_words * 100`

Default safe target: 1.0%-1.2%.
Runtime hard safety range takes precedence. When the common HSWare hard range is 0.6%-2.2%, the plugin should still prefer <=2.0% and ideally 1.0%-1.2%.

## Features

When FAQ is enabled, each feature description must be at least 35 words; target 45-60 words unless the runtime prompt provides a different target.

## JSON

Return one strict JSON object matching the runtime schema exactly. No disabled-panel keys. No invented technical facts. No Markdown fences when the HSWare runtime contract says JSON only.
