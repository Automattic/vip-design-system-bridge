# VIP Design System Bridge Tool

This is a script designed to take an export of a design system, and insert the tokens into the `theme.json` of a WordPress site. At the moment it supports two types of sources - Figma and CSS.

## Figma

This is specifically exports made using using [this](https://www.figma.com/community/plugin/843461159747178978) plugin.

Refer to [this WPVIP post](https://wpvip.com/2022/12/09/figma-to-wordpress/) for a tutorial on how to connect a design system in Figma with WordPress, using the Figma Tokens plugin.

### Using the Script

Once data has been exported from your design system, into either a folder or a single JSON token file the script is almost ready to be run.

The script makes some assumptions by default, and its critical to ensure that these are correct for your design system:

* For PRO Plugin users: Know what exact theme name set you want to pick out from the token JSON export from Figma. An example would be if your main set was `valet` then valet is your theme name set that you want to use.

![Screenshot of a pro plugin user in Figma][png-pro-plugin-usage]

* For NON-PRO Plugin users: Know what exactly is the source set, and the layer sets that take advantage of the source set from the token JSON export from Figma. It's also possible to skip this entirely, and just use all the sets from the export.

![Screenshot of a non-pro plugin user in Figma][png-non-pro-plugin-usage]

* An existing [`theme.json`](https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/) file where the tokens from your export would be inserted. Note that by default, the script does not overwrite the `theme.json`. Instead, it writes to a new file called `theme.generated.json`. This can be overriden using the `--overwrite` flag.
* Based on the theme that is selected from the Figma export, the tokens are inserted directly under `settings->custom`. If a section prefix is desired, use the `--themeJsonSection` option.

#### Steps

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

## CSS

This is done using a single CSS file only.

### Using the Script

Once the CSS file is handy, the script is almost ready to be run. There is another file necessary, which is the theme tokens to CSS map. This would be a JSON file that maps a custom token used in your WordPress site's `theme.json` to a CSS variable in your CSS file. There is an empty token map provided [here](reference-files/default-token-map.json).

Unlike the Figma route above, the CLI arguments look slighty different like so:

```bash
node ingest-tokens.js --tokenPath='<path to CSS file>' --tokenMapPath='<path to tokenMap file>' --themePath='<path to theme directory>'

# Example:
# node ingest-tokens.js --tokenPath=~/valet.css --tokenMapPath=~/token-map.json --themePath=~/vip-go-skeleton/themes/valet/
```

Using the above, we have taken the [California Design Theme](https://designsystem.webstandards.ca.gov) and come up with an example token map that can be found [here](reference-files/CDT/CDT-token-map.json). The tokens have been selected from [cagov.css](https://github.com/cagov/design-system/blob/main/components/combined-css/dist/cagov.css), and mapped to tokens that can be found in a simplified version of the [VIP Valet theme.json](reference-files/Valet/valet-theme.json). Taken together, this can be used to import a design system like the CDT into a WordPress site.

### Limitations

Due to a bug in the JSON dot notation library used, there are a few things to keep in mind or else your resulting JSON will not be valid:

- Use roman numerals instead of numbers if your keys are going to be numbers.
- Use camel case instead of kebab case for your keys.

## Supported Commands

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
