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

export const WORKFLOW_EIGHT_NAME = 'WorkflowTypeEight'

export interface WorkflowEightArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowEight(args: WorkflowEightArgs): Promise<string> {
    log.info(`[WorkflowEight] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowEightUser-${args.clientName}`
    )
    log.info(`[WorkflowEight] Greeting: ${greeting}`)

    log.info(
        `[WorkflowEight] Starting CPU-heavy task with ${args.cpuIterations} iterations.`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF8-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowEight] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowEight] Starting Memory-heavy task with array size ${args.memoryArraySize}.`
    )
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF8-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowEight] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowEight for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowEight] ${finalMessage}`)
    return finalMessage
}
