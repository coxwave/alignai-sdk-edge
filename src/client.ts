import {v4 as uuidv4} from 'uuid';
import {defaultApiHost} from "./consts";
import {Event} from "./events";

export class AlignAI {
    private readonly baseUrl: string;
    private readonly projectId: string;
    private readonly apiKey: string;

    constructor(projectId?: string, apiKey?: string, apiHost?: string) {
        this.baseUrl = apiHost ?? defaultApiHost;
        this.projectId = projectId ?? process.env.ALIGNAI_PROJECT_ID ?? '';
        this.apiKey = apiKey ?? process.env.ALIGNAI_API_KEY ?? '';
    }

    public async collectEvents(...events: Event[]): Promise<void> {
        await fetch(`${this.baseUrl}/ingestion.v1alpha.IngestionService/CollectEvents`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Connect-Protocol-Version': '1',
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                requestId: uuidv4(),
                events: events.map((event) => {
                    const obj = event.toCompatPayload();
                    obj.projectId = this.projectId;
                    return obj;
                }),
            }),
        });
    }
}