import { proxyActivities, log } from '@temporalio/workflow'
import type * as allActivities from '../activities'

// --- Proxy Client for LIGHTWEIGHT Activities ---
// This client sends tasks to the workflow's default task queue ('workflow-one-tasks').
const { greetingActivity } = proxyActivities<typeof allActivities>({
    startToCloseTimeout: '1 minute',
})

// --- Proxy Client for HEAVY Activities ---
// This client is special. It sends tasks to a DEDICATED queue for heavy work.
const { simulateCpuHeavyActivity, simulateMemoryHeavyActivity } =
    proxyActivities<typeof allActivities>({
        taskQueue: 'heavy-duty-tasks',
        startToCloseTimeout: '10 minutes',
        heartbeatTimeout: '1 minute',
    })

export const WORKFLOW_ONE_NAME = 'WorkflowTypeOne'

export interface WorkflowOneArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowOne(args: WorkflowOneArgs): Promise<string> {
    log.info(`[WorkflowOne] Started for client: ${args.clientName}`, {
        ...args,
    })

    // This call uses the 'greetingActivity' proxy and goes to the default queue.
    const greeting = await greetingActivity(
        `WorkflowOneUser-${args.clientName}`
    )
    log.info(`[WorkflowOne] Greeting: ${greeting}`)

    // These calls use the heavy activity proxy and go to the 'heavy-duty-tasks' queue.
    log.info(`[WorkflowOne] Starting CPU-heavy task on dedicated queue...`)
    const cpuResult = await simulateCpuHeavyActivity(
        `WF1-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowOne] CPU-heavy task result: ${cpuResult}`)

    log.info(`[WorkflowOne] Starting Memory-heavy task on dedicated queue...`)
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF1-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowOne] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowOne for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowOne] ${finalMessage}`)
    return finalMessage
}
