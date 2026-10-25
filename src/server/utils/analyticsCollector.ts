// Analytics Telemetry Collector
export interface AnalyticsEventPayload {
  event: string;
  timestamp: string;
  url?: string;
  properties?: Record<string, any>;
  ipAnonymized?: string;
}

export class AnalyticsCollector {
  private static events: AnalyticsEventPayload[] = [];

  static record(event: AnalyticsEventPayload): boolean {
    if (!event.event || typeof event.event !== 'string') {
      return false;
    }

    const sanitizedEvent: AnalyticsEventPayload = {
      event: event.event.slice(0, 64),
      timestamp: event.timestamp || new Date().toISOString(),
      url: event.url ? event.url.slice(0, 256) : undefined,
      properties: event.properties || {},
      ipAnonymized: event.ipAnonymized
    };

    this.events.push(sanitizedEvent);
    if (this.events.length > 5000) {
      this.events.shift(); // Keep bounded memory buffer
    }
    return true;
  }

  static getMetricsSummary(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const e of this.events) {
      counts[e.event] = (counts[e.event] || 0) + 1;
    }
    return counts;
  }

  static getAll(): AnalyticsEventPayload[] {
    return [...this.events];
  }

  static clear(): void {
    this.events = [];
  }
}
