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
    console.log('[WorkerSetup] Starting the process to set up all workers...')
    console.time('AllWorkersSetupTime')

    const connection = await NativeConnection.connect({
        address: 'localhost:7233',
    })
    console.log('[WorkerSetup] Successfully connected to Temporal server.')

    const pathToWorkflows = require.resolve('./workflows')

    // --- Manually create our activity groups here ---
    const lightweightActivities = {
        greetingActivity: allActivities.greetingActivity,
    }
    const intensiveActivities = {
        simulateCpuHeavyActivity: allActivities.simulateCpuHeavyActivity,
        simulateMemoryHeavyActivity: allActivities.simulateMemoryHeavyActivity,
    }

    // --- PHASE 1a: CREATE THE "WORKFLOW WORKERS" ---
    console.log(
        `[WorkerSetup] Phase 1a: Creating ${allWorkerConfigurations.length} Workflow workers...`
    )
    const workflowWorkerPromises = allWorkerConfigurations.map((config) => {
        const dedicatedTaskQueue = `workflow-${config.taskQueueSuffix}-tasks`
        return Worker.create({
            connection,
            namespace: 'default',
            taskQueue: dedicatedTaskQueue,
            workflowsPath: pathToWorkflows,
            // These workers ONLY know about simple, lightweight activities.
            activities: lightweightActivities,
            maxConcurrentWorkflowTaskExecutions: 20,
            maxCachedWorkflows: 100,
        })
    })

    // --- PHASE 1b: CREATE THE "ACTIVITY WORKER" ---
    console.log(
        '[WorkerSetup] Phase 1b: Creating 1 special heavy-duty worker...'
    )
    const heavyDutyWorkerPromise = Worker.create({
        connection,
        namespace: 'default',
        taskQueue: 'heavy-duty-tasks', // Listens ONLY on the special queue
        // This worker does NOT run workflows. It ONLY knows about intensive activities.
        activities: intensiveActivities,
        // Tuned for heavy work.
        maxConcurrentActivityTaskExecutions: 5,
    })

    // Wait for all workers to be created
    const [createdWorkflowWorkers, createdHeavyDutyWorker] = await Promise.all([
        Promise.all(workflowWorkerPromises),
        heavyDutyWorkerPromise,
    ])
    console.log('[WorkerSetup] Phase 1 Complete: All worker instances created.')
    console.timeEnd('AllWorkersSetupTime')

    // --- PHASE 2: RUN ALL WORKERS ---
    console.log(
        '[WorkerSetup] Phase 2: Starting all workers to begin polling...'
    )
    for (const worker of createdWorkflowWorkers) {
        worker
            .run()
            .catch((error) =>
                console.error(
                    `Workflow worker on queue ${worker.options.taskQueue} failed:`,
                    error
                )
            )
    }
    createdHeavyDutyWorker
        .run()
        .catch((error) => console.error(`Heavy-duty worker failed:`, error))
    console.log('[WorkerSetup] Phase 2 Complete: All workers are polling.')
}
