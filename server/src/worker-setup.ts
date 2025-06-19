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
    const workerRole = process.env.WORKER_ROLE || 'ALL'

    console.log(`[WorkerSetup] Starting process with ROLE: ${workerRole}`)
    console.time('WorkerSetupTime')

    const connection = await NativeConnection.connect({
        address: 'localhost:7233',
    })
    console.log('[WorkerSetup] Successfully connected to Temporal server.')

    const pathToWorkflows = require.resolve('./workflows')
    const lightweightActivities = {
        greetingActivity: allActivities.greetingActivity,
    }
    const intensiveActivities = {
        simulateCpuHeavyActivity: allActivities.simulateCpuHeavyActivity,
        simulateMemoryHeavyActivity: allActivities.simulateMemoryHeavyActivity,
    }

    if (workerRole === 'WORKFLOW' || workerRole === 'ALL') {
        console.log(
            `[WorkerSetup] Initializing ${allWorkerConfigurations.length} WORKFLOW workers...`
        )
        const workflowWorkerPromises = allWorkerConfigurations.map((config) => {
            const dedicatedTaskQueue = `workflow-${config.taskQueueSuffix}-tasks`
            return Worker.create({
                connection,
                namespace: 'default',
                taskQueue: dedicatedTaskQueue,
                workflowsPath: pathToWorkflows,
                activities: lightweightActivities,
                maxConcurrentWorkflowTaskExecutions: 20,
                maxCachedWorkflows: 100,
            })
        })
        const createdWorkflowWorkers = await Promise.all(workflowWorkerPromises)
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
        console.log('[WorkerSetup] All WORKFLOW workers are now polling.')
    }

    if (workerRole === 'ACTIVITY' || workerRole === 'ALL') {
        console.log(
            '[WorkerSetup] Initializing 1 HEAVY-DUTY ACTIVITY worker...'
        )
        const heavyDutyWorker = await Worker.create({
            connection,
            namespace: 'default',
            taskQueue: 'heavy-duty-tasks',
            activities: intensiveActivities,
            maxConcurrentActivityTaskExecutions: 5,
        })
        heavyDutyWorker
            .run()
            .catch((error) => console.error(`Heavy-duty worker failed:`, error))
        console.log('[WorkerSetup] HEAVY-DUTY ACTIVITY worker is now polling.')
    }

    console.timeEnd('WorkerSetupTime')
}
