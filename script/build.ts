async function build(dev: boolean) {
  const result = await Bun.build({
    entrypoints: ["./context.ts"],
    outdir: "./dist",
    target: "browser",
    format: "esm",
    sourcemap: dev ? "inline" : "none",
    splitting: false,
    minify: !dev,
  })

  console.log(result.success ? "Build success" : "Build failed")
}
if (import.meta.main) {
  if (process.argv[2] === "--dev") {
    console.log("Building in development mode")
    build(true)
  } else if (process.argv[2] === "--prod") {
    console.log("Building in production mode")
    build(false)
  } else {
    console.error("Usage: bun run build:js --dev|--prod")
    process.exit(1)
  }
}
