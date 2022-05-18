import { STORIES_PER_PAGE, toItemHierarchy, toPageInfo } from './helpers';
import type { Item, User } from './helpers';

// Hacker News API
// https://github.com/HackerNews/API
//
// Hacker News (unofficial) API
// https://github.com/cheeaun/node-hnapi

function fromJsonResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json() as Promise<T>;
}

function fetchApi<T>(url: string): Promise<T> {
  return fetch(url).then<T>(fromJsonResponse);
}

function fetchItem(id: number) {
  return fetchApi<Item>(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  );
}

function fetchUser(id: string) {
  return fetchApi<User>(
    `https://hacker-news.firebaseio.com/v0/user/${id}.json`
  );
}

const maxConcurrency = 5;

const STORIES = {
  top: 0,
  new: 1,
  best: 2,
  ask: 3,
  show: 4,
  job: 5,
} as const;

type TypeStories = typeof STORIES;
export type StoryKind = TypeStories[keyof TypeStories];

type KindEntry = [StoryKind, string];

const kindEntries = (function () {
  const entries = Object.entries(STORIES).map(([name, kind]) => [
    kind,
    name,
  ]) as KindEntry[];
  const byKindAsc: (x: KindEntry, y: KindEntry) => number = ([a], [b]) => a - b;

  return entries.sort(byKindAsc);
})();

const kindToName = new Map(kindEntries);

const defaultStoriesName = kindEntries[0][1];

function fetchStories(kind: StoryKind) {
  const name = kindToName.get(kind) ?? defaultStoriesName;
  return fetchApi<number[]>(
    `https://hacker-news.firebaseio.com/v0/${name}stories.json`
  );
}

export type AllItems = Item[];

function fetchAllItems(ids: number[]) {
  const result: AllItems = [];
  let index = 0;

  const takeId = () => (index < ids.length ? ids[index++] : undefined);
  const next: (i: Item) => void = (item) => result.push(item);

  return fetchItemsConcurrent<AllItems>(takeId, next, () => result);
}

export type DeepItems = Map<number, Item>;

function fetchDeepItems(ids: number[]) {
  const source = ids.slice();
  const result: DeepItems = new Map();
  let index = 0;

  const takeId = () => (index < source.length ? source[index++] : undefined);
  const next: (i: Item) => void = (item) => {
    result.set(item.id, item);
    if (item.kids && item.kids.length > 0) source.push(...item.kids);
  };

  return fetchItemsConcurrent<DeepItems>(takeId, next, () => result);
}

type FetchPair = [Promise<FetchPair>, Item];
type FetchPromise = Promise<FetchPair>;
type FetchSet = Set<FetchPromise>;

async function fetchItemsConcurrent<T>(
  takeId: () => number | undefined,
  next: (i: Item) => void,
  complete: () => T
) {
  const fetching: FetchSet = new Set();
  for (let id = takeId(); id || fetching.size > 0; ) {
    if (id && fetching.size < maxConcurrency) {
      const promise: FetchPromise = fetchItem(id).then((item) => [
        promise,
        item,
      ]);
      fetching.add(promise);
      id = takeId();
      continue;
    }

    const [promise, item] = await Promise.race(fetching);
    fetching.delete(promise);
    next(item);
    if (!id) id = takeId();
  }

  return complete();
}

export type KindPagePair = [StoryKind, number];

async function fetchStoriesPage([kind, page]: KindPagePair) {
  const ids = await fetchStories(kind);
  const [pageCount, itemIndex] = toPageInfo(STORIES_PER_PAGE, ids.length, page);

  if (itemIndex < 0)
    return {
      items: [],
      pageCount,
    };

  const items = await fetchAllItems(
    ids.slice(itemIndex, itemIndex + STORIES_PER_PAGE)
  );

  return {
    items,
    pageCount,
  };
}

async function fetchStory(id: number) {
  const holder = await fetchDeepItems([id]);

  const item = holder.get(id);
  const comments =
    item && item.kids && item.kids.length > 0
      ? toItemHierarchy(holder, item.kids)
      : undefined;

  return {
    item,
    comments,
  };
}

export {
  fetchItem,
  fetchUser,
  fetchStories,
  fetchAllItems,
  fetchDeepItems,
  fetchStoriesPage,
  fetchStory,
  STORIES,
};
