import {CompatPayload} from "./events";

export function rfc3339Now(): string {
    return new Date().toISOString();
}

interface CustomPropertyValue extends CompatPayload {
    stringValue: string
}

export type CustomProperties = Record<string, string>;

export function serializeCustomProperties(props: CustomProperties) {
    return Object.entries(props).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
            acc[key] = { stringValue: value };
        }

        return acc;
    }, {} as Record<string, CustomPropertyValue>);
}