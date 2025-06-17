import { proxyActivities, log } from '@temporalio/workflow'
import type * as allActivities from '../activities'

const { greetingActivity } = proxyActivities<typeof allActivities>({
    startToCloseTimeout: '1 minute',
})

const { simulateCpuHeavyActivity, simulateMemoryHeavyActivity } =
    proxyActivities<typeof allActivities>({
        taskQueue: 'heavy-duty-tasks',
        startToCloseTimeout: '10 minutes',
        heartbeatTimeout: '1 minute',
    })

export const WORKFLOW_THIRTEEN_NAME = 'WorkflowTypeThirteen'

export interface HeavyWorkflowArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowThirteen(
    args: HeavyWorkflowArgs
): Promise<string> {
    log.info(`[WorkflowThirteen] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowThirteenUser-${args.clientName}`
    )
    log.info(`[WorkflowThirteen] Greeting: ${greeting}`)

    log.info(
        `[WorkflowThirteen] Delegating CPU-heavy task to specialized worker...`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF13-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowThirteen] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowThirteen] Delegating Memory-heavy task to specialized worker...`
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
