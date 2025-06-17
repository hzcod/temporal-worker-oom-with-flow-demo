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

export const WORKFLOW_SEVEN_NAME = 'WorkflowTypeSeven'

export interface HeavyWorkflowArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowSeven(args: HeavyWorkflowArgs): Promise<string> {
    log.info(`[WorkflowSeven] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowSevenUser-${args.clientName}`
    )
    log.info(`[WorkflowSeven] Greeting: ${greeting}`)

    log.info(
        `[WorkflowSeven] Delegating CPU-heavy task to specialized worker...`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF7-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowSeven] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowSeven] Delegating Memory-heavy task to specialized worker...`
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
