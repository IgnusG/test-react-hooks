function isPrimitive(value: any) {
  if (value == null) return true;

  if (value instanceof Date) return true;

  if (value instanceof Promise) return true;

  return typeof value !== "function" && typeof value !== "object";
}

/**
 * Describes a function that will take a target and then have a callback that does something to the target
 */
export type WrapFn = (target: any, cb: () => void) => any;

export function wrapProxy<T>(target: T, wrapFn: WrapFn, options: WrapProxyOptions = {}): T {
  return isPrimitive(target)
    ? target
    : new Proxy(target, createHandler(wrapFn, options));
}

export interface WrapProxyOptions {
  shallow?: boolean;
}

export function createHandler(wrapFn: WrapFn, options: WrapProxyOptions = {}): ProxyHandler<any> {
  const { shallow = false } = options;

  return {
    get(target: any, property: any, receiver: any) {
      const descriptor = Reflect.getOwnPropertyDescriptor(target, property);
      const result = Reflect.get(target, property, receiver);

      return descriptor && descriptor.configurable
        ? wrapProxy(result, wrapFn, options)
        : result;
    },
    apply(target: any, thisArg: any, argumentsList: any) {
      let result;
      wrapFn(target, () => {
        result = Reflect.apply(target, thisArg, argumentsList);
      });

      if (shallow) {
        return result;
      } else {
        return wrapProxy(result, wrapFn, options);
      }
    }
  };
}
