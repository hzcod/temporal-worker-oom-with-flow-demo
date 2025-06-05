export async function greetingActivity(name: string): Promise<string> {
    // Start timing for specific activity execution
    const activityLabel = `greetingActivity for ${name}`
    console.time(activityLabel)
    console.log(`[Server Activity] Performing greeting for ${name}`)

    // End timing for activity
    console.timeEnd(activityLabel)
    return `Hello ${name}, from the Temporal Workflow`
}
