import { type } from 'clipcc-extension'
import path from 'node:path'
const J = path.posix.join

export const config = new class {
    // 复制LICENSE文件
    copyLicense: boolean = true

    // 构建前清空dist文件夹。
    // 如果此选项设为false，会保留旧版本的ccx文件。
    clearDist: boolean = false

    // esbuild 压缩main.js
    minify: boolean = true

    // esbuild 尝试合并成一个main.js文件
    bundle: boolean = true

    // esbuild target
    // https://esbuild.github.io/api/#target
    target: string | string[] = 'esnext'

    // （调试）输出ccx文件之前，输出到文件夹下
    outputFilesBeforeZip: boolean = false

    // （调试）将构建后的语言文件JSON输出到终端
    logLocales: boolean = false

    // ⚠ 警告：路径不得包含反斜杠！
    path = new class {
        license = new class {
            _ = "LICENSE.txt"
        }

        src = new class {
            _ = "src"
            main = J(this._, "main.ts")
            locales = J(this._, "locales")
            info = J(this._, "info.json")
            settings = J(this._, "settings.json")
        }

        dist = new class {
            _ = "dist"
        }
    }

    // ⚠ 警告：路径不得包含反斜杠！
    output = new class {
        name(info: type.ExtensionInfo) {
            return `${info.id}@${info.version}`
        }
        ext = "ccx"
        locales = "locales"
        info = "info.json"
        main = "main.js"
        settings = "settings.json"
    }
}
