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

export const WORKFLOW_THREE_NAME = 'WorkflowTypeThree'

export interface HeavyWorkflowArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowThree(args: HeavyWorkflowArgs): Promise<string> {
    log.info(`[WorkflowThree] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowThreeUser-${args.clientName}`
    )
    log.info(`[WorkflowThree] Greeting: ${greeting}`)

    log.info(
        `[WorkflowThree] Delegating CPU-heavy task to specialized worker...`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF3-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowThree] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowThree] Delegating Memory-heavy task to specialized worker...`
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
