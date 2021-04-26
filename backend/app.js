import Router from 'https://jspm.dev/cloudworker-router'

const router = new Router()

const mediaPath = Deno.env.get('PUBLIC_ASSET_PATH')+'/public'
const manifest = JSON.parse(await (await fetch(mediaPath + '/manifest.json')).text())

const manifestEntries = []

for (const [key, value] of Object.entries(manifest)) {
  manifestEntries.push(value.file)
}

router.get('/', (ctx) => {
  ctx.body = `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${
        Deno.env.get('ENVIRONMENT') == 'development' ? `
          <script type="module" src="http://localhost:3000/@vite/client"></script>
          <script type="module" src="http://localhost:3000/frontend/app.js"></script>
        ` : `
          <script type="module" src="/${ manifest['frontend/app.js']['file'] }"></script>
        `
      }
      <title>Deno Deploy Todos</title>
    </head>
    <body>
      <div id="app"></div>
      ${Deno.env.get('ENVIRONMENT')}
    </body>
  </html>
  `
  ctx.response.headers = {
    'content-type': 'text/html'
  }
  ctx.status = 200
})

router.get('/:wildcard*', async (ctx) => {
  if (manifestEntries.includes(ctx.params.wildcard)) {
    ctx.body = await (await fetch(mediaPath + '/' + ctx.params.wildcard)).text()
    ctx.response.headers = {
      'content-type': 'application/javascript'
    }
    ctx.status = 200
  }
})

addEventListener("fetch", (event) => {
  event.respondWith(router.resolve(event));
});