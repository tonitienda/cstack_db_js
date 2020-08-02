const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const TableConfig = {
    ID_SIZE: 4,
    ID_OFFSET: 0,
    USERNAME_SIZE: 32,
    USERNAME_OFFSET: 4,
    EMAIL_SIZE: 255,
    EMAIL_OFFSET: 36,
    ROW_SIZE: 291
}

const serializeRow = data => {
    const buffer = Buffer.alloc(291);
    buffer.writeInt32BE(data.id, TableConfig.ID_OFFSET)
    buffer.write(data.username, TableConfig.USERNAME_OFFSET)
    buffer.write(data.email, TableConfig.EMAIL_OFFSET)

    return buffer
}

const deserializeRow = data => {
    return {
        id: data.slice(TableConfig.ID_OFFSET, TableConfig.ID_SIZE),
        username: data.slice(TableConfig.USERNAME_OFFSET, TableConfig.USERNAME_SIZE),
        email: data.slice(TableConfig.EMAIL_OFFSET, TableConfig.EMAIL_SIZE)
    }
}


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

function ExecuteInsert(args) {
    if (args.length !== 3) {
        console.log(`Number of arguments for insert are not correct.`)
        return
    }

    console.log(`Inserting:`, args)
    const row = {
        id: Number(args[0]),
        username: args[1],
        email: args[2]
    }

    const serializedRow = serializeRow(row)
    console.log(bufferToHex(serializedRow))

}


function bufferToHex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join(" ");
}

function ExecuteSelect(args) {
    console.log(`Selecting:`, args)
}

const StatementNames = (input) => [
    {
        type: 'insert',
        execute: () => ExecuteInsert(input.split(' ').slice(1)),
        regex: /insert.*/i
    },
    {
        type: 'select',
        execute: () => ExecuteSelect(input.split(' ').slice(1)),
        regex: /select.*/i
    }
]

function prepareStatement(input) {
    const statement = StatementNames(input).find(s => s.regex.test(input))

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