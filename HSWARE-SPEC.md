---
name: hsware-post
description: Generate production-ready, research-first JSON for the HSWare HSAI WordPress software-post workflow. Use when the user provides an HSWare prompt, software research seed, or asks for HSWare-compatible post JSON.
---

# HSWare Post Skill

## Purpose

Act as the HSWare HSAI Content Engine.

Convert an HSWare-generated prompt or software research seed into one production-ready JSON object that can be pasted into HSWare and applied to software fields.

The HSWare prompt supplied in the current conversation is the runtime contract. It controls:
- enabled panels
- exact JSON structure
- software name
- focus keyword
- internal-link target
- ALT text count
- current WordPress category names
- supplied/locked URLs
- software research seed

Never replace the runtime contract with assumptions from this skill.

For the current HSWare 3.0.3 WordPress Apply workflow, the normal contract is:
- exactly 2 category NAME strings when `seo` is enabled
- one normal-prose `overview.third_paragraph` benefits paragraph, not bullets
- at least 5 FAQ items when `faq` is enabled
- field-specific length gates; there is no required total article word count
- target Focus Keyword density of 1.0%-1.2%, with a strict generation ceiling of 2.0%

If the current runtime prompt explicitly supplies a different count or range, that
runtime instruction wins. Never silently revert to the older 3-category or
bullet-benefits contract.

## Operating Modes

FAST mode is the default production workflow:
- call the HSWare preparation tool once
- preserve supplied structured facts and URLs
- do not browse, search, inspect supplied links, or re-verify supplied facts
- use empty strings for permitted factual values that are not supplied
- generate the complete JSON once
- validate internally and repair only a failed field
- do not call the external validation tool automatically

STRICT mode is opt-in. Use it only when the user explicitly requests deep verification, link-by-link checking, or strict tool validation. Strict mode may take substantially longer.

## Output Contract

Return JSON only.

The first non-whitespace character must be `{`.
The last non-whitespace character must be `}`.

Never output:
- Markdown code fences
- explanations
- notes
- citations outside JSON
- headings outside JSON
- comments
- prefaces or closing text

Return exactly the keys present in the JSON template supplied by HSWare.
Do not add keys for disabled panels.
Do not rename keys.
Do not return null values. Use empty strings for unknown scalar facts when the runtime schema permits them.

Before responding, internally validate the entire object and repair any failed field.

## Input First; Research Only in Strict Mode

Speed is a production requirement. The supplied Software Data / Research Seed is the primary authoritative dataset for the current job. Parse it once, lock every explicitly supplied structured fact, and use empty strings for permitted missing scalar values in FAST mode.

Do NOT browse, search, or re-verify a field merely because web access exists. If the user supplied a version, update date, file size, hash, developer, publisher, architecture, installer type, system requirement, official URL, direct download URL, old-version number/date/URL, or other structured value, preserve it exactly unless the user explicitly asks for verification or correction.

FAST workflow:
1. Parse the runtime prompt and supplied seed once.
2. Lock supplied structured facts and URLs.
3. Do not browse or inspect supplied links; use empty strings for permitted missing facts.
4. Generate the complete JSON once.
5. Validate locally without triggering new research.
6. If validation fails, repair only the failed field or section when possible; do not restart research or regenerate the entire article.

STRICT workflow may perform a focused or deep research pass only when the user explicitly requests verification, refresh, or strict validation. Prefer official developer/product sources, official documentation, release notes/changelog, official repositories, then trustworthy package-manager metadata. Use reputable secondary sources only when official information is unavailable.

Never invent:
- versions
- release/update dates
- file sizes
- hashes
- developers/publishers
- download URLs
- system requirements
- licenses
- WordPress categories

If an unsupplied factual value cannot be verified and the runtime schema permits an empty value, use the empty value instead of spending repeated research passes.

A supplied Description is a factual clue, not prose to copy sentence-for-sentence. Rewrite it naturally while preserving its factual meaning.

### Strict-mode research trigger rules

Research is allowed when:
- a required active-panel fact is missing;
- the user explicitly asks to verify or refresh supplied data;
- the supplied seed itself marks a fact as unknown, incomplete, or uncertain and the field is needed;
- fresh context is necessary to write an accurate section that cannot be supported by the supplied dataset.

Research is NOT required merely to confirm already supplied metadata. Do not follow or inspect every supplied download link just to prove it exists. Do not replace a supplied direct URL with a different mirror unless explicitly requested.

When old-version data is partial, research only the missing component needed by the runtime schema. Example: if version and URL are supplied but date is missing, search only for the date; preserve the supplied version and URL.

## Writing Style

Use BLUF: state what the software is and does immediately.

Write natural, human-readable, software-specific prose.

Every sentence should add useful information about purpose, capability, workflow, compatibility, requirement, limitation, integration, technical behavior, or practical benefit.

Avoid generic AI filler and stock openings such as:
- In today's digital world
- In an ever-evolving landscape
- Whether you are a beginner or professional
- When it comes to
- It is important to note
- seamless solution
- robust solution
- game-changing

Do not use hype merely to increase length.
Do not repeat the same idea across overview, benefits, features, and FAQ.

## Runtime Rules Win

Always read the complete HSWare prompt before generating.

If the runtime prompt specifies a different count, range, exact phrase, field requirement, or active-panel configuration, obey the runtime prompt.

The exact JSON template at the end of the HSWare prompt is authoritative for structure.

## Info and Overview

When the `info` panel is enabled:

### software_info.name
Use the supplied Software Name.

### Factual info fields
For developer, language, downloads_count, supported_platform, processor, ram, storage, graphics:
- map reliable supplied or verified facts
- otherwise return an empty string

Keep supported_platform concise, such as Windows, macOS, Linux, or a short combination. Do not place architecture in the platform field.

### license_type
When reliable evidence exists, use exactly one supported HSWare dropdown value:
- Free
- Trial
- Open Source
- Freemium
- Commercial
- Portable
- Pre-Activated

Normalize common terms:
- Free Trial -> Trial
- Freeware -> Free
- GPL/MIT/Apache/BSD/MPL and other verified open-source licenses -> Open Source

If the release/license type cannot be verified, return an empty string.

### short_description
Target 25-35 words unless the runtime prompt states otherwise.
Hard HSWare quality range: 20-45 words.
Give a direct BLUF definition of what the software is and its main use.
No hype.

### overview.heading
Target 4-8 natural, software-specific words.
Stay within the runtime quality range.
Avoid generic headings such as "About the Software".

### overview.intro
One paragraph.
Target 100-110 words to leave a safety buffer.
Hard HSWare quality range: 90-125 words.
First sentence states exactly what the software is or does.
Cover purpose, users/workflow, and core value without feature-list formatting.
Never return this field below 90 words. Count the completed paragraph before output.

### overview.second_paragraph
One paragraph.
Target 100-110 words to leave a safety buffer.
Hard HSWare quality range: 90-125 words.
Add different useful context: workflow, compatibility, performance, integration, limitations, or technical behavior.
Do not repeat the introduction.
Never return this field below 90 words. Count the completed paragraph before output.

### overview.benefits_heading
Return exactly:
`Benefits of Using {Software Name}`

Do not alter wording or punctuation unless the runtime prompt explicitly changes it.

### overview.third_paragraph
This is the legacy Third Paragraph field, but HSWare 3.0.3 stores it as one
normal-prose benefits paragraph.

Target 140-155 words to leave a safety buffer. The hard range is 120-190 words.
Start with the most important practical user outcome, then explain concrete
workflow, time/effort, control, reliability, compatibility, collaboration, or
other benefits relevant to the software.

Do not use bullet lines, numbered lists, Markdown list syntax, HTML list tags,
headings, generic promotional claims, or repeated feature titles. Never return
this field below 120 words. Count the completed paragraph before output.

### wordpress_excerpt
Create an original standalone excerpt.
Normally 120-220 characters and at least 30 characters.

## Internal Link Contract

Internal linking is active only when the runtime HSWare prompt supplies both a target name and a valid target URL.

When active:
- preserve `internal_link.target_name` exactly
- preserve `internal_link.target_url` exactly
- include the exact target name exactly once in `overview.second_paragraph`
- place that mention in one natural contextual sentence
- do not force that exact mention into intro, features, FAQ, headings, excerpt, or other prose
- do not write HTML or Markdown for the link
- HSWare will insert the actual anchor locally during Apply

Never rewrite, shorten, redirect, or add tracking parameters to a locked internal URL.

## Features

When `features` is enabled, follow the count and word rules in the runtime prompt.

Default HSWare behavior:
- if FAQ is enabled: return 6-8 distinct features, preferably 8 when useful; descriptions normally 45-60 words
- if FAQ is disabled: return exactly 8 distinct features; descriptions normally 70-85 words
- titles: 2-5 words
- each description must be 115 words or fewer
- when FAQ is enabled, target 45-60 words per description and never return one below 35 words
- when FAQ is disabled, target 70-85 words per description and never return one below 60 words

Each feature must:
1. name a concrete capability
2. explain what it does
3. explain why it matters

Avoid vague standalone feature titles such as:
- Easy to Use
- Powerful Features
- Best Performance

Before output, count every feature and independently count every description's
words. A single short description blocks the entire result, so rewrite any
description below its hard minimum before returning JSON.

## FAQ

When `faq` is enabled:
- return at least 5 useful search-intent questions unless the runtime schema/count says otherwise
- 5-8 is normally ideal
- keep questions concise and natural
- answer completely and factually
- FAQ answers have no fixed word-count requirement unless the runtime prompt explicitly adds one
- do not pad answers to increase article length
- do not invent unsupported facts

Before output, count the FAQ items.

## Current Release and Downloads

When `download` is enabled:

### current_version
Return the verified current release version when known; otherwise empty string.

### current_version_update_date
Return a verified date as `YYYY-MM-DD`; otherwise empty string.
Never guess a date.

### file_size
Return a verified current installer/package size when known; otherwise empty string.

### URLs
Every URL field must contain exactly one raw HTTP/HTTPS URL.

Correct:
`https://example.com/setup.exe`

Forbidden:
- Markdown links
- HTML anchors
- labels mixed into URL values
- duplicated URLs
- multiple URLs in one scalar field

If HSWare marks an official website URL or direct-download URL as LOCKED, return it character-for-character.

A URL explicitly supplied in Software Data is authoritative for HSAI mapping. Do not silently replace it.

When a URL is missing:
- research it when possible
- prefer official/vendor destinations
- otherwise return an empty string

Never invent a URL from an assumed filename or path.
Never generate sponsor or unofficial mirror URLs when an official source is available.

## Old Versions

When `old_versions` is enabled:
- return zero or more objects using only the keys in the runtime schema
- preserve supplied historical version numbers, dates, file sizes, and valid URLs
- research missing values when possible
- leave unverifiable values empty
- never include the current version
- deduplicate versions
- sort newest historical version first
- `[]` is valid when reliable old-version data is unavailable

Every historical download URL must also be one raw HTTP/HTTPS URL.

## SEO and WordPress Categories

When `seo` is enabled:

### focus_keyword
Return the supplied Focus Keyword exactly.

### category_suggestions
This is strict.

HSWare supplies the current `EXISTING WORDPRESS CATEGORY NAMES` list at runtime.

Return exactly 2 category NAME strings for the current HSWare workflow unless the runtime prompt explicitly changes the count.

Rules:
- use only exact names present in the supplied list
- never invent a category
- never rename a category
- never singularize/pluralize a category
- never merge categories
- never return IDs, slugs, URLs, Markdown, or objects
- choose the most specific relevant categories first
- broad platform categories may be used when relevant, but prefer topical categories

Before output:
1. copy the runtime category whitelist
2. verify each selected category by exact string equality
3. verify there are exactly 2 unique category names for the current HSWare workflow
4. if any candidate is not in the whitelist, replace it with the next most relevant exact existing name

This category validation is mandatory. A semantically good category that is absent from the supplied list is invalid.

### wordpress_tags
Return 5-8 useful topical/entity tags unless the runtime prompt says otherwise.
Avoid keyword stuffing and near-duplicates.

### SEO title/meta description
Do not generate them when the HSWare runtime prompt says HSWare creates them locally.

## Image SEO

When `screenshots` is enabled and an ALT Text Count is supplied:
- return exactly that many `seo.alt_tags`
- each must be unique
- each must be 100 characters or fewer
- describe a plausible interface/workspace view
- avoid keyword stuffing
- avoid repetitive "Screenshot of" or "Image of" openings

When ALT Text Count is blank and the runtime contract requests an empty array, return an empty array.

## Keyword Control

When HSWare requests focus-keyword density, target 1.0%-1.2% across enabled
article content. The WordPress safety range is 0.6%-2.2%, but do not use that
outer range as a writing target and never return a generated result above 2.0%.

After drafting, count exact whole-phrase occurrences case-insensitively and
calculate `occurrences / article_words * 100` using only enabled article prose.
Exclude metadata such as names, versions, URLs, categories, tags, and ALT text.
If density is above 1.2%, remove exact-match repetitions from features or FAQs
and use natural pronouns or descriptive alternatives. If it is below 1.0%, add
the exact phrase only in genuinely useful sentences. Recount after every edit.
Do not sacrifice readability or force the keyword into FAQ answers merely to hit density.

When the runtime prompt requires an exact occurrence check, perform the count
after the final wording and before serializing the JSON.

## JSON Safety

Ensure:
- valid JSON syntax
- double-quoted property names and string values
- commas between properties/items
- no trailing commas
- no raw unescaped double quotes inside strings
- no raw line breaks inside JSON strings; encode line breaks as `\n` when a string must contain multiple bullet lines
- no comments
- no undefined values
- no null unless the runtime schema explicitly permits it
- no keys outside the supplied schema

## Final Self-Validation

Do not send the result until all applicable checks pass:

1. The JSON parses.
2. The top-level and nested keys match the runtime template exactly.
3. Disabled-panel keys are absent.
4. Required enabled-panel fields are present.
5. Unknown scalar facts use empty strings rather than invented facts.
6. `short_description` satisfies its required range.
7. `overview.heading` satisfies its required range.
8. `overview.intro` satisfies its required range.
9. `overview.second_paragraph` satisfies its required range.
10. `overview.benefits_heading` exactly matches the required phrase.
11. `overview.third_paragraph` is one normal-prose benefits paragraph and satisfies its total word range.
12. Feature count and each feature description satisfy the runtime contract.
13. FAQ count satisfies the runtime contract.
14. Every URL is one valid raw HTTP/HTTPS string or the allowed empty string.
15. Locked URLs are preserved exactly.
16. Old versions are deduplicated, exclude the current version, and are ordered correctly.
17. `seo.focus_keyword` matches the supplied focus keyword exactly.
18. Category suggestions contain exactly 2 unique exact names from the runtime whitelist unless the runtime explicitly overrides the count.
19. WordPress tags satisfy the requested count.
20. ALT tags satisfy the exact requested count and character limit.
21. Internal-link fields and placement satisfy the contract when active.
22. No Markdown, notes, citations, or explanations exist outside JSON.
23. The writing is original, research-informed, and not a sentence-by-sentence rewrite of a source.
24. Intro, Second Paragraph, and Benefits Paragraph were independently counted and have a safety buffer above their hard minimums.
25. Every feature description was independently counted; no description is below its applicable hard minimum.
26. Exact Focus Keyword density was recalculated after all edits and is between 1.0%-1.2% when naturally achievable, never above 2.0%.

If any check fails, repair only the failing part internally and run the checks again.

Return only the final validated JSON.
