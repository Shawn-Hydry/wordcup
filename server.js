const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = 8080

http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/preview.html' : req.url
  const ext = path.extname(filePath)
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' }
  res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' })
  fs.createReadStream(path.join(__dirname, filePath.slice(1))).pipe(res)
}).listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT + '/')
})