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
            // Yield to the event loop to allow other things to run (like heartbeating)
            // This is important for long-running CPU-bound tasks in Node.js
            // console.log(`[Activity: ${taskName}] Yielding at iteration ${i}...`)
            Context.current().heartbeat(`Processed ${i} iterations`)
            await new Promise(setImmediate) // Yields execution to the event loop
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
        // Create a large array and fill it.
        // Each number in JavaScript typically takes 8 bytes.
        // So, an array of 1 million numbers is roughly 8MB.
        // Be careful with very large sizes here, as it can easily crash the process.
        const largeArray: number[] = []
        for (let i = 0; i < arraySize; i++) {
            largeArray.push(Math.random() * 1000) // Fill with some data
        }

        // Optional: Do something with the array to ensure it's not optimized away too easily,
        // though just holding it in memory is often enough for simulation.
        const sum = largeArray.reduce((acc, val) => acc + val, 0)

        const durationMs = Date.now() - startTime
        // Clear the array to free memory explicitly, though it should be garbage collected
        // when it goes out of scope after the activity finishes.
        // largeArray.length = 0; // Not strictly necessary but can be a hint

        const message = `[Activity: ${taskName}] Memory-heavy task completed in ${durationMs}ms. Array sum: ${sum}. Array held ${arraySize} elements.`
        console.log(message)
        return message
    } catch (error) {
        const durationMs = Date.now() - startTime
        const errorMessage = `[Activity: ${taskName}] ERROR during memory-heavy task after ${durationMs}ms: ${error}`
        console.error(errorMessage)
        throw error // Re-throw the error so Temporal knows the activity failed
    }
}
