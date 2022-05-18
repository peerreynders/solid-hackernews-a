import { For, Show, createSignal } from 'solid-js';
import { Link } from 'solid-app-router';
import { secondsToRelative } from '../lib/helpers';
import type { ItemNode } from '../lib/helpers';

const childrenId: (id: number) => string = (id) => `comment-children-${id}`;

function renderToggle(expanded: boolean, count: number) {
  return expanded
    ? '[-]'
    : `[+]  ${count} ${count === 1 ? 'reply' : 'replies'} collapsed`;
}

const negate: (v: boolean) => boolean = (value) => !value;

// TypeScript doesn't understand `Show`
// so the non-null assertions become necessary
/* eslint-disable @typescript-eslint/no-non-null-assertion */

function Comment(props: { comment: ItemNode }) {
  const [expanded, setExpanded] = createSignal(true);
  const toggleExpanded = () => setExpanded(negate);

  return (
    <li class="comment">
      <div class="by">
        <Link href={`/users/${props.comment.item.by}`}>
          {props.comment.item.by}
        </Link>{' '}
        {secondsToRelative(props.comment.item.time)}
      </div>
      <div class="text" innerHTML={props.comment.item.text} />
      <Show when={(props.comment.kids?.length ?? 0) > 0}>
        <div class="toggle" classList={{ open: expanded() }}>
          <a
            onClick={toggleExpanded}
            aria-expanded={expanded()}
            aria-controls={childrenId(props.comment.item.id)}
          >
            {renderToggle(expanded(), props.comment.kids!.length)}
          </a>
        </div>
        <ul
          class="comment-children"
          classList={{ ['comment-children-collapsed']: !expanded() }}
          id={childrenId(props.comment.item.id)}
        >
          <For each={props.comment.kids}>
            {(node) => <Comment comment={node} />}
          </For>
        </ul>
      </Show>
    </li>
  );
}

/* eslint-enable @typescript-eslint/no-non-null-assertion */

export { Comment };
