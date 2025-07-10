import { $ } from "bun"
import { join } from "path"

export const typegen = async (entrypoint: string, destination: string) => {
  const isTTY = process.stdout.isTTY
  if (isTTY) {
    let spinnerActive = true
    const spinnerFrames = ["|", "/", "-", "\\"]
    let spinnerIndex = 0
    process.stdout.write("   ")
    const spinner = setInterval(() => {
      process.stdout.write(`\r${spinnerFrames[spinnerIndex++ % spinnerFrames.length]}  Генерация типов...`)
    }, 120)

    await $`dts-bundle-generator --out-file ${destination} --export-referenced-types false ${entrypoint}`.quiet()

    spinnerActive = false
    clearInterval(spinner)
    process.stdout.write("\r✅ Типы успешно сгенерированы!           \n")
  } else {
    console.log("🛠️  Генерация типов...")
    await $`dts-bundle-generator --out-file ${destination} --export-referenced-types false ${entrypoint}`.quiet()
    console.log("✅ Типы успешно сгенерированы!")
  }
}

if (import.meta.main) {
  const outDir = "../metafor/package/context"
  const entrypoint = "./context.ts"
  const destination = join(outDir, "context.d.ts")
  
  await typegen(entrypoint, destination)
}
