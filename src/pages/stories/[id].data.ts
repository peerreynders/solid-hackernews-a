import { createResource } from 'solid-js';
import { fetchStory } from '../../lib/api';

import type { RouteDataFuncArgs } from 'solid-app-router';

function StoryData({ params }: RouteDataFuncArgs) {
  const source = () => Number(params.id);
  const [story] = createResource(source, fetchStory);

  return { story };
}

export type StoryDataType = ReturnType<typeof StoryData>;

export { StoryData };
