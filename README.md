# postcss-revert-rem-size

[PostCSS] plugin to remove font-size: 62.5% hack.

[postcss]: https://github.com/postcss/postcss

```css
.foo {
	/* Input example */
}
```

```css
.foo {
	/* Output example */
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-revert-rem-size
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-revert-rem-size'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
