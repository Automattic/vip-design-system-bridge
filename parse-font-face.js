const utility = require('./src/utility');

async function doIt() {
    let outString = `"fontFamilies": 
    [
        {
            "fontFamily": "Public Sans",
            "name": "Public Sans",
            "slug": "public-sans",
            "fontFace": [`
    const css = await utility.getTokensFromPath("./reference-files/CDT/cdt-styles.css")
    css.stylesheet.rules.forEach(rule => {
        if (rule.type === "font-face") {
            const fontFamily = rule.declarations.find(decl => decl.property === "font-family")
            const fontStyle = rule.declarations.find(decl => decl.property === "font-style")
            const fontWeight = rule.declarations.find(decl => decl.property === "font-weight")
            const unicodeRange = rule.declarations.find(decl => decl.property === "unicode-range")

            const src = rule.declarations.find(decl => decl.property === "src")
            const regex = /url\("([\/|\w|\.|-]+)"\)/;
            const m = regex.exec(src.value)



            // we didn't find a family or a source so nothing to do
            if (!fontFamily || !m[1]) return;
            outString += `
                {
                    "fontFamily": ${fontFamily.value},
                    "fontStretch": "normal",
                    "fontStyle": "${fontStyle.value || normal}",
                    "fontWeight": "${fontWeight.value || 400}",
                    ${unicodeRange ? `"unicodeRange": "${unicodeRange.value}",` : ""}
                    "src": [
                        "file:./assets${m[1]}"
                    ]
                },`
        }
    })
    // Remove the training comma to make JSON happy
    outString = outString.slice(0, -1)
    outString += `
            ]
        }
    ]`
    console.log(outString)
}

doIt()
