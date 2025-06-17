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

export const WORKFLOW_TEN_NAME = 'WorkflowTypeTen'

export interface HeavyWorkflowArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowTen(args: HeavyWorkflowArgs): Promise<string> {
    log.info(`[WorkflowTen] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowTenUser-${args.clientName}`
    )
    log.info(`[WorkflowTen] Greeting: ${greeting}`)

    log.info(`[WorkflowTen] Delegating CPU-heavy task to specialized worker...`)
    const cpuResult = await simulateCpuHeavyActivity(
        `WF10-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowTen] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowTen] Delegating Memory-heavy task to specialized worker...`
    )
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF10-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowTen] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowTen for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowTen] ${finalMessage}`)
    return finalMessage
}
