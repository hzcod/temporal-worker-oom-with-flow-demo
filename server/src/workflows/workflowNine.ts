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

export const WORKFLOW_NINE_NAME = 'WorkflowTypeNine'

export interface WorkflowNineArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowNine(args: WorkflowNineArgs): Promise<string> {
    log.info(`[WorkflowNine] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowNineUser-${args.clientName}`
    )
    log.info(`[WorkflowNine] Greeting: ${greeting}`)

    log.info(
        `[WorkflowNine] Starting CPU-heavy task with ${args.cpuIterations} iterations.`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF9-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowNine] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowNine] Starting Memory-heavy task with array size ${args.memoryArraySize}.`
    )
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF9-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowNine] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowNine for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowNine] ${finalMessage}`)
    return finalMessage
}
