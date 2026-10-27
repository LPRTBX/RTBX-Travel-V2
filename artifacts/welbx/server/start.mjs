import { createTravelServer } from "./app.mjs";

const server = createTravelServer();
server.listen(Number(process.env.PORT || 5000), "0.0.0.0");
// No request bodies, access codes, cookies or session IDs are logged.
server.on("error", () => { process.stderr.write("Travel server could not start.\n"); process.exitCode = 1; });
const stop = () => server.close(() => process.exit(0));
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
