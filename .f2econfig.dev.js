// @ts-check

/**
 * @type {import('f2e-server').F2EConfig}
 */
const config = {
    livereload: true,
    gzip: true,
    buildFilter: pathname => /^(asserts|css|index|src|$)/.test(pathname),
    middlewares: [
        { middleware: 'template', test: /\.html?/ },
        { middleware: 'esbuild' },
    ],
}
module.exports = config