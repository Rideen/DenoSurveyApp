import { Application } from './deps.ts';
import { staticFileMiddleware } from "./middlewares/staticFileMiddleware.ts";
import router from './router.ts';

//  denon run --allow-net --allow-read --allow-write --allow-env --allow-plugin --unstable server.ts

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods()); 
app.use(staticFileMiddleware);

app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.log(`Listening on ${secure ? 'https://' : 'http://'}${hostname || "localhost"}:${port}`)
});

app.addEventListener('error', e => {
  console.log(e.error);
});

await app.listen({ port: 8000 });