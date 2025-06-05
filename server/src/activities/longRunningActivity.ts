export async function simulateLongTaskActivity(
    taskName: string,
    durationMs: number
): Promise<string> {
    console.log(
        `[Activity: ${taskName}] Starting. Will simulate work for ${
            durationMs / 1000
        } seconds.`
    )

    await new Promise((resolve) => setTimeout(resolve, durationMs))

    const resultMessage = `[Activity: ${taskName}] Completed after ${
        durationMs / 1000
    } seconds.`
    console.log(resultMessage)
    return resultMessage
}
