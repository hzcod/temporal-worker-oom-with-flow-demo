import { proxyActivities } from '@temporalio/workflow'
import type * as allActivities from '../activities'

const { greetingActivity, simulateLongTaskActivity } = proxyActivities<
    typeof allActivities
>({
    startToCloseTimeout: '5 minute',
})

export const WORKFLOW_TWO_NAME = 'WorkflowTypeTwo'

export async function workflowTwo(clientNameArgument: string): Promise<string> {
    console.log(
        `[WorkflowTwo] Started for client argument: ${clientNameArgument}`
    )

    const greetingResult = await greetingActivity(
        `WorkflowTwoUser-${clientNameArgument}`
    )
    console.log(`[WorkflowTwo] Greeting result: ${greetingResult}`)

    const threeMinutesInMs = 3 * 60 * 1000
    console.log(
        `[WorkflowTwo] About to start a long task for approximately 3 minutes.`
    )
    const longTaskResult = await simulateLongTaskActivity(
        'WF2-MainTask',
        threeMinutesInMs
    )
    console.log(`[WorkflowTwo] Long task result: ${longTaskResult}`)

    const finalMessage = `WorkflowTwo for ${clientNameArgument} completed. Greeting: ${greetingResult}. Long Task: ${longTaskResult}`
    console.log(`[WorkflowTwo] Completed. Final Message: ${finalMessage}`)
    return finalMessage
}
