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

// force chalk to output ANSI colors
const npm = spawn('node', ['./colors'], {
  env: { ...process.env, FORCE_COLOR: '2' },
  cwd: process.cwd(),
})

npm.stdout.setEncoding('utf8')
npm.stdout.on('end', () => {
  // console.log('npm stdout ended, html is')
  // console.log(html)

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
htmlStream(npm.stdout)
