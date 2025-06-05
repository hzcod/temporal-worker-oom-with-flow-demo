import { proxyActivities, log } from '@temporalio/workflow'
import type * as allActivities from '../activities'

const {
    greetingActivity,
    simulateCpuHeavyActivity,
    simulateMemoryHeavyActivity,
} = proxyActivities<typeof allActivities>({
    startToCloseTimeout: '10 minutes',
    heartbeatTimeout: '1 minute',
})

export const WORKFLOW_THIRTEEN_NAME = 'WorkflowTypeThirteen'

export interface WorkflowThirteenArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowThirteen(
    args: WorkflowThirteenArgs
): Promise<string> {
    log.info(`[WorkflowThirteen] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowThirteenUser-${args.clientName}`
    )
    log.info(`[WorkflowThirteen] Greeting: ${greeting}`)

    log.info(
        `[WorkflowThirteen] Starting CPU-heavy task with ${args.cpuIterations} iterations.`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF13-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowThirteen] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowThirteen] Starting Memory-heavy task with array size ${args.memoryArraySize}.`
    )
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF13-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowThirteen] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowThirteen for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowThirteen] ${finalMessage}`)
    return finalMessage
}
