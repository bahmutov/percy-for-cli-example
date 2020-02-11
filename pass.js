#!/usr/bin/env node

// generates HTML page from streamed STDOUT
// $ FORCE_COLOR=2 npx mocha spec.js --reporter spec | ./pass.js
// save or redirect the generated HTML file and get yourself a nice page.

// assuming the browser page is white
const options = {
  newline: true,
  bg: '#fff',
  fg: '#111',
}
const convert = new (require('ansi-to-html'))(options)

const start =
  `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
    </head>
    <body>\n
  `

console.log(start)
process.stdin.setEncoding('utf8')
process.stdin.on('data', function(chunk) {
  return process.stdout.write(convert.toHtml(chunk))
  // html += convert.toHtml(chunk)
})
process.stdin.on('end', () => {
  console.log('\n</body></html>')
})
