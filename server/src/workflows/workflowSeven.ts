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

export const WORKFLOW_SEVEN_NAME = 'WorkflowTypeSeven'

export interface WorkflowSevenArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowSeven(args: WorkflowSevenArgs): Promise<string> {
    log.info(`[WorkflowSeven] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowSevenUser-${args.clientName}`
    )
    log.info(`[WorkflowSeven] Greeting: ${greeting}`)

    log.info(
        `[WorkflowSeven] Starting CPU-heavy task with ${args.cpuIterations} iterations.`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF7-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowSeven] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowSeven] Starting Memory-heavy task with array size ${args.memoryArraySize}.`
    )
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF7-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowSeven] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowSeven for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowSeven] ${finalMessage}`)
    return finalMessage
}
