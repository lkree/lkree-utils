export enum SubscribeMethod {
  call = 'call',
}

export enum StoreControllerMethod {
  whenStateEqual = 'whenStateEqual',
  whenStateChange = 'whenStateChange',
}

export enum EqualityMethod {
  equal = 'equal',
  change = 'change',
}

export const defaultSubscribeOptions = { once: true };
