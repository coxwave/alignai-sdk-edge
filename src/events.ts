import {v4 as uuidv4} from 'uuid';
import {defaultAssistantId} from "./consts";
import {CustomProperties, rfc3339Now, serializeCustomProperties} from "./utils";

export interface Event {
    toCompatPayload(): CompatPayload;
}

export interface CompatPayload {
    [key: string]: string | number | boolean | null | undefined | CompatPayload;
}

export interface OpenSessionEventProps {
    sessionId: string;
    userId: string;
    assistantId?: string;
    sessionTitle?: string;
    customProperties?: CustomProperties;
}

export class OpenSessionEvent implements Event {
    private readonly event: CompatPayload;
    constructor(props: OpenSessionEventProps) {
        this.event = {
            id: uuidv4(),
            type: 'session_open',
            createTime: rfc3339Now(),
            properties: {
                sessionProperties: {
                    sessionId: props.sessionId,
                    sessionTitle: props.sessionTitle ?? '',
                    sessionStartTime: rfc3339Now(),
                    userId: props.userId,
                    assistantId: props.assistantId ?? defaultAssistantId,
                },
                customProperties: props.customProperties ? serializeCustomProperties(props.customProperties) : undefined,
            }
        };
    }

    toCompatPayload(): CompatPayload {
        return this.event;
    }
}

export interface CreateMessageEventProps {
    sessionId: string;
    messageIndex: number;
    messageRole: 'user' | 'assistant';
    messageContent: string;
    customProperties?: CustomProperties;
}

export class CreateMessageEvent implements Event {
    private readonly event: CompatPayload;
    constructor(props: CreateMessageEventProps) {
        this.event = {
            id: uuidv4(),
            type: 'message_create',
            createTime: rfc3339Now(),
            properties: {
                messageProperties: {
                    sessionId: props.sessionId,
                    messageIndexHint: props.messageIndex,
                    messageRole: props.messageRole === 'user' ? 'ROLE_USER' : 'ROLE_ASSISTANT',
                    messageContent: props.messageContent,
                },
                customProperties: props.customProperties ? serializeCustomProperties(props.customProperties) : undefined,
            }
        };
    }

    toCompatPayload(): CompatPayload {
        return this.event;
    }
}

export interface CloseSessionEventProps {
    sessionId: string;
}

export class CloseSessionEvent implements Event {
    private readonly event: CompatPayload;
    constructor(props: CloseSessionEventProps) {
        this.event = {
            id: uuidv4(),
            type: 'session_close',
            createTime: rfc3339Now(),
            properties: {
                sessionProperties: {
                    sessionId: props.sessionId,
                },
            }
        };
    }

    toCompatPayload(): CompatPayload {
        return this.event;
    }
}

export interface IdentifyUserEventProps {
    userId: string;
    userDisplayName?: string;
    userEmail?: string;
    userIp?: string;
    userCountryCode?: string;
    userCreateTime?: Date;
    customProperties?: CustomProperties;
}

export class IdentifyUserEvent implements Event {
    private readonly event: CompatPayload;
    constructor(props: IdentifyUserEventProps) {
        this.event = {
            id: uuidv4(),
            type: 'user_recognize',
            createTime: rfc3339Now(),
            properties: {
                userProperties: {
                    userId: props.userId,
                    userDisplayName: props.userDisplayName ?? '',
                    userEmail: props.userEmail ?? '',
                    userIp: !props.userCountryCode && props.userIp ? props.userIp : '',
                    userLocation: props.userCountryCode ? {
                        countryCode: props.userCountryCode,
                    } : undefined,
                    userCreateTime: props.userCreateTime ? props.userCreateTime.toISOString() : rfc3339Now(),
                },
                customProperties: props.customProperties ? serializeCustomProperties(props.customProperties) : undefined,
            }
        };
    }

    toCompatPayload(): CompatPayload {
        return this.event;
    }
}