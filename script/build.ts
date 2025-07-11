import { typegen } from "./typegen"
import { join } from "path"

async function build(dev: boolean, distDir: string, entrypoint: string) {
  const result = await Bun.build({
    entrypoints: [entrypoint],
    outdir: distDir,
    target: "browser",
    format: "esm",
    sourcemap: dev ? "inline" : "none",
    splitting: false,
    minify: !dev,
  })

  console.log(result.success ? "Build success" : "Build failed")
}

if (import.meta.main) {
  const fileName = "context"
  const entrypoint = `./${fileName}.ts`
  const distDir = "./dist"
  const typeDest = join(distDir, `${fileName}.d.ts`)

  switch (process.argv[2]) {
    case "--dev":
      console.log("Building in development mode")
      console.log("Building js")
      await build(true, distDir, entrypoint)
      break
    case "--prod":
      console.log("Building in production mode")
      await build(false, distDir, entrypoint)
      break
    default:
      console.error("Usage: bun run build:js --dev|--prod")
      process.exit(1)
  }
  console.log("Building types")
  await typegen(entrypoint, typeDest)
}
