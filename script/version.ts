import { join } from "node:path"
import { readFile, writeFile } from "node:fs/promises"

/**
 * Обновляет patch-версию в package.json в указанной директории.
 * @param path Путь к директории с package.json
 */
export const updateVersion = async (path: string) => {
  const packageJson = JSON.parse(await readFile(join(path, "package.json"), "utf-8"))
  console.log(`📝 Текущая версия: ${packageJson.version}`)

  const version = packageJson.version.split(".").map(Number)
  version[2]++
  packageJson.version = version.join(".")

  console.log(`🚀 Новая версия: ${packageJson.version}`)
  await writeFile(join(path, "package.json"), JSON.stringify(packageJson, null, 2))
}

if (import.meta.main) {
  await updateVersion(process.cwd())
}