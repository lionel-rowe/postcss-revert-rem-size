let multiplier = 1

const remMatcher = /(?<=\W|^)(?:\.?\d+|\d+\.\d+)rem\b/gi
const ignoreMatcher = /("[^"]+"|url\([^)]+\))/

const defaultOptions = { maxDecimalPlaces: 5 }

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
	opts = { ...defaultOptions, ...opts }

	return {
		postcssPlugin: 'postcss-revert-rem-size',

		Root(root) {
			root.walkRules((rule) => {
				if (['html', ':root'].includes(rule.selector)) {
					rule.walk((node) => {
						if (node.prop === 'font-size') {
							if (/^\d+(?:\.\d+)?%$/.test(node.value)) {
								multiplier = parseFloat(node.value) / 100

								node.remove()
							}
						}
					})
				}
			})

			root.walkRules((rule) => {
				rule.walk((node) => {
					if (node.type === 'decl') {
						node.value = node.value
							.split(ignoreMatcher)
							.map((segment, i) =>
								i % 2
									? segment
									: segment.replace(remMatcher, (x) => {
											const raw =
												multiplier * parseFloat(x)
											const rounded = parseFloat(
												raw.toFixed(
													opts.maxDecimalPlaces,
												),
											)

											return `${rounded}rem`
									  }),
							)
							.join('')
					}
				})
			})
		},
	}
}

module.exports.postcss = true
