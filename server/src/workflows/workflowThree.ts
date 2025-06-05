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

export const WORKFLOW_THREE_NAME = 'WorkflowTypeThree'

export interface WorkflowThreeArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowThree(args: WorkflowThreeArgs): Promise<string> {
    log.info(`[WorkflowThree] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowThreeUser-${args.clientName}`
    )
    log.info(`[WorkflowThree] Greeting: ${greeting}`)

    log.info(
        `[WorkflowThree] Starting CPU-heavy task with ${args.cpuIterations} iterations.`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF3-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowThree] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowThree] Starting Memory-heavy task with array size ${args.memoryArraySize}.`
    )
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF3-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowThree] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowThree for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowThree] ${finalMessage}`)
    return finalMessage
}
