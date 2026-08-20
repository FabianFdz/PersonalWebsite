import { sites } from "@openai/sites-vite-plugin";
import { nitro } from "nitro/vite";
import vinext from "vinext";
import { defineConfig, type PluginOption } from "vite";

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
};

function isVercelBuild(): boolean {
  return process.env.VERCEL === "1" || process.env.NITRO_PRESET === "vercel";
}

async function createDeploymentPlugins(): Promise<PluginOption[]> {
  if (isVercelBuild()) {
    return nitro({ preset: "vercel" });
  }

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return [
    sites(),
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
      config: localBindingConfig,
    }),
  ];
}

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  const deploymentPlugins = await createDeploymentPlugins();

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [vinext(), ...deploymentPlugins],
  };
});
