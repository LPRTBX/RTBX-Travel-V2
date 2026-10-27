import { createTravelServer } from "./app.mjs";

const port = Number(process.env.PORT || 5000);
const server = createTravelServer();
server.listen(port, "0.0.0.0", () => {
  // Confirms in the workflow console that the access-checking server, not a Vite dev server, owns the preview port.
  process.stdout.write(`JALDO Travel access-checking server listening on port ${port}.\n`);
});
// No request bodies, access codes, cookies or session IDs are logged.
server.on("error", error => {
  process.stderr.write(error?.code === "EADDRINUSE"
    ? `Travel server could not start: port ${port} is already in use. Another process (often a stale Vite dev server) is answering the preview. Stop it, then restart the Travel workflow.\n`
    : "Travel server could not start.\n");
  process.exitCode = 1;
});
const stop = () => server.close(() => process.exit(0));
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
