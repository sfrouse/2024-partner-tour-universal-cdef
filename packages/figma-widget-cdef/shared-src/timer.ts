export function wait(timeout: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

export default async function timer(durationInSeconds: number): Promise<void> {
    console.log('Timer started...');
    for (let i = durationInSeconds; i > 0; i--) {
        console.log(`${i} seconds remaining...`);
        await wait(1000); // Wait for 1 second
    }
    console.log('Timer ended.');
}