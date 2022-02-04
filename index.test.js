const postcss = require('postcss')
const plugin = require('./')

// ignore empty lines and whitespace at start of lines
const ignoreWhiteSpace = (str) => str.replace(/^\s+|^$/gm, '')

async function run(input, output, opts = {}) {
	const result = await postcss([plugin(opts)]).process(input, {
		from: undefined,
	})

	expect(ignoreWhiteSpace(result.css)).toEqual(ignoreWhiteSpace(output))
	expect(result.warnings()).toHaveLength(0)
}

it('changes rem', async () => {
	const from = `
	:root {
		--var-1: 3.2rem;
	}

	:root {
		--var-2: 16rem;
		font-size: 62.5%;
	}

	h1 {
		font-size: 3.2rem;
		margin-block: calc(10px - 0.1rem);
		padding: 1px .2em .16rem 0;
	}

	button {
		border-radius: 1.6rem 3.2rem;
		font-size: 1.6rem;
	}
	`

	const to = `
	:root {
		--var-1: 2rem;
	}

	:root {
		--var-2: 10rem;
	}

	h1 {
		font-size: 2rem;
		margin-block: calc(10px - 0.0625rem);
		padding: 1px .2em 0.1rem 0;
	}

	button {
		border-radius: 1rem 2rem;
		font-size: 1rem;
	}
	`

	await run(from, to, {})
})
