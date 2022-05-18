# solid-hackernews-a
Work in progress (permanently?). 

After completing the [tutorial](https://www.solidjs.com/tutorial) rebuilding [solidjs/solid-hackernews](https://github.com/solidjs/solid-hackernews) from the ground up seemed like a way to get a guided tour to structuring an application.

## Objectives:

* Use TypeScript (transpilation first/type checking later)
* Use [Official Hacker News API](https://github.com/HackerNews/API) only rather than the [unofficial one](https://github.com/cheeaun/node-hnapi) (this will result in a waterfall of requests degrading client-side performance which is why the unofficial API is used in the original).

## Notes
* Started with `$ npx degit solidjs/templates/ts solid-hackernews-a`
* Added [Prettier](https://prettier.io/) and [ESlint](https://eslint.org/).
* The updated API access code can be found in [`src/lib/api.ts`](https://github.com/peerreynders/solid-hackernews-a/blob/main/src/lib/api.ts) with some supporting code in [`src/lib/helpers.ts`](https://github.com/peerreynders/solid-hackernews-a/blob/main/src/lib/helpers.ts).
* The application entry point is at [`src/index.tsx`](https://github.com/peerreynders/solid-hackernews-a/blob/main/src/index.tsx).
* [`solid-app-router`](https://github.com/solidjs/solid-app-router) is used for client side routing. The [config based routing](https://github.com/solidjs/solid-app-router#config-based-routing) is found in [`src/routes.ts`](https://github.com/peerreynders/solid-hackernews-a/blob/main/src/routes.ts).
  * Stories route: [`src/pages/[...stories].data.ts`](https://github.com/peerreynders/solid-hackernews-a/blob/main/src/pages/[...stories].data.ts) fetches for [`src/pages/[...stories].tsx`](https://github.com/peerreynders/solid-hackernews-a/blob/main/src/pages/[...stories].tsx).
  * Story route: [`src/pages/stories/[id].data.ts`](https://github.com/peerreynders/solid-hackernews-a/blob/main/src/pages/stories/[id].data.ts) fetches for [`src/pages/stories/[id].tsx`](https://github.com/peerreynders/solid-hackernews-a/blob/main/src/pages/stories/[id].tsx).
  * User route: [`src/pages/users/[id].data.ts`](https://github.com/peerreynders/solid-hackernews-a/blob/main/src/pages/users/[id].data.ts) fetches for [`src/pages/users/[id].tsx`](https://github.com/peerreynders/solid-hackernews-a/blob/main/src/pages/users/[id].tsx).
  
Clone the repo:
  ```
$ cd solid-hackernews-a
$ npm i
$ npm run dev
  ```
