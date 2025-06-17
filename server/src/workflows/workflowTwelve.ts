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

export const WORKFLOW_TWELVE_NAME = 'WorkflowTypeTwelve'

export interface HeavyWorkflowArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowTwelve(args: HeavyWorkflowArgs): Promise<string> {
    log.info(`[WorkflowTwelve] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowTwelveUser-${args.clientName}`
    )
    log.info(`[WorkflowTwelve] Greeting: ${greeting}`)

    log.info(
        `[WorkflowTwelve] Delegating CPU-heavy task to specialized worker...`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF12-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowTwelve] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowTwelve] Delegating Memory-heavy task to specialized worker...`
    )
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF12-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowTwelve] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowTwelve for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowTwelve] ${finalMessage}`)
    return finalMessage
}
