const result = await Bun.build({
  entrypoints: ["./context.ts"],
  outdir: "./dist",
  target: "browser",
  format: "esm",
  sourcemap: "none",
  splitting: true,
  minify: true,
})

console.log(result.success ? "Build success" : "Build failed")
