## Token Walkthrough

This tutorial will use an [example design system in Figma][example-figma-document] and document the steps to:

1. Setup tools.
2. Get a copy of the [example design system in Figma][example-figma-document].
3. Connect Figma Tokens to an [example set of design tokens][example-tokens].
4. Change a design token to a new value and export using Figma Tokens.
5. Use the `ingest-tokens` script to generate update a WordPress theme and view the results.

### 1. Setup tools

1. While logged in to Figma, go to open the [Figma Tokens plugin page][figma-tokens-plugin] and click "Try it out" on the top right corner. Once installed, the plugin will be available to use for the next steps.

2. Download or clone a copy of the [`wp-theme-token-transformer` repository][repository-link].

3. Install the [`wp-env` tool][wp-env-documentation]:

    ```bash
    $ npm -g install @wordpress/env
    ```

### 2. Get a copy of the design system

1. Open the [example design system document][example-figma-document]. You'll need to make a local copy of this document to use Figma Tokens.

2. Click the down arrow on the right side of the document title and select "Duplicate to your drafts":

    ![Duplicate to your drafts menu option][gif-duplicate-to-drafts]

3. In the pop-up on the bottom of the page, click the "Open" button:

    ![File duplicated to your Drafts pop-up][image-open-duplicate]

    The example design system file will also be available in your Figma drafts.

### 3. Connect Figma Tokens to design tokens

We've created a set of design tokens that are ready to be imported into the design system document using Figma Tokens.

1. With the example draft Figma document from the previous steps open, click the Main Menu button in the top left and select Plugins -> Figma Tokens.

    ![Figma Tokens plugin launch via menu][image-open-figma-tokens]

2. After Figma Tokens launches, select the "Get Started" button. You should see an empty set of tokens on the next page:

    ![Empty Figma Tokens plugin page][image-figma-tokens-empty]

3. On the top of the plugin box, click the "Settings" button, and then click the "URL" button under "Token Storage":

    ![Figma URL Token Storage settings section][image-figma-tokens-settings-url]

4. Click the "Add new credentials" button. In the "Name" field, enter any name (e.g. `Example Tokens`). In the URL box, enter this URL:

    ```
    https://gist.githubusercontent.com/alecgeatches/d9831e259c06a132e7c7ab9cb52e9454/raw/223b6559f1bd4574bb76115d67996ea1612fe1db/tokens.json
    ```

    The result should look something like this:

    ![Figma URL Token Storage settings filled][image-figma-url-credentials]

    Click the "Save" button.

5. Temporary workaround for URL sync values (https://github.com/six7/figma-tokens/issues/1279):

    1. Under "Token Storage" click the "Local document" button.
    2. In the confirmation pop-up, click "Yes, set to local."
    3. Refresh the page.
    4. Re-open Figma Tokens.

6. In Figma Tokens, click the "Tokens" tab to return to all tokens. Using the checkboxes on the right, select the "global", "material-3-color", and "material-3-text" token sets. You should be able to see type and color design tokens within Figma Tokens:

    ![Select token set checkboxes][gif-figma-token-sets]

Note: A URL token storage was used for simplicity in this tutorial. In a real design system document, steps 3-6 can be skipped and a [versioned token storage system like "GitHub"][figma-tokens-docs-github] or "GitLab" should be used instead.

### 4. Change a design token and export

In this step, change the default background color to a new red tone, and export the changed tokens.

1. In Figma Tokens, select the "material-3-color" color set. Next, under "Light Theme" in the Figma document, select "Background" and see that the matching design token is selected in Figma Tokens:

    ![Select background color in Figma][gif-select-background-token]

2. In Figma Tokens, right click on the background color token and select "Edit Token". Change the color value to `{color.error.70}` or another tonal palette color and click "Update".

    ![Change background color design token in Figma][gif-change-background-token]

    As seen above, the Light Theme -> Background color should change to match the new color token.

3. In the lower left of the Figma Tokens plugin, click the "Export" button. Check "All token sets", then go to the bottom of the dialog and click the "Export" button.

    ![Figma Tokens export options][image-figma-tokens-export]

    This should download a file named `tokens.json`.

Note: When using [versioned token storage system like "GitHub"][figma-tokens-docs-github], token changes can be directly pushed to a repository branch instead of downloading locally.

### 5. Update a WordPress theme with new tokens and see the result

1. Ensure [`wp-env` is installed][wp-env-documentation] and a copy of the [`wp-theme-token-transformer` repository][repository-link] is downloaded locally.
2. In the `wp-theme-token-transformer` repository folder, run these commands to spin up a local WordPress website:

    ```bask
    cd docs/design-tokens-example
    wp-env start && wp-env run cli "wp theme activate token-theme"
    ```

    These commands should show a result like this:

    ```bash
    #
    ```

3. Visit http://localhost:8888. You should see a basic WordPress theme using the Material UI theme:

    ![][image-wordpress-theme-default]

4. In the following steps we'll update the theme to use the tokens that were exported from Figma. Navigate to the `wp-theme-token-transformer` repository in a terminal and install dependencies for the token processing script:

    ```bash
    npm install
    ```

5. Next, run the following command. Update `--tokenPath` to match the locally downloaded path of `tokens.json` and `--themePath` to match the example theme in this repository:

    ```bash
    node ingest-tokens.js --tokenPath=~/Downloads/tokens.json --themePath=~/wp-theme-token-transformer/docs/design-tokens-example/token-theme --sourceSet=global --layerSets=material-3-color,material-3-text --overwrite
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

6. For the final step, visit http://localhost:8888 again and refresh the page. You should be able to see that the background token was successfully updated and inserted into the theme:

    ![][image-wordpress-theme-modified]

## Updates to make to this document

- When PR is ready, update image links in this PR to point at the base branch.
- Once `--theme` is no longer a required option, add `node ingest-token` command-line parameters.
- Once repository is public:
    - In "Connect Figma Tokens to design tokens", change gist URL to use raw URL from tokens in repository.
    - Update name references to `wp-theme-token-transformer` if name changes.

---

[example-figma-document]: https://www.figma.com/file/5NZf8UfaZCPhcZRTjpRfmX/Material-3-Design-Kit---Figma-Tokens-Example?node-id=49823%3A12142
[example-tokens-raw]: https://gist.githubusercontent.com/alecgeatches/d9831e259c06a132e7c7ab9cb52e9454/raw/5cbe4d2796341b6c29acdf7a135f571fc6674cda/tokens.json
[example-tokens]: https://gist.github.com/alecgeatches/d9831e259c06a132e7c7ab9cb52e9454
[figma-tokens-docs-github]: https://docs.figmatokens.com/sync/github
[figma-tokens-plugin]: https://www.figma.com/community/plugin/843461159747178978
[gif-change-background-token]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/change-background-token.gif
[gif-duplicate-to-drafts]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/duplicate-to-drafts.gif
[gif-figma-token-sets]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/figma-token-sets.gif
[gif-select-background-token]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/select-background-token.gif
[image-figma-tokens-empty]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/figma-tokens-empty.png
[image-figma-tokens-export]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/figma-tokens-export.png
[image-figma-tokens-settings-url]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/figma-tokens-settings-url.png
[image-figma-url-credentials]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/figma-url-credentials.png
[image-open-duplicate]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/duplicated-document-open.png
[image-open-figma-tokens]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/open-figma-tokens.png
[repository-link]: https://github.com/Automattic/wp-theme-token-transformer
[wp-env-documentation]: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/
