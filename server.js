const express = require('express')
const path = require('path');

const port = process.env.PORT || 5000

const app = express()

app.use(express.static(__dirname + '/bar/build'));
app.get('/bar', function (req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
  res.sendFile(path.join('/bar/build/index.html'), {root: __dirname });
});

app.use(express.static(__dirname + '/scatterplot/build'));
app.get('/scatterplot', function (req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
  res.sendFile(path.join('/scatterplot/build/index.html'), {root: __dirname });
});

app.use(express.static(__dirname + '/heatmap/build'));
app.get('/heatmap', function (req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
  res.sendFile(path.join('/heatmap/build/index.html'), {root: __dirname });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
