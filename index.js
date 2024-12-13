const remMatcher = /(?<=\W|^)(?:\.?\d+|\d+\.\d+)rem\b/gi
const ignoreMatcher = /("[^"]+"|url\([^)]+\))/

const defaultOptions = { percent: null, maxDecimalPlaces: 5 }

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
	opts = { ...defaultOptions, ...opts }

	const multiplierOverridden = opts.percent != null

	return {
		postcssPlugin: 'postcss-revert-rem-size',

		Root(root) {
			root.walkRules((rule) => {
				if (['html', ':root'].includes(rule.selector)) {
					rule.walk((node) => {
						if (node.prop === 'font-size') {
							if (/^\d+(?:\.\d+)?%$/.test(node.value)) {
								if (multiplierOverridden) {
									const val = parseFloat(node.value)
									if (val !== opts.percent) {
										throw new Error(
											`root-node font-size value ${val}% does not match ${opts.percent}% supplied in options`,
										)
									}
								} else {
									opts.percent = parseFloat(node.value)
								}

								node.remove()
							}
						}
					})
				}
			})

			if (opts.percent == null) {
				throw new Error(
					`root-node font size not found and no opts.percent override supplied`,
				)
			}

			const multiplier = opts.percent / 100

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
