import fs from "node:fs"
import path from "node:path"

let extensionDir = ''

function cp(left: string, right?: string) {
    right ||= left
    fs.cpSync(
        import.meta.resolve('../../' + left),
        path.join(extensionDir, right),
        { recursive: true }
    )
}

if (extensionDir == '') {
    console.log('Reject.')
    process.exit(1)
}

fs.mkdirSync(extensionDir)

cp('.github/workflows/main.yml')
cp('.vscode')
cp('src')
cp('.gitattributes')
cp('.gitignore')
cp('LICENSE.txt')
cp('template.makeccx.config.ts', 'makeccx.config.ts')
cp('template.package.json', 'package.json')
cp('tsconfig.json')
cp('tsconfig.makeccx.json')
cp('tsconfig.src.json')

console.log(`
    cd ${extensionDir}
    npm i
    npm run build
`)
