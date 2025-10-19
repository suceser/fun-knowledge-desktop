export interface StorageEventData {
    event: StorageEvent;
    key?: string;
    value?: unknown;
    error?: string;
}