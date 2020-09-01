# test-preact-hooks ⚓️

Simple testing for preact hooks

![](https://img.shields.io/david/ignusg/test-preact-hooks.svg?style=flat)
![](https://img.shields.io/npm/dt/test-preact-hooks.svg?style=flat)
![](https://img.shields.io/npm/v/test-preact-hooks.svg?style=flat)
![](https://github.com/ignusg/test-preact-hooks/workflows/CI/badge.svg)

This is a fork of the awesome test-react-hooks library migrated to preact - [check it out](https://github.com/andrew-w-ross/test-react-hooks)

Example usage can be found at this sandbox

[![Edit examples](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/ignusg/test-preact-hooks/tree/master/examples?autoresize=1&module=%2Fcount.spec.js&previewwindow=tests)

## Contents

- [test-preact-hooks ⚓️](#test-preact-hooks-%E2%9A%93%EF%B8%8F)
  - [Contents](#contents)
  - [Get Started](#get-started)
  - [Api](#api)
    - [useTestProxy](#usetestproxy)
      - [Arguments](#arguments)
      - [Result](#result)
    - [cleanup](#cleanup)
    - [act](#act)

## Get Started

To install either :

`yarn add test-preact-hooks -D` or `npm i test-preact-hooks --save-dev`

`test-preact-hooks` needs a dom to work, if you're running jest you should be good to go. For anything else consult your testing framework of choice.

Example

```javascript
import { createTestProxy, cleanUp } from "test-preact-hooks";
import { useState } from "preact/hooks";

// Cleans up the dom container that's created during testing
// For jest users just add to setupFilesAfterEnv
afterEach(() => cleanUp());

// Create your hook
const useCounter = (initial = 0, inc = 1) => {
  const [count, setCount] = useState(initial);
  const inc = () => setCount(count + inc);
  return {
    count,
    inc,
  };
};

// Proxy of your hook, use it like you would in a component
// Internally calls render for the hook and act on everything else
const [prxCounter] = createTestProxy(useCounter);

it("will increment by one", () => {
  {
    const { count, inc } = prxCounter();
    expect(count).toBe(0);
    inc();
  }

  {
    const { count } = prxCounter();
    expect(count).toBe(1);
  }
});

it("start with a new initial amount", () => {
  {
    const { count, inc } = prxCounter(4);
    expect(count).toBe(4);
    inc();
  }

  {
    const { count } = prxCounter(4);
    expect(count).toBe(5);
  }
});

it("will increment by a new amount", () => {
  {
    const { count, inc } = prxCounter(0, 2);
    expect(count).toBe(0);
    inc();
  }

  {
    const { count } = prxCounter(0, 2);
    expect(count).toBe(2);
  }
});
```

## Api

### createTestProxy

`createTestProxy<THook, TProps = any>(hook: THook,options: UseProxyOptions<TProps> = {}) => [THook, HookControl<TProps>]`

Creates a proxy of the hook passed in for testing.

#### Arguments

- `hook` : hook to be tested

- `options` : optional options to render the hook with

  ```typescript
  /**
   * Options for createTestProxy
   *
   * @export
   * @interface UseProxyOptions
   * @template TProps
   */
  export interface UseProxyOptions<TProps> {
    /**
     * Component to wrap the test component in
     *
     * @type {ComponentType<TProps>}
     */
    wrapper?: ComponentType<TProps>;

    /**
     * Initial  props to render the wrapper component with
     */
    props?: TProps;

    /**
     * Toggle if result of hook should be wrapped in a proxy - set to true to check for strict equality
     */
    shallow?: boolean;
  }
  ```

#### Result

Tuple with the first element being a proxy hook and it's control object

`[THook, HookControl<TProps>]`

- `THook` - A proxy of the hook argument, each call to the hook will call render

- `HookControl<TProps>` - Control object for the proxy hook

  ```typescript
  /**
   * Control object for the proxy hook
   *
   * @export
   * @interface HookControl
   * @template TProps
   */
  export interface HookControl<TProps> {
    /**
     * Unmounts the test component
     * useful when testing the cleanup of useEffect or useLayoutEffect
     *
     * @memberof HookControl
     */
    unmount: () => void;
    /**
     * Updates the props to be used in the wrapper component
     * Does not cause a rerender, call the proxy hook to force that
     */
    props: TProps;
    /**
     * The container of the test component
     */
    readonly container: HTMLElement;
    /**
     * A promise that will resolve on update
     * Use when waiting for async effects to run
     */
    waitForNextUpdate: () => Promise<void>;
  }
  ```

If you chose to use `shallow: true` the result of the proxy will not be wrapped in a proxy. This can cause instability with complex hooks but can be used to check for strict equality (for example if a hook should return an exact object copy for `useMemo` or `useEffect` comparison).

### cleanup

`cleanUp():void`

Function to be called after your tests to clean up the container created during tests and unmount the hook.

### act

`act(callback: () => void):void`

Re-exported from [preact/test-utils](https://preactjs.com/guide/v10/unit-testing-with-enzyme/#triggering-state-updates-and-effects-with-act)

Use this if your updating the dom outside the hook.

For an example on correct usage check out [dom event example](./examples/domevent.test.js)
