const axios = require('axios')

const spawn = require('child_process').spawn
// assuming the browser page is white
const options = {
  newline: true,
  bg: '#fff',
  fg: '#111',
}
const convert = new (require('ansi-to-html'))(options)

let html = ''

const htmlStream = function htmlStream(stream) {
  return stream.on('data', function(chunk) {
    // return process.stdout.write(convert.toHtml(chunk))
    html += convert.toHtml(chunk)
  })
}

// force child process to output ANSI colors
// if possible using FORCE_COLOR
// commonly used via https://github.com/chalk/supports-color
// const child = spawn('node', ['./colors'], {
const child = spawn(
  'node',
  ['./node_modules/.bin/mocha', './spec.js', '--reporter', 'spec'],
  {
    env: { ...process.env, FORCE_COLOR: '2' },
    cwd: process.cwd(),
  },
)

child.stdout.setEncoding('utf8')
child.on('error', console.error)
child.stdout.on('end', () => {
  html =
    `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
    ` +
    html +
    `
    </body></html>
  `
  console.log(html)
  // post HTML to the Percy agent
  // follow "cy.request" code in
  // https://github.com/percy/percy-cypress/blob/master/lib/index.ts
  // and https://github.com/percy/percy-agent
  const url = 'http://localhost:5338/percy/snapshot'
  axios
    .post(url, {
      name: 'my example name',
      url: 'http://localhost/example',
      enableJavaScript: false,
      domSnapshot: html,
    })
    .catch(e => {
      console.error(e)
      throw e
    })
})
htmlStream(child.stdout)
