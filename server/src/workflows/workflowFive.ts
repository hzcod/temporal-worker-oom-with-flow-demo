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

export const WORKFLOW_FIVE_NAME = 'WorkflowTypeFive'

export interface HeavyWorkflowArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowFive(args: HeavyWorkflowArgs): Promise<string> {
    log.info(`[WorkflowFive] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowFiveUser-${args.clientName}`
    )
    log.info(`[WorkflowFive] Greeting: ${greeting}`)

    log.info(
        `[WorkflowFive] Delegating CPU-heavy task to specialized worker...`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF5-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowFive] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowFive] Delegating Memory-heavy task to specialized worker...`
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
