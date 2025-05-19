if (process.argv[2] === 'build') {
    await import('./builder.js')
} else if (process.argv[2] === 'create') {

} else {
    console.log('unknown command')
    process.exit(1)
}