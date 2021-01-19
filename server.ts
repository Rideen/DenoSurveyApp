import { Application } from './deps.ts';
import router from './router.ts';

//  denon run --allow-net --allow-read --allow-write --allow-env --allow-plugin --unstable server.ts

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.log(`Listening on ${secure ? 'https://' : 'http://'}${hostname || "localhost"}:${port}`)
});

await app.listen({ port: 8000 });