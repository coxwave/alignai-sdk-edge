import {CustomProperties, CustomPropertyValue} from "./events";

export function rfc3339Now(): string {
    return new Date().toISOString();
}

/**
 * NOTE(@nyanxyz): `CustomPropertyMessage` needs to inherit from `Record<string, string>` to be recognized as a `CompatPayload`.
 * @see https://stackoverflow.com/questions/37006008/typescript-index-signature-is-missing-in-type
 */
interface CustomPropertyMessage extends Record<string, CustomPropertyValue> {
    stringValue: string
}

export function serializeCustomProperties(props: CustomProperties) {
    return Object.entries(props).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
            acc[key] = { stringValue: value };
        }

        return acc;
    }, {} as Record<string, CustomPropertyMessage>);
}