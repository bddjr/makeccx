export function toScratchBoolean(a: any): boolean {
    return !!a && (
        typeof a !== "string" || !/^(0|false)$/i.test(a)
    )
}