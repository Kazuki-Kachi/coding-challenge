export const omitKeys = <T, K extends keyof T>(target: T, ...keys:  K[]): Omit<T, K> => {
    if (!keys.length) return target

    const result = Object.assign({}, target)
    keys.forEach(property => delete result[property])

    return result
}