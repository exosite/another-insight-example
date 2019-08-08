const fs = require('fs')
const path = require('path')
const http = require('http')

const app = require('connect')()
const morgan = require('morgan')
const responseTime = require('response-time')
const swaggerTools = require('swagger-tools')
const js_yaml = require('js-yaml')
const log = require('loglevel')
log.setLevel(process.env.LOGLEVEL || log.levels.TRACE)
const serverPort = process.env.PORT || 5000

app.use(responseTime())

// app.use(morgan('combined'))
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent" ":req[x-exosite-tracking-id]"'
  )
)

// swaggerRouter configuration
const options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development', // Conditionally turn on stubs (mock mode)
}

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = fs.readFileSync(path.join(__dirname, 'api/swagger.yaml'), 'utf8')
const swaggerDoc = js_yaml.safeLoad(spec)

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, middleware => {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata())

  // Validate Swagger requests
  app.use(middleware.swaggerValidator())

  // app.use((err, req, res, next) => {
  //   res.setHeader('Content-Type', 'application/json')
  //   res.end(JSON.stringify(err))
  //   // log.error(JSON.stringify(err.results), JSON.stringify(req.body))
  //   next(err)
  // })

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options))

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi())

  // Start the server
  http.createServer(app).listen(serverPort, () => {
    console.log(
      'Your server is listening on port %d (http://localhost:%d)',
      serverPort,
      serverPort
    )
    console.log(
      'Swagger-ui is available on http://localhost:%d/docs',
      serverPort
    )
  })
})
