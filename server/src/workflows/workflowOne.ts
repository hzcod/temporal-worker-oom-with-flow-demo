import { proxyActivities, log } from '@temporalio/workflow'
import type * as allActivities from '../activities'

// Proxy all needed activities
const {
    greetingActivity,
    // simulateLongTaskActivity,
    simulateCpuHeavyActivity,
    simulateMemoryHeavyActivity,
} = proxyActivities<typeof allActivities>({
    // It's good practice to set appropriate timeouts for each type of activity.
    // For potentially long CPU/memory tasks, startToCloseTimeout is critical.
    startToCloseTimeout: '10 minutes', // Increased for potentially longer tasks
    heartbeatTimeout: '1 minute', // Important if activities heartbeat
    // You can also define different retry policies if needed
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

    const greeting = await greetingActivity(
        `WorkflowOneUser-${args.clientName}`
    )
    log.info(`[WorkflowOne] Greeting: ${greeting}`)

    log.info(
        `[WorkflowOne] Starting CPU-heavy task with ${args.cpuIterations} iterations.`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF1-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowOne] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowOne] Starting Memory-heavy task with array size ${args.memoryArraySize}.`
    )
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF1-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowOne] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowOne for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowOne] ${finalMessage}`)
    return finalMessage
}
