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

export const WORKFLOW_FOUR_NAME = 'WorkflowTypeFour'

export interface WorkflowFourArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowFour(args: WorkflowFourArgs): Promise<string> {
    log.info(`[WorkflowFour] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowFourUser-${args.clientName}`
    )
    log.info(`[WorkflowFour] Greeting: ${greeting}`)

    log.info(
        `[WorkflowFour] Starting CPU-heavy task with ${args.cpuIterations} iterations.`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF4-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowFour] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowFour] Starting Memory-heavy task with array size ${args.memoryArraySize}.`
    )
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF4-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowFour] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowFour for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowFour] ${finalMessage}`)
    return finalMessage
}
