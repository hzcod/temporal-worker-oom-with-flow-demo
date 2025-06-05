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

export const WORKFLOW_ELEVEN_NAME = 'WorkflowTypeEleven'

export interface WorkflowElevenArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowEleven(
    args: WorkflowElevenArgs
): Promise<string> {
    log.info(`[WorkflowEleven] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowElevenUser-${args.clientName}`
    )
    log.info(`[WorkflowEleven] Greeting: ${greeting}`)

    log.info(
        `[WorkflowEleven] Starting CPU-heavy task with ${args.cpuIterations} iterations.`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF11-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowEleven] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowEleven] Starting Memory-heavy task with array size ${args.memoryArraySize}.`
    )
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF11-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowEleven] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowEleven for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowEleven] ${finalMessage}`)
    return finalMessage
}
