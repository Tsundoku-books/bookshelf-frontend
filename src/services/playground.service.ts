import api from './api';
import type { PlaygroundBug, PlaygroundBugsResponse } from '../types/playground';

export const playgroundService = {
  async list(): Promise<PlaygroundBug[]> {
    const { data } = await api.get<PlaygroundBugsResponse>('/playground/bugs');
    return data.bugs;
  },

  /** Replaces the whole set of bugs switched on for the signed-in account. */
  async setEnabled(enabled: string[]): Promise<PlaygroundBug[]> {
    const { data } = await api.put<PlaygroundBugsResponse>('/playground/bugs', { enabled });
    return data.bugs;
  },
};
