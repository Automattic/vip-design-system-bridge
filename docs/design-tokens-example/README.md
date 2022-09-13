## Token Walkthrough

This tutorial will use an [example design system in Figma][example-figma-document] and document the steps to:

1. Setup the [Figma Tokens plugin][figma-tokens-plugin] to manage design tokens.
2. Get a copy of the [example design system document][example-figma-document].
3. Connect Figma Tokens to an [example set of design tokens][example-tokens].
4. Change a design token to a new value and export using Figma Tokens.
5. Run the `ingest-tokens` script to generate WordPress `theme.json` custom styles.
6. View the result of `theme.json` changes.

### 1. Install Figma Tokens

While logged in to Figma, go to open the [Figma Tokens plugin page][figma-tokens-plugin] and click "Try it out" on the top right corner. Once installed, the plugin will be available to use for the next steps.

### Get a copy of the design system document

1. Open the [example design system document][example-figma-document]. You'll need to make a local copy of this document to use Figma Tokens.

2. Click the down arrow on the right side of the document title and select "Duplicate to your drafts":

    ![Duplicate to your drafts menu option][gif-duplicate-to-drafts]

3. In the pop-up on the bottom of the page, click the "Open" button:

    ![File duplicated to your Drafts pop-up][image-open-duplicate]

    The example design system file will also be available in your Figma drafts.

### Connect Figma Tokens to design tokens

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

5. In the top bar, click the "Tokens" tab to return to all tokens. Using the checkboxes on the right, select the "global", "material-3-color", and "material-3-text" token sets. You should be able to see type and color design tokens within Figma Tokens:

    ![Select token set checkboxes][gif-figma-token-sets]

Note: A URL token storage was used for simplicity in this tutorial. In a real design system document, these tokens should use a versioned token storage system like "GitHub" or "GitLab".

### Update a design token and export

WIP: Change a background color token to a new color, see it update in Figma, and then save the new set of tokens locally.

### Generate a new `theme.json` from tokens using `wp-theme-token-transformer`

WIP: Give instructions to use `wp-theme-token-transformer` and necessary command-line options to generate a theme.json. A nearly-empty example theme should be provided for testing.

### View the result of the `theme.json` changes

WIP: Use `wp-env` to quickly spin up the theme, and see the resulting design change.

[example-figma-document]: https://www.figma.com/file/5NZf8UfaZCPhcZRTjpRfmX/Material-3-Design-Kit---Figma-Tokens-Example?node-id=49823%3A12142
[example-tokens-raw]: https://gist.githubusercontent.com/alecgeatches/d9831e259c06a132e7c7ab9cb52e9454/raw/223b6559f1bd4574bb76115d67996ea1612fe1db/tokens.json
[example-tokens]: https://gist.github.com/alecgeatches/d9831e259c06a132e7c7ab9cb52e9454
[figma-tokens-plugin]: https://www.figma.com/community/plugin/843461159747178978
[gif-duplicate-to-drafts]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/duplicate-to-drafts.gif
[gif-figma-token-sets]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/figma-token-sets.gif
[image-figma-tokens-empty]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/figma-tokens-empty.png
[image-figma-tokens-settings-url]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/figma-tokens-settings-url.png
[image-open-duplicate]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/duplicated-document-open.png
[image-open-figma-tokens]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/open-figma-tokens.png
[image-figma-url-credentials]: /../add/example-token-walkthrough/docs/design-tokens-example/assets/figma-url-credentials.png
