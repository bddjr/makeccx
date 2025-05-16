// Copyright © 2025 This Extension Author & bddjr & Clip Team
// License: MIT
// https://github.com/bddjr/makeccx


// ============================================
// 测试版版本号例如（结尾是日期缩写）: 
// dev-1.0.0-250515
// 正式版版本号例如: 
// 1.0.0
const version = "1.0.0"

console.log(`makeccx ${version}`)


// ============================================
// Dependencies:

import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

import esbuild from 'esbuild'
import JSZip from 'jszip'
import { rimrafSync } from 'rimraf'
import { type } from 'clipcc-extension'

import { config } from '../makeccx.config.js'


// ============================================
// Set Config:

config.output.ext = config.output.ext.replace(/^\./, '')


// ============================================
// Functions:

function cutPathPrefix(str: string): string {
    const prefix = path.resolve() + path.sep
    if (str.startsWith(prefix))
        return str.slice(prefix.length)
    return str
}

function appendID(left: string, right: string): string {
    if (right === "")
        return left
    if (!left.endsWith('.'))
        left += '.'
    if (right.startsWith(left))
        return right
    return left + right
}

const filenameAntiChar = '\\/:*?"<>|'

function checkFileName(filename: string): boolean {
    for (const i of filename) {
        if (filenameAntiChar.includes(i))
            return false
    }
    return true
}

function fileURLToUnixPath(p: string): string {
    return p.replace(/^file:\/+(.:\/)?/, '/')
}


// ============================================
// Template CJS:

const pathMakeccxMain = url.fileURLToPath(import.meta.resolve("./module.exports.cjs"))

const pathMakeccxCCE = url.fileURLToPath(import.meta.resolve("./clipcc-extension.cjs"))

fs.writeFileSync(pathMakeccxMain, `module.exports=require(${JSON.stringify(
    path.posix.relative(
        fileURLToUnixPath(import.meta.resolve("./")),
        config.path.src.main
    )
)}).default`)

fs.writeFileSync(pathMakeccxCCE, `module.exports=self.ClipCCExtension`)


// ============================================
// Info:

const info = JSON.parse(
    fs.readFileSync(config.path.src.info).toString()
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

const outputName = config.output.name(info)
if (!checkFileName(outputName)) {
    console.error(`× 错误：文件名不能包含下列任何字符：${filenameAntiChar}\n`)
    process.exit(1)
}
const pathDistBeforeZip = path.posix.join(config.path.dist._, outputName)
const pathDistCcx = pathDistBeforeZip + "." + config.output.ext
console.log(pathDistCcx + '\n')


// ============================================
// ESBuild:

const outputMain = esbuild.buildSync({
    entryPoints: [pathMakeccxMain],
    outbase: './',
    outfile: config.output.main,
    minify: config.minify,
    bundle: config.bundle,
    format: 'cjs',
    charset: 'utf8',
    write: false,
    alias: {
        "clipcc-extension": path.resolve(pathMakeccxCCE),
    },
    target: config.target,
})


// ============================================
// Make Dist Dir:

if (config.clearDist) {
    rimrafSync(config.path.dist._)
}
if (!fs.existsSync(config.path.dist._)) {
    fs.mkdirSync(config.path.dist._)
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
for (const f of outputMain.outputFiles) {
    const p = cutPathPrefix(f.path)
    addFile(p, outputMain.outputFiles[0].text)
}

// info
addFile(config.output.info, JSON.stringify(info))

if (info.icon) {
    addFile(info.icon, fs.readFileSync(path.join(config.path.src._, info.icon)))
}
if (info.inset_icon) {
    addFile(info.inset_icon, fs.readFileSync(path.join(config.path.src._, info.inset_icon)))
}


// locales
const ccxLocales = ccx.folder(config.output.locales)!

if (config.outputFilesBeforeZip) {
    fs.mkdirSync(path.join(pathDistBeforeZip, config.output.locales))
}

const outputLocale = (name: string, content: any): void => {
    name = name.replaceAll('\\', '/')
    ccxLocales.file(name, content, { optimizedBinaryString: true })
    if (config.outputFilesBeforeZip) {
        name = path.join(pathDistBeforeZip, config.output.locales, name)
        fs.writeFileSync(name, content)
    }
}

for (const name of fs.readdirSync(config.path.src.locales)) {
    if (!name.endsWith('.json'))
        continue

    interface srcType {
        [key: string]: string | srcType
    }
    interface distType {
        [key: string]: string
    }

    const srcPath = path.join(config.path.src.locales, name)
    const src = JSON.parse(fs.readFileSync(srcPath).toString()) as srcType
    const dist = {} as distType
    const flat = (id: string, content: string | srcType): void => {
        if (typeof content === 'string') {
            // string
            dist[id] = content
        } else if (typeof content === 'object' && !Array.isArray(content)) {
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


// license
if (config.copyLicense) {
    addFile(config.path.license._, fs.readFileSync(config.path.license._))
}

// settings
if (fs.existsSync(config.path.src.settings)) {
    addFile(config.output.settings, fs.readFileSync(config.path.src.settings))
}


// ============================================
// Write:

fs.writeFileSync(pathDistCcx, await ccx.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
    platform: 'UNIX',
}))
