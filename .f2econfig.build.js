// @ts-check

/**
 * @type {import('f2e-server').F2EConfig}
 */
const config = {
    build: true,
    buildFilter: pathname => /^(asserts|css|index|src|$)/.test(pathname),
    outputFilter: pathname => /^(asserts|css|index|static|$)/.test(pathname),
    middlewares: [
        { middleware: 'template', test: /\.html?/ },
        { middleware: 'esbuild' },
    ],
    output: require('path').join(__dirname, './docs'),
}
module.exports = config