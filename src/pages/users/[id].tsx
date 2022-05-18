import { Show } from 'solid-js';
import { useRouteData } from 'solid-app-router';
import { secondsToDateMedium } from '../../lib/helpers';

import type { UserDataType } from './[id].data';

const userSubmissionsUrl: (id: string) => string = (id) =>
  `https://news.ycombinator.com/submitted?id=${id}`;
const userThreadsUrl: (id: string) => string = (id) =>
  `https://news.ycombinator.com/threads?id=${id}`;

// TypeScript doesn't understand `Show`
// so the non-null assertions become necessary
/* eslint-disable @typescript-eslint/no-non-null-assertion */

function User() {
  const user = useRouteData<UserDataType>();

  return (
    <Show when={user() !== undefined}>
      <div class="user-view">
        <Show
          when={!user.error && user() !== null}
          fallback={<h1>User not found.</h1>}
        >
          <h1>User : {user()!.id}</h1>
          <ul class="meta">
            <li>
              <span class="label">Created:</span>{' '}
              {secondsToDateMedium(user()!.created)}
            </li>
            <li>
              <span class="label">Karma:</span> {user()!.karma}
            </li>
            <Show when={user()!.about}>
              <li innerHTML={user()!.about} class="about" />{' '}
            </Show>
          </ul>
          <p class="links">
            <a href={userSubmissionsUrl(user()!.id)}>submissions</a> |{' '}
            <a href={userThreadsUrl(user()!.id)}>comments</a>
          </p>
        </Show>
      </div>
    </Show>
  );
}
/* eslint-enable @typescript-eslint/no-non-null-assertion */

export { User as default };
