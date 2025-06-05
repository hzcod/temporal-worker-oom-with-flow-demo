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

export const WORKFLOW_FIVE_NAME = 'WorkflowTypeFive'

export interface WorkflowFiveArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowFive(args: WorkflowFiveArgs): Promise<string> {
    log.info(`[WorkflowFive] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowFiveUser-${args.clientName}`
    )
    log.info(`[WorkflowFive] Greeting: ${greeting}`)

    log.info(
        `[WorkflowFive] Starting CPU-heavy task with ${args.cpuIterations} iterations.`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF5-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowFive] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowFive] Starting Memory-heavy task with array size ${args.memoryArraySize}.`
    )
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF5-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowFive] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowFive for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowFive] ${finalMessage}`)
    return finalMessage
}
