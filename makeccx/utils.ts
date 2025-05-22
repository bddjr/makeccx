import path from "node:path"

export function cutPathPrefix(str: string): string {
    const prefix = path.resolve() + path.sep
    if (str.startsWith(prefix))
        return str.slice(prefix.length)
    return str
}

export function appendID(left: string, right: string): string {
    left += ''
    right += ''
    if (right == "")
        return left
    if (!left.endsWith('.'))
        left += '.'
    if (right.startsWith(left))
        return right
    return left + right
}

export const filenameAntiChar = '\\/:*?"<>|'

export function checkFileName(filename: string): boolean {
    let isAllDot = true
    for (const i of filename) {
        if (i !== '.')
            isAllDot = false
        if (filenameAntiChar.includes(i))
            return false
    }
    return !isAllDot
}

export function mustStartsWithDotSlash(p: string): string {
    p = p.replaceAll('\\', '/')
    if (/^\.{0,2}\//.test(p))
        return p
    return './' + p
}
