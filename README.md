# vip-design-system-bridge

This is a script designed to take an export of a design system, and insert the tokens into the `theme.json` of a WordPress site. At the moment it only supports exports from Figma, using [this](https://www.figma.com/community/plugin/843461159747178978) plugin.

## Exporting Data from your Design System

See **[Figma Tokens Tutorial][docs-figma-tokens-tutorial]**.

## Using the Script

Once data has been exported from your design system, into either a folder or a single JSON token file the script is almost ready to be run.

The script makes some assumptions by default, and its critical to ensure that these are correct for your design system:

* For PRO Plugin users: Know what exact theme name set you want to pick out from the token JSON export from Figma. An example would be if your main set was `valet` then valet is your theme name set that you want to use.

![Screenshot of a pro plugin user in Figma][png-pro-plugin-usage]

* For NON-PRO Plugin users: Know what exactly is the source set, and the layer sets that take advantage of the source set from the token JSON export from Figma. It's also possible to skip this entirely, and just use all the sets from the export.

![Screenshot of a non-pro plugin user in Figma][png-non-pro-plugin-usage]

* An existing [`theme.json`](https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/) file where the tokens from your export would be inserted. Note that by default, the script does not overwrite the `theme.json`. Instead, it writes to a new file called `theme.generated.json`. This can be overriden using the `--overwrite` flag.
* Based on the theme that is selected from the Figma export, the tokens are inserted directly under `settings->custom`. If a section prefix is desired, use the `--themeJsonSection` option.

### Steps

* In order to get started, you will need to ensure that repo has been cloned locally.
* After that, run the following to install all necessary dependencies for this script:

```bash
npm install
```
* The script is now ready to run. Please note that by default the script does not overwrite the `theme.json`. Instead, it will write to a file called `theme.generated.json` for safety. Using the `---overwrite` flag will overwrite the `theme.json` instead. The following is how the script would be run:

OPTION 1 - FOR PRO PLUGIN USERS
```bash
node ingest-tokens.js --tokenPath='<path to token JSON file or directory>' --themePath='<path to theme directory>' --theme='<theme name set in token JSON>'

# Example:
# node ingest-tokens.js --tokenPath=~/tokens/valet-core.json --themePath=~/vip-go-skeleton/themes/valet/ --theme=twentytwentyone
```

OPTION 2 - FOR NON-PRO PLUGIN USERS WITH A SOURCE SET AND LAYER SET USING IT
```bash
node ingest-tokens.js --tokenPath='<path to token JSON file or directory>' --themePath='<path to theme directory>' --sourceSet='<source set from the token JSON>' --layerSets='<layer sets from the token JSON>'

# Example:
# node ingest-tokens.js --tokenPath=~/tokens/valet-core.json --themePath=~/vip-go-skeleton/themes/valet/ --sourceSet=global --layerSets=material-3-text,material-3-color
```

OPTION 3 - FOR NON-PRO PLUGIN USERS WITH ALL SETS TO BE USED
```bash
node ingest-tokens.js --tokenPath='<path to token JSON file or directory>' --themePath='<path to theme directory>'

# Example:
# node ingest-tokens.js --tokenPath=~/tokens/valet-core.json --themePath=~/vip-go-skeleton/themes/valet/ --theme=twentytwentyone
```
* With that, the `theme.json` now has the tokens from your design system export and is ready for usage in your WordPress site.

THe following is a good summary of available command-line options within the script:

```bash
  -v, --version                output the version number
  -h, --help                   display help for command
  --tokenPath <path>           path to token JSON file or directory
  --sourceSet <source-set(s)>  NON-PRO PLUGIN OPTION: source set in the token JSON
  --layerSets <layer-set(s)>   NON-PRO PLUGIN OPTION: layers built using the source set in token JSON
  --theme <theme-name>         PRO PLUGIN OPTION: selected $themes set in token JSON
  --themePath <path>           path to a WordPress theme
  --themeJsonSection <prefix>  section to insert tokens into theme.json->settings->custom (default: "")
  --overwrite                  overwrite existing theme.json (default: false)
```

[png-pro-plugin-usage]: https://github.com/Automattic/vip-design-system-bridge/blob/trunk/docs/assets/pro-plugin-usage.png
[png-non-pro-plugin-usage]: https://github.com/Automattic/vip-design-system-bridge/blob/trunk/docs/assets/non-pro-plugin-usage.png
[docs-figma-tokens-tutorial]: https://github.com/Automattic/vip-design-system-bridge/blob/trunk/docs/design-tokens-example/README.md
