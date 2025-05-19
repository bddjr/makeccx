// Copyright © 2025 This Extension Author & bddjr & Clip Team
// License: MIT
// https://github.com/bddjr/makeccx


// ============================================

const version = "1.1.0"

console.log(`makeccx ${version}`)


// ============================================
// Dependencies:

import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import esbuild from 'esbuild'
import JSZip from 'jszip'
import { rimrafSync } from 'rimraf'
import { type } from 'clipcc-extension'

import { Config } from './export.js'
import {
    appendID,
    checkFileName,
    filenameAntiChar,
    mustStartsWithDotSlash
} from './utils.js'


// ============================================
// Get Config:

const ccxInnerPath = {
    main: "main.js",
    info: "info.json",
    settings: "settings.json",
    locales: "locales", // 文件夹
    license: "LICENSE", // 需补充文件后缀
    icon: "cover",      // 需补充文件后缀
    inset_icon: "icon", // 需补充文件后缀
}

const config = await (async () => {
    const extList = ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs']
    let name = ''
    for (const ext of extList) {
        const thisName = 'makeccx.config.' + ext
        if (fs.existsSync(thisName)) {
            name = thisName
            break
        }
    }
    const config: Config = {}
    if (name) {
        const outdir = './node_modules/.makeccx'
        const outName = 'config'
        const outNameWithExt = outName + '.js'
        const outPath = path.posix.join(outdir, outNameWithExt)
        esbuild.buildSync({
            entryPoints: [{
                in: path.resolve(name),
                out: outName
            }],
            outdir: path.resolve(outdir),
            bundle: true,
            minify: false,
            write: true,
            platform: 'node',
            format: 'esm',
        })
        const jsExport = await import(pathToFileURL(outPath).href)
        Object.assign(config, jsExport.default)
    }

    config.clearDist ??= false
    config.outputFilesBeforeZip ??= false
    config.logLocales ??= false

    config.path ??= {}
    config.path.main ??= "src/main.ts"
    config.path.locales ??= "src/locales"
    config.path.info ??= "src/info.json"
    config.path.settings ??= "src/settings.json"
    config.path.dist ??= "dist"
    config.path.outputName ??= (info: type.ExtensionInfo) => `${info.id}@${info.version}`
    config.path.outputExt ??= "ccx"
    config.path.outputExt = config.path.outputExt.replace(/^\./, '')
    config.path.license ||= true

    config.esbuild ??= {}
    config.esbuild.stdin ??= {
        resolveDir: './',
        loader: 'js',
        // 自动适配 ESM 或 CJS
        contents: `
var r = require(${JSON.stringify(mustStartsWithDotSlash(config.path.main))})
module.exports = r.__esModule ? r.default : r
`,
    }
    config.esbuild.outbase ??= './'
    config.esbuild.minify ??= true
    config.esbuild.bundle ??= true
    config.esbuild.format ??= 'cjs'
    config.esbuild.charset ??= 'utf8'
    config.esbuild.write ??= false
    config.esbuild.alias ??= {}
    config.esbuild.alias["clipcc-extension"] ??= `data:text/javascript,module.exports=self.ClipCCExtension`
    config.esbuild.target ??= 'esnext'

    return config
})()



// ============================================
// Info:

const info = JSON.parse(
    fs.readFileSync(config.path.info).toString()
) as type.ExtensionInfo

info.icon = info.icon.replaceAll('\\', '/')
info.inset_icon = info.inset_icon.replaceAll('\\', '/')

console.log(info)
console.log()

// 插件的 ID，必须是唯一的，推荐的写法为 作者ID.插件名，
// 其中整个 ID 必须满足 [a-zA-Z0-9_-]+。
// 不推荐使用多个 . 分割 ID，
// 如有必要，每个 . 之间必须至少有一个合法的字符。
// 参考文档 https://doc.codingclip.com/zh-cn/developer/structure
if (/\.\.|^\.|\.$/.test(info.id) || !/^[a-zA-Z0-9_\-\.]+$/.test(info.id)) {
    console.warn("⚠ 警告：扩展ID不符合规范\n")
}


// ============================================
// CCX Path:

const outputName = config.path.outputName(info)
if (!checkFileName(outputName)) {
    console.error(`× 错误：文件名不能包含下列任何字符：${filenameAntiChar}\n`)
    process.exit(1)
}
const pathDistBeforeZip = path.posix.join(config.path.dist, outputName)
const pathDistCcx = pathDistBeforeZip + "." + config.path.outputExt

console.log(pathDistCcx)

if (fs.existsSync(pathDistCcx))
    fs.rmSync(pathDistCcx)


// ============================================
// ESBuild:

const outputMain = esbuild.buildSync(config.esbuild)


// ============================================
// Make Dist Dir:

if (config.clearDist) {
    rimrafSync(config.path.dist)
}
if (!fs.existsSync(config.path.dist)) {
    fs.mkdirSync(config.path.dist)
}

rimrafSync(pathDistBeforeZip)
if (config.outputFilesBeforeZip) {
    fs.mkdirSync(pathDistBeforeZip)
}


// ============================================
// JSZip:

const ccx = new JSZip()

const addFile = (name: string, content: any): void => {
    name = name.replaceAll('\\', '/')
    ccx.file(name, content)
    if (config.outputFilesBeforeZip) {
        name = path.join(pathDistBeforeZip, name)
        const dirname = path.dirname(name)
        if (!fs.existsSync(dirname))
            fs.mkdirSync(dirname)
        fs.writeFileSync(name, content)
    }
}

// main
addFile(ccxInnerPath.main, outputMain.outputFiles[0].text)

// info
if (info.icon) {
    const assetsPath = info.icon
    const innerPath = ccxInnerPath.icon + path.extname(assetsPath)
    const readPath = path.join(path.dirname(config.path.info), assetsPath)
    addFile(innerPath, fs.readFileSync(readPath))
    info.icon = innerPath
}
if (info.inset_icon) {
    const assetsPath = info.inset_icon
    const innerPath = ccxInnerPath.inset_icon + path.extname(assetsPath)
    const readPath = path.join(path.dirname(config.path.info), assetsPath)
    addFile(innerPath, fs.readFileSync(readPath))
    info.inset_icon = innerPath
}
addFile(ccxInnerPath.info, JSON.stringify(info))


// locales
const ccxLocales = ccx.folder(ccxInnerPath.locales)!

if (config.outputFilesBeforeZip) {
    fs.mkdirSync(path.join(pathDistBeforeZip, ccxInnerPath.locales))
}

const outputLocale = (name: string, content: any): void => {
    name = name.replaceAll('\\', '/')
    ccxLocales.file(name, content, { optimizedBinaryString: true })
    if (config.outputFilesBeforeZip) {
        name = path.join(pathDistBeforeZip, ccxInnerPath.locales, name)
        fs.writeFileSync(name, content)
    }
}

let has_en_json = false
for (const name of fs.readdirSync(config.path.locales)) {
    if (!name.endsWith('.json'))
        continue
    if (name === 'en.json')
        has_en_json = true

    interface srcType {
        [key: string]: string | srcType
    }
    interface distType {
        [key: string]: string
    }

    const srcPath = path.join(config.path.locales, name)
    const src = JSON.parse(fs.readFileSync(srcPath).toString()) as srcType
    const dist = {} as distType
    const flat = (id: string, content: string | srcType): void => {
        if (typeof content === 'string') {
            // string
            dist[id] = content
        } else if (typeof content === 'object') {
            // object
            for (const key in content) {
                flat(appendID(id, key), content[key])
            }
        } else {
            // other type
            dist[id] = String(content)
        }
    }

    for (const key in src) {
        flat(appendID(info.id, key), src[key])
    }
    if (config.logLocales)
        console.log(name, dist)
    outputLocale(name, JSON.stringify(dist))
}
if (!has_en_json) {
    console.warn("⚠ 警告：缺少 locales/en.json 文件，这可能会导致其它语言无法正常显示！")
}


// license
if (config.path.license) {
    let readPath = ''
    if (typeof config.path.license === "string") {
        // 已指定文件位置
        readPath = config.path.license
    } else {
        // 尝试按照不同后缀的优先级查找
        const extList = ['', '.txt', '.md', '.html', '.htm']
        for (const ext of extList) {
            const name = 'LICENSE' + ext
            if (fs.existsSync(name) && fs.statSync(name).isFile()) {
                readPath = name
                break
            }
        }
        // 没找到？
        if (!readPath) {
            const ls = fs.readdirSync('./')
            // 尝试查找文件名开头为LICENSE的文件（不分大小写）
            for (const name of ls) {
                if (/^LICENSE/i.test(name) && fs.statSync(name).isFile()) {
                    readPath = name
                    break
                }
            }
            // 尝试查找文件名包含LICENSE的文件（不分大小写）
            for (const name of ls) {
                if (/LICENSE/i.test(name) && fs.statSync(name).isFile()) {
                    readPath = name
                    break
                }
            }
        }
    }
    // 找到文件了？
    if (readPath) {
        // 写入
        addFile(
            ccxInnerPath.license + path.extname(readPath),
            fs.readFileSync(readPath)
        )
    }
}

// （可选）settings
if (fs.existsSync(config.path.settings)) {
    const settings = JSON.parse(fs.readFileSync(config.path.settings).toString())
    addFile(ccxInnerPath.settings, JSON.stringify(settings))
}


// ============================================
// Write:

const outFile = await ccx.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
    platform: 'UNIX',
})

console.log(`${Math.ceil(outFile.length / 1024 * 100) / 100} KiB`)

fs.writeFileSync(pathDistCcx, outFile)

console.log()
