var spawn = require('child_process').spawn,
  ansi = require('ansi-html-stream'),
  fs = require('fs')

var npm = spawn('node', ['./colors'], {
  cwd: process.cwd(),
})

var stream = ansi({ chunked: false }),
  file = fs.createWriteStream('browserify.html', 'utf8')

npm.stdout.pipe(stream)
npm.stderr.pipe(stream)

stream.pipe(
  file,
  { end: false },
)

stream.once('end', function() {
  file.end('</pre>\n')
})

file.write('<pre>\n')
