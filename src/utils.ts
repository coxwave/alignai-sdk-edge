export function rfc3339Now(): string {
    return new Date().toISOString();
}