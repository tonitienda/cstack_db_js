const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MetaCommands = {
    '.exit': () => { rl.close(); process.exit(0) }
}

function executeStatement(statement) {
    if (!statement) {
        return
    }

    statement.execute()
    console.log('Executed.')
}

const StatemenNames = [
    {
        type: 'insert',
        execute: () => { console.log('This is where we would do an insert.') },
        regex: /insert.*/i
    },
    {
        type: 'select',
        execute: () => { console.log('This is where we would do a select.') },
        regex: /select.*/i
    }
]

function prepareStatement(input) {
    const statement = StatemenNames.find(s => s.regex.test(input))

    if (!statement) {
        console.log(`Unrecognized command at start of ${input}`)
    }

    return statement

}

function doMetaCommand(input) {
    const command = MetaCommands[input]

    if (!command) {
        console.log(`Unrecognized command '${commandline}'`)
    } else (
        command(input)
    )
}

function prompt() {
    rl.question(`db > `, commandline => {
        if (commandline.startsWith('.')) {
            doMetaCommand(commandline)
        } else {
            executeStatement(prepareStatement(commandline))
        }

        prompt()
    })
}


prompt()