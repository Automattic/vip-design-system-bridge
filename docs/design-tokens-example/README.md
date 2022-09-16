# Token Walkthrough

This tutorial will demonstrate how to connect a design system in Figma with WordPress, using the Figma Tokens plugin. We'll cover the steps to:

1. Make a copy of an [example design system][example-figma-document].
2. Use the [Figma Tokens plugin][figma-tokens-plugin] to add design tokens.
3. Change a background color token to a new value and export.
4. Run a local copy of WordPress [with `wp-env`][wp-env-documentation] to view an example WordPress theme.
5. Use a script to update the WordPress theme with new design tokens.

These resources are included:

- A simplified [design document system in Figma][example-figma-document] based on the [Material 3 Design Kit][figma-material-3-design-kit] template.
- [Premade design tokens][example-tokens] used by Figma Tokens
- An [example WordPress theme][repository-example-theme] designed to use the colors and fonts provided by the design system

## Setup tools

1. While logged in to Figma, go to open the [Figma Tokens plugin page][figma-tokens-plugin]. In the top right corner, click the "Try it out" button. Once installed, the plugin will be available to use for the next steps.

2. Download or clone a copy of the [`wp-theme-token-transformer` repository][repository-link] on your computer.

3. To run the example WordPress theme and view token changes, install the [`wp-env` terminal tool][wp-env-documentation]:

    ```bash
    $ npm -g install @wordpress/env
    ```

    Note you may also need to install [Node.js][install-node] and [Docker][install-docker] as prerequisites for `wp-env`.

## 1. Get a copy of the design system

1. Open the [example Figma design system][example-figma-document]. We'll need make a local duplicate of this document to use Figma Tokens.

2. On the right side of the document title, click the down arrow and select "Duplicate to your drafts":

    ![Duplicate to your drafts menu option][gif-duplicate-to-drafts]

3. In the pop-up on the bottom of the page, click the "Open" button:

    ![File duplicated to your Drafts pop-up][image-open-duplicate]

    The duplicated design system document can also be found in your Figma drafts.

## 2. Connect Figma Tokens to design tokens

We've created a set of design tokens that are ready to be imported into the design system document using Figma Tokens.

1. Open the example Figma document from the previous step. On the top left of the page, click the main menu button and select Plugins -> Figma Tokens.

    ![Figma Tokens plugin launch via menu][image-open-figma-tokens]

    If the plugin is not available, install via the [Figma Tokens plugin page][figma-tokens-plugin].

2. After Figma Tokens launches, select the "Get Started" button. You should see an empty set of tokens on the next page:

    ![Empty Figma Tokens plugin page][image-figma-tokens-empty]

3. At the top of the plugin, click the "Settings" tab. Under the "Token Storage" section, click the "URL" button:

    ![Figma URL Token Storage settings section][image-figma-tokens-settings-url]

4. Click the "Add new credentials" button. In the "Name" field, enter any name (e.g. `Example Tokens`). In the URL box, enter this URL:

    ```
    https://gist.githubusercontent.com/alecgeatches/d9831e259c06a132e7c7ab9cb52e9454/raw/223b6559f1bd4574bb76115d67996ea1612fe1db/tokens.json
    ```

    The result should look something like this:

    ![Figma URL Token Storage settings filled][image-figma-url-credentials]

    Click the "Save" button.

5. Temporary workaround to allow local edits to tokens from URL (https://github.com/six7/figma-tokens/issues/1279):

    1. Under "Token Storage" click the "Local document" button.
    2. In the confirmation pop-up, click "Yes, set to local".
    3. Refresh the page.
    4. Re-open Figma Tokens via the plugin menu.

6. In Figma Tokens, click the "Tokens" tab to return to all tokens. Using the checkboxes on the right, select the "global", "material-3-color", and "material-3-text" token sets. You should now be able to view type and color design tokens in the main panel:

    ![Select token set checkboxes][gif-figma-token-sets]

> **Note**
> This tutorial uses URL token storage for easier setup.
> In a real design system document, a [versioned token storage system like "GitHub"][figma-tokens-docs-github] or "GitLab" should be used instead. These allow tokens to be directly pulled and published to a repository from Figma.

## 3. Change a design token and export

This section will cover changing the design system token for the background to a new color, and exporting the updated tokens.

1. In Figma Tokens, select the "material-3-color" color set. Next, in the Figma document under the "Light Theme" section, click the "Background" block and see that the matching design token is selected in Figma Tokens:

    ![Select background color in Figma][gif-select-background-token]

2. In Figma Tokens, right click on the background color token and select "Edit Token". Change the value to this reference (or another tonal color token):

    ```
    {color.error.70}
    ```

    and click "Update":

    ![Change background color design token in Figma][gif-change-background-token]

    As shown above, the light theme background color block should change to match the new color token.

3. In the lower left of the Figma Tokens plugin, click the "Export" button. Check "All token sets", then go to the bottom of the dialog and click the "Export" button.

    ![Figma Tokens export options][image-figma-tokens-export]

    This will download a file named `tokens.json`.

> **Note**
> When using [versioned token storage system like "GitHub"][figma-tokens-docs-github], token changes can be directly pushed to a repository branch instead of downloading via the browser.

## 4. Run a local copy of WordPress

To see the design tokens applied, we'll start by running WordPress locally:

1. Ensure [`wp-env` is installed][wp-env-documentation] and a copy of the [`wp-theme-token-transformer` repository][repository-link] is downloaded locally.
2. In the `wp-theme-token-transformer` repository folder, run these commands to spin up a local WordPress website:

    ```bask
    cd docs/design-tokens-example
    wp-env start && wp-env run cli "wp theme activate token-theme"
    ```

    You should see a result like this:

    ![Starting wp-env in terminal][gif-start-theme-terminal]

3. Visit the WordPress instance http://localhost:8888. You should see a basic WordPress theme using the Material 3 UI theme:

    ![WordPress with default Material UI 3 theme][image-wordpress-theme-default]

## 5. Use tokens to update a WordPress theme

In the following steps we'll update the theme to use the tokens that were exported from Figma:

1. Navigate to the `wp-theme-token-transformer` repository in a terminal and install dependencies for the token processing script:

    ```bash
    cd wp-theme-token-transformer/
    npm install
    ```

2. Next, run the following command. Update `--tokenPath` to match the locally downloaded path of `tokens.json`:

    ```bash
    node ingest-tokens.js --tokenPath=~/Downloads/tokens.json --themePath=./docs/design-tokens-example/token-theme --sourceSet=global --layerSets=material-3-color,material-3-text --overwrite
    ```

    When the command above is run, it should produce output like this:

    ```bash
    Using source and layer sets for tokens (source: global, layers: material-3-color, material-3-text)
    ✔︎ Processed with token-transformer

    wordpress-theme-json
    ✔︎ src/build/tokens.json

    ✔︎ Processed with Style Dictionary
    ✔︎ Wrote theme file: ~/wp-theme-token-transformer/docs/design-tokens-example/token-theme/theme.json
    ```

3. For the final step, visit http://localhost:8888 or refresh the page. You should see that the background color has changed to the new token value and was inserted into the theme:

    ![WordPress with red background from tokens][image-wordpress-theme-modified]

## Updates to make to this document

- When PR is ready, update image links in this PR to point at the base branch.
- Once repository is public:
    - In "Connect Figma Tokens to design tokens", change gist URL to use raw URL from tokens in repository.
    - Update name references to `wp-theme-token-transformer` if name changes.
- Once [Figma Tokens v120][https://github.com/six7/figma-tokens/pull/1208] is released which [fixes this issue](https://github.com/six7/figma-tokens/issues/1164), simplify `ingest-tokens.js` command to use a theme?

---

[example-figma-document]: https://www.figma.com/file/5NZf8UfaZCPhcZRTjpRfmX/Material-3-Design-Kit---Figma-Tokens-Example
[example-tokens-raw]: https://gist.githubusercontent.com/alecgeatches/d9831e259c06a132e7c7ab9cb52e9454/raw/5cbe4d2796341b6c29acdf7a135f571fc6674cda/tokens.json
[example-tokens]: https://gist.github.com/alecgeatches/d9831e259c06a132e7c7ab9cb52e9454
[figma-material-3-design-kit]: https://www.figma.com/community/file/1035203688168086460
[figma-tokens-docs-github]: https://docs.figmatokens.com/sync/github
[figma-tokens-plugin]: https://www.figma.com/community/plugin/843461159747178978
[gif-change-background-token]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/change-background-token.gif
[gif-duplicate-to-drafts]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/duplicate-to-drafts.gif
[gif-figma-token-sets]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/figma-token-sets.gif
[gif-select-background-token]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/select-background-token.gif
[gif-start-theme-terminal]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/start-theme-terminal.gif
[image-figma-tokens-empty]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/figma-tokens-empty.png
[image-figma-tokens-export]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/figma-tokens-export.png
[image-figma-tokens-settings-url]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/figma-tokens-settings-url.png
[image-figma-url-credentials]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/figma-url-credentials.png
[image-open-duplicate]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/duplicated-document-open.png
[image-open-figma-tokens]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/open-figma-tokens.png
[image-wordpress-theme-default]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/wordpress-theme-default.png
[image-wordpress-theme-modified]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/wordpress-theme-modified.png
[install-docker]: https://docs.docker.com/get-docker/
[install-node]: https://nodejs.org/en/download/
[repository-example-theme]: https://github.com/Automattic/wp-theme-token-transformer/tree/trunk/docs/design-tokens-example/token-theme
[repository-link]: https://github.com/Automattic/wp-theme-token-transformer
[wp-env-documentation]: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/