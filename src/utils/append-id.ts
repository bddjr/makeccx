export function appendID(left: string, right: string) {
    if (right === "")
        return left
    if (!left.endsWith('.'))
        left += '.'
    if (right.startsWith(left))
        return right
    return left + right
}
