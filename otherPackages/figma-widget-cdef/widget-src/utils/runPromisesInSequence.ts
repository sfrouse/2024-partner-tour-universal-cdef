

export default async function runPromisesInSequence (
    promises: (() => Promise<any>)[]
) {
    return promises.reduce(
        (promiseChain, currentTask) => {
            return promiseChain.then(currentTask);
        },
        Promise.resolve()
    );
};