const spawn = require('child_process').spawn
// assuming the browser page is white
const options = {
  newline: true,
  bg: '#fff',
  fg: '#111',
}
const convert = new (require('ansi-to-html'))(options)

const htmlStream = function htmlStream(stream) {
  return stream.on('data', function(chunk) {
    return process.stdout.write(convert.toHtml(chunk))
  })
}

// force chalk to output ANSI colors
const npm = spawn('node', ['./colors'], {
  env: { ...process.env, FORCE_COLOR: '2' },
  cwd: process.cwd(),
})

npm.stdout.setEncoding('utf8')
htmlStream(npm.stdout)
