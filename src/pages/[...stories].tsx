import { For, Show } from 'solid-js';
import { Link, useRouteData } from 'solid-app-router';
import { Story } from '../components/story';

import type { Item } from '../lib/helpers';
import type { StoriesDataType } from './[...stories].data';

// TypeScript doesn't understand `Show`
// so the non-null assertions become necessary
/* eslint-disable @typescript-eslint/no-non-null-assertion */

function Stories() {
  const { stories, name, page } = useRouteData<StoriesDataType>();

  return (
    <div class="news-view">
      <div class="news-list-nav">
        <Show
          when={page() > 1}
          fallback={
            <span class="page-link disabled" aria-hidden="true">
              &lt; prev
            </span>
          }
        >
          <Link
            class="page-link"
            href={`/${name()}?page=${page() - 1}`}
            aria-label="Previous Page"
          >
            &lt; prev
          </Link>
        </Show>
        <span>page {page()}</span>
        <Show
          when={stories() && page() < stories()!.pageCount}
          fallback={
            <span class="page-link-disabled" aria-hidden="true">
              more &gt;
            </span>
          }
        >
          <Link
            class="page-link"
            href={`/${name()}?page=${page() + 1}`}
            aria-label="Next Page"
          >
            more &gt;
          </Link>
        </Show>
      </div>
      <main class="news-list">
        <Show when={stories()}>
          <ul>
            <For each={stories()!.items}>
              {(story: Item) => <Story item={story} />}
            </For>
          </ul>
        </Show>
      </main>
    </div>
  );
}
/* eslint-enable @typescript-eslint/no-non-null-assertion */

export { Stories as default };
