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
		font-size: 62.5%;
	}

	h1 {
		font-size: 3.2rem;
	}
	`

	const to = `
	:root {
	}

	h1 {
		font-size: 2rem;
	}
	`

	await run(from, to, {})
})

it('works for variables defined before root font-size', async () => {
	const from = `
	:root {
		--var-1: 3.2rem;
	}

	:root {
		--var-2: 16rem;
		font-size: 62.5%;
	}
	`

	const to = `
	:root {
		--var-1: 2rem;
	}

	:root {
		--var-2: 10rem;
	}
	`

	await run(from, to, {})
})

it('works inside calc()', async () => {
	const from = `
	:root {
		font-size: 62.5%;
	}

	h1 {
		margin-block: calc(10px - 0.1rem);
	}
	`

	const to = `
	:root {
	}

	h1 {
		margin-block: calc(10px - 0.0625rem);
	}
	`

	await run(from, to, {})
})

it('works with multiple values in a single property', async () => {
	const from = `
	:root {
		font-size: 62.5%;
	}

	button {
		padding: 1px .2em .16rem 0;
		border-radius: 1.6rem 3.2rem;
	}
	`

	const to = `
	:root {
	}

	button {
		padding: 1px .2em 0.1rem 0;
		border-radius: 1rem 2rem;
	}
	`

	await run(from, to, {})
})

it('works with custom decimal places', async () => {
	const from = `
	:root {
		font-size: 62.5%;
	}

	div {
		padding: 0.1rem;
	}
	`

	const to = `
	:root {
	}

	div {
		padding: 0.06rem;
	}
	`

	await run(from, to, { maxDecimalPlaces: 2 })
})

it('ignores `{digit}rem` in a URL', async () => {
	const from = `
	:root {
		font-size: 62.5%;
	}

	div {
		background: url(https://example.com/5rem.html)
	}
	`

	const to = `
	:root {
	}

	div {
		background: url(https://example.com/5rem.html)
	}
	`

	await run(from, to, {})
})

it('ignores `{digit}rem` in quoted props', async () => {
	const from = `
	:root {
		font-size: 62.5%;
	}

	button::before {
		font-family: "Foo 5rem Bar" sans-serif;
		content: "5rem";
	}
	`

	const to = `
	:root {
	}

	button::before {
		font-family: "Foo 5rem Bar" sans-serif;
		content: "5rem";
	}
	`

	await run(from, to, {})
})
