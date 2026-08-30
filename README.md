# HSWare Post Plugin v1.0

A skills-only ChatGPT/Codex plugin for generating research-first, HSWare-compatible software-post JSON.

## Included

- Native plugin manifest: `plugins/hsware-post-plugin/.codex-plugin/plugin.json`
- HSWare skill: `plugins/hsware-post-plugin/skills/hsware-post/SKILL.md`
- Validation reference and local JSON validator
- GitHub marketplace manifest: `.agents/plugins/marketplace.json`

## Upload to GitHub

Upload the contents of this ZIP to the root of a GitHub repository. Keep the hidden `.agents` and `.codex-plugin` directories exactly as included.

Before wider distribution, replace the placeholder `homepage`, `repository`, and author URL values in `plugin.json` with your real project URLs. Add your logo under the plugin `assets/` folder and then set `interface.logo` and `interface.composerIcon` if desired.

## GitHub marketplace import

OpenAI currently supports importing `.agents/plugins/marketplace.json` from GitHub for eligible workspace admins. In ChatGPT, the admin enters the repository URL and leaves Path blank when the marketplace is at the repository root.

A public GitHub repository does not by itself make the plugin universally searchable in the public Plugin Directory. Distribution and publishing depend on OpenAI account/workspace permissions and directory programs.

## Local validator

Example:

```bash
python plugins/hsware-post-plugin/scripts/validate_post_json.py output.json --focus-keyword "Discord"
```

The runtime HSWare prompt remains authoritative. The helper validator cannot know every future HSWare panel-specific density denominator unless that behavior is encoded in the runtime contract.
