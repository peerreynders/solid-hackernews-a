import { Show } from 'solid-js';
import { Link } from 'solid-app-router';
import { secondsToRelative, toHostname } from '../lib/helpers';
import type { Item } from '../lib/helpers';

function Story(props: { item: Item }) {
  return (
    <li class="news-item">
      <span class="score">{props.item.score}</span>
      <span class="title">
        <Show
          when={props.item.url}
          fallback={
            <Link href={`/stories/${props.item.id}`}>{props.item.title}</Link>
          }
        >
          <a href={props.item.url} target="_blank" rel="noreferrer">
            {props.item.title}
          </a>
          <span class="host"> ({toHostname(props.item.url)})</span>
        </Show>
      </span>
      <br />
      <span class="meta">
        <Show
          when={props.item.type !== 'job'}
          fallback={
            <Link href={`/stories/${props.item.id}`}>
              {secondsToRelative(props.item.time)}
            </Link>
          }
        >
          by <Link href={`/users/${props.item.by}`}>{props.item.by}</Link>{' '}
          {secondsToRelative(props.item.time)} |{' '}
          <Link href={`/stories/${props.item.id}`}>
            {props.item.descendants
              ? `${props.item.descendants} comments`
              : 'discuss'}
          </Link>
        </Show>
      </span>
      <Show when={props.item.type === 'job'}>
        {' '}
        <span class="label">{props.item.type}</span>
      </Show>
    </li>
  );
}

export { Story };
