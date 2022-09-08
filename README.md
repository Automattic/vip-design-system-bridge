# WP-THEME-TOKEN-TRANSFORMER

This is a script designed to take an export of a design system, and insert the tokens into the `theme.json` of a WordPress site. At the moment it only supports exports from Figma, using [this](https://www.figma.com/community/plugin/843461159747178978) plugin.

## Files needed

- Figma Tokens export made using [this](https://www.figma.com/community/plugin/843461159747178978) plugin
- Existing `theme.json` file

## Technical

* Based on the theme that is selected from the Figma export, the tokens are inserted directly under `settings->custom`. If a section prefix is desired, use the `--themeJsonSection` option.
* By default, the new `theme.json` is named as `theme.generated.json` to avoid accidental destruction of your `theme.json`. It is possible to override this, and therefore have the tokens be inserted into your existing `theme.json` with the `--overwrite` option.

### Instructions

```bash
npm install
node ingest-tokens.js --tokenPath='<path to token JSON>' --themePath='<path to theme directory>' --theme='<theme name set in token JSON>'

# Example:
# node ingest-tokens.js --tokenPath=~/tokens/valet-core.json --themePath=~/vip-go-skeleton/themes/valet/ --theme=wpvip
```

This will create a `theme.generated.json` file in the theme directory specified. In order to directly apply tokens to an existing `theme.json` file, add the `--overwrite` option:

```bash
# Generate tokens and overwrite existing theme.json in one step:
node ingest-tokens.js --overwrite --tokenPath='<path to token JSON>' --themePath='<path to theme directory>' --theme='<theme name set in token JSON>'
```

### Command-line options

```bash
  -v, --version                output the version number
  -h, --help                   display help for command
  --tokenPath <path>           path to token JSON file or directory
  --theme <theme-name>         selected $themes set in token JSON
  --themePath <path>           path to a WordPress theme
  --themeJsonSection <prefix>  section to insert tokens into theme.json->settings->custom (default: "")
  --overwrite                  overwrite existing theme.json (default: false)
```

## Documentation

The documentation is currently a WIP. Please refer to the `docs` folder for future documentation.