export type User = {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
};

export type ItemType = 'job' | 'story' | 'comment' | 'poll' | 'pollopt';

export type Item = {
  id: number;
  deleted?: boolean;
  type?: ItemType;
  by?: string;
  time?: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
};

export type ItemNode = {
  item: Item;
  kids?: ItemNode[];
};

const STORIES_PER_PAGE = 30;

const UNITS_BY_SECONDS: [number, Intl.RelativeTimeFormatUnit][] = [
  [0, 'second'],
  [60, 'minute'],
  [3_600, 'hour'],
  [86_400, 'day'],
  [2_628_000, 'month'], // 86_400 * (365/12) (12 months in 365 days)
  [31_556_952, 'year'], // 86_400 * (400 * 365 + 97)/400 (in 400 years there are 97 leap days).
];

function getLocales() {
  if (!navigator) return [];

  if (Array.isArray(navigator.languages)) return navigator.languages;
  if (typeof navigator.language === 'string') return navigator.language;

  return [];
}

const relativeTimeFormat = new Intl.RelativeTimeFormat(getLocales(), {
  localeMatcher: 'best fit',
  numeric: 'always',
  style: 'long',
});

const mediumDateFormat = new Intl.DateTimeFormat(getLocales(), {
  dateStyle: 'medium',
});

function timeDifference(current: number, other: number): string {
  const difference = other - current;
  const value = difference >= 0 ? difference : -difference;

  let units = UNITS_BY_SECONDS.length - 1;
  for (let i = 1; i < UNITS_BY_SECONDS.length; ++i) {
    if (UNITS_BY_SECONDS[i][0] <= value) continue;

    units = i - 1;
    break;
  }

  const [secondsPerUnit, unit] = UNITS_BY_SECONDS[units];
  return relativeTimeFormat.format(
    Math.trunc(difference / secondsPerUnit),
    unit
  );
}

function currentTimeSeconds() {
  return Math.trunc(Date.now() / 1000);
}

function secondsToRelative(seconds: number | undefined) {
  return typeof seconds === 'number'
    ? timeDifference(currentTimeSeconds(), seconds)
    : '';
}

function secondsToDate(seconds: number) {
  return new Date(seconds * 1000);
}

function secondsToDateMedium(seconds: number) {
  return mediumDateFormat.format(secondsToDate(seconds));
}

function toHostname(url: string | undefined) {
  if (url == undefined) return '';

  try {
    return new URL(url).hostname.replace(/^(www\.)/, '');
  } catch (e) {
    console.log(url, e);
    return '';
  }
}

function toPageNumber(currentPage: string) {
  const pageValue = Number(currentPage);
  return Number.isNaN(pageValue) || pageValue < 1 ? 1 : pageValue;
}

function toPageInfo(entriesPerPage: number, entryCount: number, page: number) {
  const totalPages = Math.ceil(entryCount / entriesPerPage);
  const position = page < totalPages ? page : totalPages;
  if (position < 1) return [0, -1];

  const itemStartIndex = entriesPerPage * (position - 1);

  return [totalPages, itemStartIndex];
}

type WorkEntry = [
  item: Item | undefined,
  nextIndex: number,
  kids: number[],
  nodes: ItemNode[]
];

function toItemHierarchy(
  itemHolder: Map<number, Item>,
  ids: number[]
): ItemNode[] {
  const stack: WorkEntry[] = [[undefined, 0, ids.slice(), []]];

  while (moreEntries(stack)) {
    const top = stack[stack.length - 1];
    const [item, nextIndex, kids, nodes] = top;

    // (A) All kids resolved, push new node onto parent nodes
    if (nextIndex > kids.length) {
      stack.pop();
      if (item === undefined) continue;

      stack[stack.length - 1][3].push({
        item,
        kids: nodes,
      });
      continue;
    }

    const id = kids[nextIndex];
    top[1] += 1;
    const descendent = itemHolder.get(id);

    if (descendent === undefined) continue;
    if (descendent.deleted ?? false) continue;

    // (B) Push item with kids
    // onto the work stack
    if (descendent.kids && descendent.kids.length > 0) {
      stack.push([descendent, 0, descendent.kids, []]);
      continue;
    }

    // (C) Leaf item, just push it to the nodes
    nodes.push({
      item: descendent,
    });
  }

  return stack[0][3];
}

function moreEntries(stack: WorkEntry[]) {
  if (stack.length > 1) return true;

  const [, nextIndex, kids] = stack[0];
  return nextIndex < kids.length;
}

export {
  STORIES_PER_PAGE,
  currentTimeSeconds,
  secondsToDate,
  secondsToDateMedium,
  secondsToRelative,
  timeDifference,
  toHostname,
  toPageNumber,
  toPageInfo,
  toItemHierarchy,
};
