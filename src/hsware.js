export const HSWARE_SPEC = `---
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

## Output Contract

Return JSON only.

The first non-whitespace character must be \`{\`.
The last non-whitespace character must be \`}\`.

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

## Input First, Research Gaps Only

Speed is a production requirement. The supplied Software Data / Research Seed is the primary authoritative dataset for the current job. Parse it first, lock every explicitly supplied structured fact, identify only genuinely missing fields required by the active HSWare panels, and research only those gaps.

Do NOT browse, search, or re-verify a field merely because web access exists. If the user supplied a version, update date, file size, hash, developer, publisher, architecture, installer type, system requirement, official URL, direct download URL, old-version number/date/URL, or other structured value, preserve it exactly unless the user explicitly asks for verification or correction.

Default workflow:
1. Parse the runtime prompt and supplied seed once.
2. Lock supplied structured facts and URLs.
3. Determine which required active-panel fields are actually missing.
4. If no critical fields are missing, skip factual web research and write immediately.
5. If critical fields are missing, use one focused research pass for only those gaps.
6. Prefer official developer/product sources, official documentation, release notes/changelog, official repositories, then trustworthy package-manager metadata. Use reputable secondary sources only when official information is unavailable.
7. Generate the complete JSON once.
8. Validate locally without triggering new research.
9. If validation fails, repair only the failed field or section when possible; do not restart research or regenerate the entire article unnecessarily.

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

### Research trigger rules

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

When the \`info\` panel is enabled:

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
Target 95-115 words.
Hard HSWare quality range: 90-125 words.
First sentence states exactly what the software is or does.
Cover purpose, users/workflow, and core value without feature-list formatting.

### overview.second_paragraph
One paragraph.
Target 95-115 words.
Hard HSWare quality range: 90-125 words.
Add different useful context: workflow, compatibility, performance, integration, limitations, or technical behavior.
Do not repeat the introduction.

### overview.benefits_heading
Return exactly:
\`Benefits of Using {Software Name}\`

Do not alter wording or punctuation unless the runtime prompt explicitly changes it.

### overview.third_paragraph
This is the legacy Third Paragraph field, but HSWare 3.0 uses it as a benefits bullet list.

Return:
- 5-7 plain-text bullet lines
- each line begins with \`- \`
- 120-190 words total
- target roughly 130-170 words when possible

Each bullet explains a practical user benefit such as workflow improvement, time/effort savings, control, reliability, compatibility, collaboration, or another concrete outcome.

Do not use:
- HTML
- numbered lists
- headings
- generic promotional claims
- repeated feature titles

### wordpress_excerpt
Create an original standalone excerpt.
Normally 120-220 characters and at least 30 characters.

## Internal Link Contract

Internal linking is active only when the runtime HSWare prompt supplies both a target name and a valid target URL.

When active:
- preserve \`internal_link.target_name\` exactly
- preserve \`internal_link.target_url\` exactly
- include the exact target name exactly once in \`overview.second_paragraph\`
- place that mention in one natural contextual sentence
- do not force that exact mention into intro, features, FAQ, headings, excerpt, or other prose
- do not write HTML or Markdown for the link
- HSWare will insert the actual anchor locally during Apply

Never rewrite, shorten, redirect, or add tracking parameters to a locked internal URL.

## Features

When \`features\` is enabled, follow the count and word rules in the runtime prompt.

Default HSWare behavior:
- if FAQ is enabled: return 6-8 distinct features, preferably 8 when useful; descriptions normally 45-60 words
- if FAQ is disabled: return exactly 8 distinct features; descriptions normally 70-85 words
- titles: 2-5 words
- each description must be 115 words or fewer

Each feature must:
1. name a concrete capability
2. explain what it does
3. explain why it matters

Avoid vague standalone feature titles such as:
- Easy to Use
- Powerful Features
- Best Performance

Before output, count every feature and independently count each description's words. Rewrite internally if a required count/range is missed.

## FAQ

When \`faq\` is enabled:
- return at least 5 useful search-intent questions unless the runtime schema/count says otherwise
- 5-8 is normally ideal
- keep questions concise and natural
- answer completely and factually
- FAQ answers have no fixed word-count requirement unless the runtime prompt explicitly adds one
- do not pad answers to increase article length
- do not invent unsupported facts

Before output, count the FAQ items.

## Current Release and Downloads

When \`download\` is enabled:

### current_version
Return the verified current release version when known; otherwise empty string.

### current_version_update_date
Return a verified date as \`YYYY-MM-DD\`; otherwise empty string.
Never guess a date.

### file_size
Return a verified current installer/package size when known; otherwise empty string.

### URLs
Every URL field must contain exactly one raw HTTP/HTTPS URL.

Correct:
\`https://example.com/setup.exe\`

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

When \`old_versions\` is enabled:
- return zero or more objects using only the keys in the runtime schema
- preserve supplied historical version numbers, dates, file sizes, and valid URLs
- research missing values when possible
- leave unverifiable values empty
- never include the current version
- deduplicate versions
- sort newest historical version first
- \`[]\` is valid when reliable old-version data is unavailable

Every historical download URL must also be one raw HTTP/HTTPS URL.

## SEO and WordPress Categories

When \`seo\` is enabled:

### focus_keyword
Return the supplied Focus Keyword exactly.

### category_suggestions
This is strict.

HSWare supplies the current \`EXISTING WORDPRESS CATEGORY NAMES\` list at runtime.

Return exactly 3 category NAME strings unless the runtime prompt explicitly changes the count.

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
3. verify there are exactly 3 unique category names
4. if any candidate is not in the whitelist, replace it with the next most relevant exact existing name

This category validation is mandatory. A semantically good category that is absent from the supplied list is invalid.

### wordpress_tags
Return 5-8 useful topical/entity tags unless the runtime prompt says otherwise.
Avoid keyword stuffing and near-duplicates.

### SEO title/meta description
Do not generate them when the HSWare runtime prompt says HSWare creates them locally.

## Image SEO

When \`screenshots\` is enabled and an ALT Text Count is supplied:
- return exactly that many \`seo.alt_tags\`
- each must be unique
- each must be 100 characters or fewer
- describe a plausible interface/workspace view
- avoid keyword stuffing
- avoid repetitive "Screenshot of" or "Image of" openings

When ALT Text Count is blank and the runtime contract requests an empty array, return an empty array.

## Keyword Control

When HSWare requests focus-keyword density, aim naturally around the runtime target, normally 1.0%-1.5% across generated content.

Do not sacrifice readability or force the keyword into FAQ answers merely to hit density.

When the runtime prompt requires an exact occurrence check, count occurrences field by field before output.

## JSON Safety

Ensure:
- valid JSON syntax
- double-quoted property names and string values
- commas between properties/items
- no trailing commas
- no raw unescaped double quotes inside strings
- no raw line breaks inside JSON strings; encode line breaks as \`\\n\` when a string must contain multiple bullet lines
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
6. \`short_description\` satisfies its required range.
7. \`overview.heading\` satisfies its required range.
8. \`overview.intro\` satisfies its required range.
9. \`overview.second_paragraph\` satisfies its required range.
10. \`overview.benefits_heading\` exactly matches the required phrase.
11. \`overview.third_paragraph\` contains 5-7 benefit bullets and satisfies its total word range.
12. Feature count and each feature description satisfy the runtime contract.
13. FAQ count satisfies the runtime contract.
14. Every URL is one valid raw HTTP/HTTPS string or the allowed empty string.
15. Locked URLs are preserved exactly.
16. Old versions are deduplicated, exclude the current version, and are ordered correctly.
17. \`seo.focus_keyword\` matches the supplied focus keyword exactly.
18. Category suggestions contain exactly the required number of unique exact names from the runtime whitelist.
19. WordPress tags satisfy the requested count.
20. ALT tags satisfy the exact requested count and character limit.
21. Internal-link fields and placement satisfy the contract when active.
22. No Markdown, notes, citations, or explanations exist outside JSON.
23. The writing is original, research-informed, and not a sentence-by-sentence rewrite of a source.

If any check fails, repair only the failing part internally and run the checks again.

Return only the final validated JSON.
`;

const PANEL_KEYS = {
  info: ['software_info', 'overview', 'wordpress_excerpt'],
  download: ['current_version', 'current_version_update_date', 'file_size', 'downloads'],
  features: ['features'],
  old_versions: ['old_versions'],
  faq: ['faq'],
  seo: ['seo'],
  screenshots: ['screenshots']
};

export function words(text) {
  if (typeof text !== 'string') return 0;
  const cleaned = text.replace(/https?:\/\/\S+/g, ' ').replace(/[^\p{L}\p{N}'’-]+/gu, ' ').trim();
  return cleaned ? cleaned.split(/\s+/u).filter(Boolean).length : 0;
}

export function exactOccurrences(text, phrase) {
  if (!phrase || typeof text !== 'string') return 0;
  const escape = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${escape}(?![\\p{L}\\p{N}])`, 'giu');
  return [...text.matchAll(re)].length;
}

function collectStrings(value, pathParts = [], out = []) {
  if (typeof value === 'string') {
    out.push({ path: pathParts.join('.'), value });
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectStrings(v, [...pathParts, String(i)], out));
    return out;
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) collectStrings(v, [...pathParts, k], out);
  }
  return out;
}

const NON_ARTICLE_PATH = /(^|\.)(name|developer|language|downloads_count|supported_platform|processor|ram|storage|graphics|license_type|current_version|current_version_update_date|file_size|url|official_url|direct_url|download_url|version|date|sha256|sha_256|hash|focus_keyword|category_suggestions|wordpress_tags|alt_tags|target_url)(\.|$)/i;

export function articleTextFromJson(obj) {
  const pieces = collectStrings(obj)
    .filter(x => !NON_ARTICLE_PATH.test(x.path))
    .map(x => x.value)
    .filter(Boolean);
  return pieces.join(' ');
}

export function parseRuntime(runtimePrompt = '') {
  const text = String(runtimePrompt || '');
  const enabled = [];
  const enabledMatch = text.match(/Enabled\s*:\s*([^\n\r]+)/i);
  if (enabledMatch) {
    for (const item of enabledMatch[1].split(',').map(s => s.trim().toLowerCase())) {
      if (item) enabled.push(item.replace(/[^a-z_]/g, ''));
    }
  }

  const focusPatterns = [
    /Focus Keyword\s*:\s*([^\n\r]+)/i,
    /Primary Keyword\s*:\s*([^\n\r]+)/i,
    /"focus_keyword"\s*:\s*"([^"]+)"/i
  ];
  let focusKeyword = '';
  for (const re of focusPatterns) {
    const m = text.match(re);
    if (m) { focusKeyword = m[1].trim().replace(/^['"]|['"]$/g, ''); break; }
  }

  const altCountMatch = text.match(/ALT Text Count\s*:\s*(\d+)/i);
  const altTextCount = altCountMatch ? Number(altCountMatch[1]) : null;

  return { enabledPanels: [...new Set(enabled)], focusKeyword, altTextCount };
}

function findFeatures(obj) {
  return Array.isArray(obj?.features) ? obj.features : [];
}
function findFaq(obj) {
  return Array.isArray(obj?.faq) ? obj.faq : [];
}
function featureDescription(item) {
  if (!item || typeof item !== 'object') return '';
  for (const key of ['description', 'feature_description', 'text', 'content']) if (typeof item[key] === 'string') return item[key];
  return '';
}

function validateUrls(value, pathParts = [], issues = []) {
  if (Array.isArray(value)) {
    value.forEach((v, i) => validateUrls(v, [...pathParts, String(i)], issues));
    return issues;
  }
  if (!value || typeof value !== 'object') return issues;
  for (const [k, v] of Object.entries(value)) {
    const p = [...pathParts, k];
    if (/url/i.test(k) && typeof v === 'string' && v !== '') {
      if (!/^https?:\/\/\S+$/i.test(v) || /\]\(|<a\s/i.test(v)) {
        issues.push(`${p.join('.')} must be one raw HTTP/HTTPS URL string.`);
      }
    }
    validateUrls(v, p, issues);
  }
  return issues;
}

export function validateCandidate({ candidateJson, runtimePrompt = '', focusKeyword = '' }) {
  const errors = [];
  const warnings = [];
  let obj;
  try {
    obj = typeof candidateJson === 'string' ? JSON.parse(candidateJson) : candidateJson;
  } catch (e) {
    return { valid: false, errors: [`Invalid JSON: ${e.message}`], warnings, metrics: {} };
  }
  if (!obj || Array.isArray(obj) || typeof obj !== 'object') {
    return { valid: false, errors: ['Top-level JSON value must be one object.'], warnings, metrics: {} };
  }

  const runtime = parseRuntime(runtimePrompt);
  const keyword = (focusKeyword || runtime.focusKeyword || obj?.seo?.focus_keyword || '').trim();

  // Disabled panel leakage when runtime explicitly declares enabled panels.
  if (runtime.enabledPanels.length) {
    for (const [panel, keys] of Object.entries(PANEL_KEYS)) {
      if (!runtime.enabledPanels.includes(panel)) {
        for (const key of keys) if (Object.prototype.hasOwnProperty.call(obj, key)) errors.push(`Disabled panel ${panel} leaked key ${key}.`);
      }
    }
  }

  // Common HSWare word gates.
  const shortDesc = obj?.software_info?.short_description ?? obj?.short_description;
  if (typeof shortDesc === 'string') {
    const n = words(shortDesc);
    if (n < 20 || n > 45) errors.push(`short_description is ${n} words; hard range is 20-45.`);
  }
  const overview = obj?.overview;
  if (overview && typeof overview === 'object') {
    if (typeof overview.heading === 'string') {
      const n = words(overview.heading);
      if (n < 4 || n > 12) errors.push(`overview.heading is ${n} words; hard range is 4-12.`);
    }
    for (const k of ['intro', 'second_paragraph']) {
      if (typeof overview[k] === 'string') {
        const n = words(overview[k]);
        if (n < 90 || n > 125) errors.push(`overview.${k} is ${n} words; hard range is 90-125.`);
      }
    }
  }

  const faqEnabled = runtime.enabledPanels.includes('faq') || findFaq(obj).length > 0;
  const features = findFeatures(obj);
  if (features.length) {
    if (faqEnabled) {
      if (features.length < 6 || features.length > 8) errors.push(`features count is ${features.length}; expected 6-8 when FAQ is enabled.`);
    } else if (features.length !== 8) {
      errors.push(`features count is ${features.length}; expected exactly 8 when FAQ is disabled.`);
    }
    features.forEach((f, i) => {
      const desc = featureDescription(f);
      const n = words(desc);
      const min = faqEnabled ? 35 : 60;
      if (n < min) errors.push(`Feature ${i + 1} description is ${n} words; minimum is ${min}.`);
      if (n > 115) errors.push(`Feature ${i + 1} description is ${n} words; maximum is 115.`);
    });
  }

  const faq = findFaq(obj);
  if (runtime.enabledPanels.includes('faq') && faq.length < 5) errors.push(`FAQ count is ${faq.length}; minimum is 5.`);

  validateUrls(obj, [], errors);

  // Category count and uniqueness; whitelist membership remains runtime-dependent.
  const cats = obj?.seo?.category_suggestions;
  if (Array.isArray(cats)) {
    if (cats.length !== 3) errors.push(`category_suggestions count is ${cats.length}; expected 3 unless runtime overrides it.`);
    if (new Set(cats).size !== cats.length) errors.push('category_suggestions contains duplicates.');
  }

  // ALT count when provided.
  if (runtime.altTextCount !== null) {
    const alts = obj?.seo?.alt_tags;
    if (!Array.isArray(alts) || alts.length !== runtime.altTextCount) errors.push(`seo.alt_tags must contain exactly ${runtime.altTextCount} items.`);
  }

  // Focus keyword density. We intentionally target below the HSWare hard ceiling.
  const articleText = articleTextFromJson(obj);
  const articleWords = words(articleText);
  const occurrences = keyword ? exactOccurrences(articleText, keyword) : 0;
  const density = articleWords && keyword ? (occurrences / articleWords) * 100 : 0;
  if (keyword && articleWords) {
    if (density < 0.6 || density > 2.2) errors.push(`Focus Keyword density is ${density.toFixed(2)}%; HSWare safety range is 0.6%-2.2%.`);
    else if (density > 1.2) warnings.push(`Focus Keyword density is ${density.toFixed(2)}%; reduce exact-match use toward 1.0%-1.2% for a safety margin.`);
  } else if (!keyword) {
    warnings.push('Focus Keyword was not supplied or detected, so density could not be validated.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    metrics: {
      focusKeyword: keyword,
      exactKeywordOccurrences: occurrences,
      articleWordCount: articleWords,
      keywordDensityPercent: Number(density.toFixed(2)),
      featureCount: features.length,
      faqCount: faq.length,
      enabledPanels: runtime.enabledPanels
    }
  };
}

export function contractSummary(runtimePrompt = '') {
  const runtime = parseRuntime(runtimePrompt);
  return {
    runtime,
    instructions: [
      'Treat the current HSWare runtime prompt as authoritative for enabled panels, exact JSON schema, counts, locked URLs, categories, internal links and supplied facts.',
      'INPUT-FIRST FAST WORKFLOW: lock and preserve every explicitly supplied structured fact and URL. Do not research or re-verify supplied fields unless the user explicitly requests verification or correction.',
      'Research gaps only: identify missing facts required by active panels and make at most one focused research pass by default. If no critical facts are missing, skip factual web research.',
      'Validate locally without new research. Repair only failed fields or sections instead of restarting research or regenerating the entire article.',
      'Generate only keys present in the runtime JSON template and omit disabled-panel keys.',
      'Before final output, validate every hard word/count gate and exact focus-keyword density.',
      'Target focus-keyword density at 1.0%-1.2%; never exceed the HSWare hard maximum of 2.2%.',
      'Feature descriptions: when FAQ is enabled, never below 35 words; when FAQ is disabled, never below 60 words. Respect runtime targets if stricter.',
      'Return one valid JSON object. Repair malformed JSON, unescaped quotes, invalid URLs and other blockers before finalizing.'
    ]
  };
}
