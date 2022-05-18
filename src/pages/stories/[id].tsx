import { For, Show } from 'solid-js';
import { Link, useRouteData } from 'solid-app-router';
import { secondsToRelative, toHostname } from '../../lib/helpers';
import { Comment } from '../../components/comment';

import type { StoryDataType } from './[id].data';

// TypeScript doesn't understand `Show`
// so the non-null assertions become necessary
/* eslint-disable @typescript-eslint/no-non-null-assertion */

function Story() {
  const { story } = useRouteData<StoryDataType>();

  return (
    <Show when={story()}>
      <div class="item-view">
        <div class="item-view-header">
          <Show
            when={story()!.item!.url}
            fallback={<h1>{story()!.item!.title}</h1>}
          >
            <a href={story()!.item!.url} target="_blank">
              <h1>{story()!.item!.title}</h1>
            </a>
            <span class="host">({toHostname(story()!.item!.url)})</span>
          </Show>
          <p class="meta">
            {story()!.item!.score} points | by{' '}
            <Link href={`/users/${story()!.item!.by}`}>
              {story()!.item!.by}
            </Link>{' '}
            {secondsToRelative(story()?.item?.time)}
          </p>
        </div>
        <div class="item-view-comments">
          <p class="item-view-comments-header">
            {story()!.item!.descendants
              ? story()!.item!.descendants + ' comments'
              : 'No comments yet.'}
          </p>
          <ul class="comment-children">
            <For each={story()!.comments}>
              {(node) => <Comment comment={node} />}
            </For>
          </ul>
        </div>
      </div>
    </Show>
  );
}

/* eslint-enable @typescript-eslint/no-non-null-assertion */

export { Story as default };
