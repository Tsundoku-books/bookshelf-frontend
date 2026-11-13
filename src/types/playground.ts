export type BugLayer = 'api' | 'ui';

export interface PlaygroundBug {
  id: string;
  layer: BugLayer;
  area: string;
  enabled: boolean;
}

export interface PlaygroundBugsResponse {
  message?: string;
  bugs: PlaygroundBug[];
}
