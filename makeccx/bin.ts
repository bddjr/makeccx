#!/usr/bin/env node

if (process.argv[2] === 'build') {
    await import('./builder.js')
} else {
    console.log('makeccx: unknown command, please try "npx makeccx build"')
    process.exit(1)
}