import { Connection, Client, WorkflowIdReusePolicy } from '@temporalio/client'

// const INSTANCES_PER_WORKFLOW = 5
const INSTANCES_PER_WORKFLOW = 2
// const INSTANCES_PER_WORKFLOW = 4
// const INSTANCES_PER_WORKFLOW = 8

const allWorkflowClientConfigs = [
    {
        workflowTypeName: 'workflowOne',
        taskQueue: 'workflow-one-tasks',
        args: [
            {
                // Pass the WorkflowOneArgs object
                clientName: 'TestClient-WF1',
                cpuIterations: 50000000, // START WITH A MODERATE NUMBER, e.g., 50 million
                cpuYieldFrequency: 1000000, // Yield every 1 million iterations
                memoryArraySize: 2000000, // Create an array of 1 million numbers (approx 8MB)
            },
        ],
    },
    {
        workflowTypeName: 'workflowTwo',
        taskQueue: 'workflow-two-tasks',
        args: ['ClientArgsFor-WF2'],
    },

    {
        workflowTypeName: 'workflowThree',
        taskQueue: 'workflow-three-tasks',
        args: [
            {
                clientName: 'TestClient-WF3',
                cpuIterations: 50000000,
                cpuYieldFrequency: 1000000,
                memoryArraySize: 2000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowFour',
        taskQueue: 'workflow-four-tasks',
        args: [
            {
                clientName: 'TestClient-WF4',
                cpuIterations: 50000000,
                cpuYieldFrequency: 1000000,
                memoryArraySize: 2000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowFive',
        taskQueue: 'workflow-five-tasks',
        args: [
            {
                clientName: 'TestClient-WF5',
                cpuIterations: 50000000,
                cpuYieldFrequency: 1000000,
                memoryArraySize: 2000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowSix',
        taskQueue: 'workflow-six-tasks',
        args: [
            {
                clientName: 'TestClient-WF6',
                cpuIterations: 50000000,
                cpuYieldFrequency: 1000000,
                memoryArraySize: 2000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowSeven',
        taskQueue: 'workflow-seven-tasks',
        args: [
            {
                clientName: 'TestClient-WF7',
                cpuIterations: 50000000,
                cpuYieldFrequency: 1000000,
                memoryArraySize: 2000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowEight',
        taskQueue: 'workflow-eight-tasks',
        args: [
            {
                clientName: 'TestClient-WF8',
                cpuIterations: 50000000,
                cpuYieldFrequency: 1000000,
                memoryArraySize: 2000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowNine',
        taskQueue: 'workflow-nine-tasks',
        args: [
            {
                clientName: 'TestClient-WF9',
                cpuIterations: 50000000,
                cpuYieldFrequency: 1000000,
                memoryArraySize: 2000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowTen',
        taskQueue: 'workflow-ten-tasks',
        args: [
            {
                clientName: 'TestClient-WF10',
                cpuIterations: 50000000,
                cpuYieldFrequency: 1000000,
                memoryArraySize: 2000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowEleven',
        taskQueue: 'workflow-eleven-tasks',
        args: [
            {
                clientName: 'TestClient-WF11',
                cpuIterations: 50000000,
                cpuYieldFrequency: 1000000,
                memoryArraySize: 2000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowTwelve',
        taskQueue: 'workflow-twelve-tasks',
        args: [
            {
                clientName: 'TestClient-WF12',
                cpuIterations: 50000000,
                cpuYieldFrequency: 1000000,
                memoryArraySize: 2000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowThirteen',
        taskQueue: 'workflow-thirteen-tasks',
        args: [
            {
                clientName: 'TestClient-WF13',
                cpuIterations: 50000000,
                cpuYieldFrequency: 1000000,
                memoryArraySize: 2000000,
            },
        ],
    },
]

async function runClient() {
    console.log('[ClientApp] Attempting to connect to Temporal server...')

    const connection = await Connection.connect({
        address: 'localhost:7233',
    })

    console.log('[ClientApp] Successfully connected to Temporal server.')

    const client = new Client({
        connection,
    })
    console.log('[ClientApp] Temporal client created.')

    for (const wfConfig of allWorkflowClientConfigs) {
        console.log(
            `\n[ClientApp] Preparing to start ${INSTANCES_PER_WORKFLOW} instances of '${wfConfig.workflowTypeName}' on task queue '${wfConfig.taskQueue}'...`
        )

        // Inner loop: Start the required number of instances for the current workflow type
        for (let i = 0; i < INSTANCES_PER_WORKFLOW; i++) {
            const workflowId = `${wfConfig.workflowTypeName.toLowerCase()}-instance-${i}`

            try {
                console.log(
                    `[ClientApp] Starting ${wfConfig.workflowTypeName} instance #${i} with ID: ${workflowId}`
                )

                await client.workflow.start(wfConfig.workflowTypeName, {
                    workflowId: workflowId,
                    taskQueue: wfConfig.taskQueue,
                    args: wfConfig.args,
                })
                console.log(
                    `[ClientApp] Successfully started instance: ${workflowId}`
                )
            } catch (error) {
                console.error(
                    `[ClientApp] Failed to start instance ${workflowId} for '${wfConfig.workflowTypeName}':`,
                    error
                )
            }
        }
    }

    console.log('\n[ClientApp] All workflow start requests have been sent.')

    await connection.close()
    console.log('[ClientApp] Connection to Temporal server closed.')
}

runClient().catch((err) => {
    console.error('[ClientApp] An unexpected error occurred:', err)
    process.exit(1)
})
