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

export const WORKFLOW_ELEVEN_NAME = 'WorkflowTypeEleven'

export interface HeavyWorkflowArgs {
    clientName: string
    cpuIterations: number
    cpuYieldFrequency: number
    memoryArraySize: number
}

export async function workflowEleven(args: HeavyWorkflowArgs): Promise<string> {
    log.info(`[WorkflowEleven] Started for client: ${args.clientName}`, {
        ...args,
    })

    const greeting = await greetingActivity(
        `WorkflowElevenUser-${args.clientName}`
    )
    log.info(`[WorkflowEleven] Greeting: ${greeting}`)

    log.info(
        `[WorkflowEleven] Delegating CPU-heavy task to specialized worker...`
    )
    const cpuResult = await simulateCpuHeavyActivity(
        `WF11-CPU-${args.clientName}`,
        args.cpuIterations,
        args.cpuYieldFrequency
    )
    log.info(`[WorkflowEleven] CPU-heavy task result: ${cpuResult}`)

    log.info(
        `[WorkflowEleven] Delegating Memory-heavy task to specialized worker...`
    )
    const memoryResult = await simulateMemoryHeavyActivity(
        `WF11-Memory-${args.clientName}`,
        args.memoryArraySize
    )
    log.info(`[WorkflowEleven] Memory-heavy task result: ${memoryResult}`)

    const finalMessage = `WorkflowEleven for ${args.clientName} completed all tasks.`
    log.info(`[WorkflowEleven] ${finalMessage}`)
    return finalMessage
}
