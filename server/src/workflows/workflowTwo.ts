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

export const WORKFLOW_TWO_NAME = 'WorkflowTypeTwo'

export interface HeavyWorkflowArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowTwo(args: HeavyWorkflowArgs): Promise<string> {
    log.info(`[WorkflowTwo] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowTwoUser-${args.clientName}`
    )
    log.info(`[WorkflowTwo] Greeting: ${greeting}`)

    log.info(`[WorkflowTwo] Delegating CPU-heavy task to specialized worker...`)
    const cpuResult = await simulateCpuHeavyActivity(
        `WF2-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowTwo] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowTwo] Delegating Memory-heavy task to specialized worker...`
    )
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF2-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowTwo] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowTwo for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowTwo] ${finalMessage}`)
    return finalMessage
}
