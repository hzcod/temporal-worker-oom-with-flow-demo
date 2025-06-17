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

export const WORKFLOW_SIX_NAME = 'WorkflowTypeSix'

export interface HeavyWorkflowArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowSix(args: HeavyWorkflowArgs): Promise<string> {
    log.info(`[WorkflowSix] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowSixUser-${args.clientName}`
    )
    log.info(`[WorkflowSix] Greeting: ${greeting}`)

    log.info(`[WorkflowSix] Delegating CPU-heavy task to specialized worker...`)
    const cpuResult = await simulateCpuHeavyActivity(
        `WF6-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowSix] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowSix] Delegating Memory-heavy task to specialized worker...`
    )
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF6-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowSix] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowSix for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowSix] ${finalMessage}`)
    return finalMessage
}
