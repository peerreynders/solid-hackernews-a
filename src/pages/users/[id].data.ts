import { createResource } from 'solid-js';
import { fetchUser } from '../../lib/api';

import type { RouteDataFuncArgs } from 'solid-app-router';

function UserData({ params }: RouteDataFuncArgs) {
  const [user] = createResource(params.id, fetchUser);

  return user;
}

export type UserDataType = ReturnType<typeof UserData>;

export { UserData };
