let multiplier = 1

const remMatcher = /(?<=\W|^)(?:\.?\d+|\d+\.\d+)rem\b/gi

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
	return {
		postcssPlugin: 'postcss-revert-rem-size',

		Rule(rule) {
			if (['html', ':root'].includes(rule.selector)) {
				for (const node of rule.nodes) {
					if (node.prop === 'font-size') {
						if (/^\d+(?:\.\d+)?%$/.test(node.value)) {
							multiplier = 100 / parseFloat(node.value)

							node.remove()
						}
					}
				}
			}

			for (const node of rule.nodes) {
				node.value = node.value?.replace(remMatcher, (x) => {
					const raw = multiplier * parseFloat(x)
					const rounded = parseFloat(raw.toFixed(3))

					return `${rounded}rem`
				})
			}
		},
	}
}

module.exports.postcss = true
