import { defineConfig } from "vitest/config";
import { sharedAlias } from "./vite.config";
export default defineConfig({
  resolve: { alias: sharedAlias },
  define: { __CORE_PIN__: JSON.stringify({ commit: "test", contractVersion: "1.2.0" }) },
  test: { environment: "node", include: ["tests/**/*.test.ts"], root: import.meta.dirname },
});
