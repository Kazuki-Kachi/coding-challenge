export {}

declare global {
    interface Date {
        toISOStringWithoutTimePart: () => string
    }
}

Date.prototype.toISOStringWithoutTimePart = function () {
    return this.toISOString().split('T')[0]
}