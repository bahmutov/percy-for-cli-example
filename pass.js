#!/usr/bin/env node

// generates HTML page from streamed STDOUT
// $ FORCE_COLOR=2 npx mocha spec.js --reporter spec | ./pass.js
// save or redirect the generated HTML file and get yourself a nice page.

// assuming the browser page is white
const options = {
  newline: false,
  bg: '#fff',
  fg: '#111',
}
const convert = new (require('ansi-to-html'))(options)
const escape = require('escape-html')

const start =
  `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body {
          font-family: "Courier New", Courier, monospace;
          padding: 0 1em;
          line-height: 1.4;
        }
        pre {
          padding: 0 0;
          margin: 0 0;
          font-family: "Courier New", Courier, monospace;
        }
      </style>
    </head>
    <body><pre>\n
  `

console.log(start)

process.stdin.setEncoding('utf8')
process.stdin.on('data', function(chunk) {
  return process.stdout.write(convert.toHtml(escape(chunk)))
})
process.stdin.on('end', () => {
  console.log('\n</pre></body></html>')
})
