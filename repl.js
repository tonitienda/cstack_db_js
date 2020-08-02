const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const Commands = {
    '.exit': () => rl.close()
}

function prompt() {
    rl.question(`db > `, commandline => {
        const command = Commands[commandline]

        if (!command) {
            console.log(`Unrecognized command '${commandline}'`)
            prompt()
        } else (
            command(commandline)
        )

    })
}


prompt()