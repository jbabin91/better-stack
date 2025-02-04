import { observable } from '@legendapp/state';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';
import { observer, use$ } from '@legendapp/state/react';
import { syncObservable } from '@legendapp/state/sync';
import { Button, ModeToggle } from '@repo/ui';
import { createFileRoute } from '@tanstack/react-router';
import reactLogo from '@web/assets/react.svg';

import viteLogo from '/vite.svg';

const state$ = observable({
  count: 0,
  doubleCount: () => state$.count.get() * 2,
});

syncObservable(state$, {
  persist: {
    name: 'state',
    plugin: ObservablePersistLocalStorage,
  },
});

const RouteComponent = observer(function RouteComponent() {
  const count = use$(state$.count);
  const doubleCount = use$(state$.doubleCount);

  return (
    <>
      <div className="flex justify-center">
        <a href="https://vite.dev" rel="noreferrer" target="_blank">
          <img alt="Vite logo" className="logo" src={viteLogo} />
        </a>
        <a href="https://react.dev" rel="noreferrer" target="_blank">
          <img alt="React logo" className="logo react" src={reactLogo} />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="p-[2em]">
        <div className="flex justify-center space-x-2">
          <Button onClick={() => state$.count.set(count - 1)}>-1</Button>
          <Button onClick={() => state$.count.set(count + 1)}>+1</Button>
          <Button variant="destructive" onClick={() => state$.count.set(0)}>
            Clear
          </Button>
          <ModeToggle />
        </div>
        <p className="mt-4">Count is {count}</p>
        <p className="mt-4">Double count is {doubleCount}</p>
        <p className="mt-4">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-[#888]">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
});

export const Route = createFileRoute('/')({
  component: RouteComponent,
});
