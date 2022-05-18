import { createResource } from 'solid-js';
import { STORIES, fetchStoriesPage } from '../lib/api';
import { toPageNumber } from '../lib/helpers';

import type { RouteDataFuncArgs } from 'solid-app-router';
import type { StoryKind, KindPagePair } from '../lib/api';

const STORIES_DEFAULT = 'top';

const mapStories: Record<string, StoryKind> = {
  [STORIES_DEFAULT]: STORIES.top,
  new: STORIES.new,
  show: STORIES.show,
  ask: STORIES.ask,
  job: STORIES.job,
};

function StoriesData(args: RouteDataFuncArgs) {
  const page = () => toPageNumber(args.location.query['page']);
  const name = () => args.params.stories || STORIES_DEFAULT;
  const source: () => KindPagePair = () => [mapStories[name()], page()];
  const [stories] = createResource(source, fetchStoriesPage);

  return { stories, name, page };
}

export type StoriesDataType = ReturnType<typeof StoriesData>;

export { StoriesData };
