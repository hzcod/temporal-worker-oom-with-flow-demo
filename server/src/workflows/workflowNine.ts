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

export const WORKFLOW_NINE_NAME = 'WorkflowTypeNine'

export interface HeavyWorkflowArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowNine(args: HeavyWorkflowArgs): Promise<string> {
    log.info(`[WorkflowNine] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowNineUser-${args.clientName}`
    )
    log.info(`[WorkflowNine] Greeting: ${greeting}`)

    log.info(
        `[WorkflowNine] Delegating CPU-heavy task to specialized worker...`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF9-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowNine] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowNine] Delegating Memory-heavy task to specialized worker...`
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
