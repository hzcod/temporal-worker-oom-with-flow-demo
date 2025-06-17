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

export const WORKFLOW_FOUR_NAME = 'WorkflowTypeFour'

export interface HeavyWorkflowArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowFour(args: HeavyWorkflowArgs): Promise<string> {
    log.info(`[WorkflowFour] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowFourUser-${args.clientName}`
    )
    log.info(`[WorkflowFour] Greeting: ${greeting}`)

    log.info(
        `[WorkflowFour] Delegating CPU-heavy task to specialized worker...`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF4-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowFour] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowFour] Delegating Memory-heavy task to specialized worker...`
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
