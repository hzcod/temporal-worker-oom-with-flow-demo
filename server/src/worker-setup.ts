import { NativeConnection, Worker } from '@temporalio/worker'
import * as allActivities from './activities'

import {
    WORKFLOW_ONE_NAME,
    WORKFLOW_TWO_NAME,
    WORKFLOW_THREE_NAME,
    WORKFLOW_FOUR_NAME,
    WORKFLOW_FIVE_NAME,
    WORKFLOW_SIX_NAME,
    WORKFLOW_SEVEN_NAME,
    WORKFLOW_EIGHT_NAME,
    WORKFLOW_NINE_NAME,
    WORKFLOW_TEN_NAME,
    WORKFLOW_ELEVEN_NAME,
    WORKFLOW_TWELVE_NAME,
    WORKFLOW_THIRTEEN_NAME,
} from './workflows'

const allWorkerConfigurations = [
    { workflowMarkerName: WORKFLOW_ONE_NAME, taskQueueSuffix: 'one' },
    { workflowMarkerName: WORKFLOW_TWO_NAME, taskQueueSuffix: 'two' },
    { workflowMarkerName: WORKFLOW_THREE_NAME, taskQueueSuffix: 'three' },
    { workflowMarkerName: WORKFLOW_FOUR_NAME, taskQueueSuffix: 'four' },
    { workflowMarkerName: WORKFLOW_FIVE_NAME, taskQueueSuffix: 'five' },
    { workflowMarkerName: WORKFLOW_SIX_NAME, taskQueueSuffix: 'six' },
    { workflowMarkerName: WORKFLOW_SEVEN_NAME, taskQueueSuffix: 'seven' },
    { workflowMarkerName: WORKFLOW_EIGHT_NAME, taskQueueSuffix: 'eight' },
    { workflowMarkerName: WORKFLOW_NINE_NAME, taskQueueSuffix: 'nine' },
    { workflowMarkerName: WORKFLOW_TEN_NAME, taskQueueSuffix: 'ten' },
    { workflowMarkerName: WORKFLOW_ELEVEN_NAME, taskQueueSuffix: 'eleven' },
    { workflowMarkerName: WORKFLOW_TWELVE_NAME, taskQueueSuffix: 'twelve' },
    { workflowMarkerName: WORKFLOW_THIRTEEN_NAME, taskQueueSuffix: 'thirteen' },
]

export async function startAllWorkersInServer() {
    console.log(
        '[WorkerSetup] Starting the process to set up all workers using a loop...'
    )

    // Start timing for worker setup
    console.time('AllWorkersSetupTime')

    console.log(
        '[WorkerSetup] Attempting to connect to Temporal server at localhost:7233...'
    )

    const connection = await NativeConnection.connect({
        address: 'localhost:7233',
    })

    console.log('[WorkerSetup] Successfully connected to Temporal server.')

    const pathToWorkflows = require.resolve('./workflows')

    console.log(
        `[WorkerSetup] Preparing to initialize ${allWorkerConfigurations.length} workers.`
    )

    for (const config of allWorkerConfigurations) {
        const dedicatedTaskQueue = `workflow-${config.taskQueueSuffix}-tasks`

        console.log(
            `[WorkerSetup] Initializing worker for Task Queue: ${dedicatedTaskQueue} (for workflows like ${config.workflowMarkerName})`
        )

        const worker = await Worker.create({
            connection: connection,
            namespace: 'default',
            taskQueue: dedicatedTaskQueue,
            workflowsPath: pathToWorkflows,
            activities: allActivities,
        })

        worker.run().catch((error) => {
            console.error(
                `[WorkerSetup] ERROR: Worker for Task Queue '${dedicatedTaskQueue}' encountered an error:`,
                error
            )
        })

        console.log(
            `[WorkerSetup] Worker for Task Queue '${dedicatedTaskQueue}' has been started.`
        )
    }
    console.log(
        '[WorkerSetup] All workers have been initiated via the loop and are running.'
    )

    // End timing for workers
    console.timeEnd('AllWorkersSetupTime')
}
