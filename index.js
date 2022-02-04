let multiplier = 1

const remMatcher = /(?<=\W|^)(?:\.?\d+|\d+\.\d+)rem\b/gi

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
	return {
		postcssPlugin: 'postcss-revert-rem-size',

		Root(root) {
			root.walkRules((rule) => {
				if (['html', ':root'].includes(rule.selector)) {
					rule.walk((node) => {
						if (node.prop === 'font-size') {
							if (/^\d+(?:\.\d+)?%$/.test(node.value)) {
								multiplier = 1 / (100 / parseFloat(node.value))

								node.remove()
							}
						}
					})
				}
			})

			root.walkRules((rule) => {
				rule.walk((node) => {
					node.value = node.value?.replace(remMatcher, (x) => {
						const raw = multiplier * parseFloat(x)
						const rounded = parseFloat(raw.toFixed(5))

						return `${rounded}rem`
					})
				})
			})
		},
	}
}

module.exports.postcss = true
