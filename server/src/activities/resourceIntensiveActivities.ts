import { Context } from '@temporalio/activity'

export async function simulateCpuHeavyActivity(
    taskName: string,
    iterations: number,
    yieldFrequency: number
): Promise<string> {
    console.log(
        `[Activity: ${taskName}] Starting CPU-heavy task with ${iterations} iterations.`
    )
    const startTime = Date.now()
    let result = 0

    for (let i = 0; i < iterations; i++) {
        result += Math.sqrt(i) * Math.sin(i) - Math.cos(i) * Math.tan(i)
        if (i > 0 && i % yieldFrequency === 0) {
            Context.current().heartbeat(`Processed ${i} iterations`)
            await new Promise(setImmediate)
        }
    }

    const durationMs = Date.now() - startTime
    const message = `[Activity: ${taskName}] CPU-heavy task completed in ${durationMs}ms. Result: ${result}`
    console.log(message)
    return message
}

export async function simulateMemoryHeavyActivity(
    taskName: string,
    arraySize: number
): Promise<string> {
    console.log(
        `[Activity: ${taskName}] Starting memory-heavy task, creating array of size ${arraySize}.`
    )
    const startTime = Date.now()

    try {
        const largeArray: number[] = []
        for (let i = 0; i < arraySize; i++) {
            largeArray.push(Math.random() * 1000)
        }

        const sum = largeArray.reduce((acc, val) => acc + val, 0)

        const durationMs = Date.now() - startTime

        const message = `[Activity: ${taskName}] Memory-heavy task completed in ${durationMs}ms. Array sum: ${sum}. Array held ${arraySize} elements.`
        console.log(message)
        return message
    } catch (error) {
        const durationMs = Date.now() - startTime
        const errorMessage = `[Activity: ${taskName}] ERROR during memory-heavy task after ${durationMs}ms: ${error}`
        console.error(errorMessage)
        throw error
    }
}
