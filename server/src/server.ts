import express from 'express'
import { startAllWorkersInServer } from './worker-setup'

const app = express()
const port = process.env.SERVER_PORT || 3001

app.use(express.json())

app.get('/welcome', (req, res) => {
    res.status(200).send(
        'Express server is running. Temporal workers should be initializing/running.'
    )
})

async function startServerAndWorkers() {
    console.log(
        '[Express Server] Attempting to initialize and start Temporal workers...'
    )
    startAllWorkersInServer().catch((error) => {
        console.error(
            '[Express Server] CRITICAL: Failed to initialize or start Temporal workers:',
            error
        )
        // exit the process if workers can't start.
        process.exit(1)
    })

    app.listen(port, () => {
        console.log(
            `[Express Server] Express server listening on http://localhost:${port}`
        )
        console.log(
            '[Express Server] Temporal workers have been initiated. Check console for worker logs.'
        )
    })
}

startServerAndWorkers()
