import { Connection, Client } from '@temporalio/client'

const INSTANCES_PER_WORKFLOW = 5

const allWorkflowClientConfigs = [
    {
        workflowTypeName: 'workflowOne',
        taskQueue: 'workflow-one-tasks',
        args: [
            {
                clientName: 'TestClient-WF1',
                cpuIterations: 500000,
                cpuYieldFrequency: 10000,
                memoryArraySize: 16000000,
            },
        ],
    },
    {
        workflowTypeName: 'workflowTwo',
        taskQueue: 'workflow-two-tasks',
        args: [
            {
                clientName: 'TestClient-WF2',
                cpuIterations: 500000,
                cpuYieldFrequency: 10000,
                memoryArraySize: 16000000,
            },
        ],
    },
    {
        workflowTypeName: 'workflowThree',
        taskQueue: 'workflow-three-tasks',
        args: [
            {
                clientName: 'TestClient-WF3',
                cpuIterations: 500000,
                cpuYieldFrequency: 10000,
                memoryArraySize: 16000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowFour',
        taskQueue: 'workflow-four-tasks',
        args: [
            {
                clientName: 'TestClient-WF4',
                cpuIterations: 500000,
                cpuYieldFrequency: 10000,
                memoryArraySize: 16000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowFive',
        taskQueue: 'workflow-five-tasks',
        args: [
            {
                clientName: 'TestClient-WF5',
                cpuIterations: 500000,
                cpuYieldFrequency: 10000,
                memoryArraySize: 16000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowSix',
        taskQueue: 'workflow-six-tasks',
        args: [
            {
                clientName: 'TestClient-WF6',
                cpuIterations: 500000,
                cpuYieldFrequency: 10000,
                memoryArraySize: 16000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowSeven',
        taskQueue: 'workflow-seven-tasks',
        args: [
            {
                clientName: 'TestClient-WF7',
                cpuIterations: 500000,
                cpuYieldFrequency: 10000,
                memoryArraySize: 16000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowEight',
        taskQueue: 'workflow-eight-tasks',
        args: [
            {
                clientName: 'TestClient-WF8',
                cpuIterations: 500000,
                cpuYieldFrequency: 10000,
                memoryArraySize: 16000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowNine',
        taskQueue: 'workflow-nine-tasks',
        args: [
            {
                clientName: 'TestClient-WF9',
                cpuIterations: 500000,
                cpuYieldFrequency: 10000,
                memoryArraySize: 16000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowTen',
        taskQueue: 'workflow-ten-tasks',
        args: [
            {
                clientName: 'TestClient-WF10',
                cpuIterations: 500000,
                cpuYieldFrequency: 10000,
                memoryArraySize: 16000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowEleven',
        taskQueue: 'workflow-eleven-tasks',
        args: [
            {
                clientName: 'TestClient-WF11',
                cpuIterations: 500000,
                cpuYieldFrequency: 10000,
                memoryArraySize: 16000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowTwelve',
        taskQueue: 'workflow-twelve-tasks',
        args: [
            {
                clientName: 'TestClient-WF12',
                cpuIterations: 500000,
                cpuYieldFrequency: 10000,
                memoryArraySize: 16000000,
            },
        ],
    },

    {
        workflowTypeName: 'workflowThirteen',
        taskQueue: 'workflow-thirteen-tasks',
        args: [
            {
                clientName: 'TestClient-WF13',
                cpuIterations: 500000,
                cpuYieldFrequency: 10000,
                memoryArraySize: 16000000,
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
