import { call, Props, createCall } from './call';

export enum Methods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export type CallParamsWithoutMethod<M extends Methods, UrlParams = any> = Omit<Props, 'options'> & {
  options: Omit<NonNullable<Props['options']>, 'method'> & {
    method: M;
    headers?: Record<string, any>;
    stringifyBody?: boolean;
  };
  urlParams?: UrlParams;
};

export type Method<M extends Methods = Methods, Request = any, Response = any> = (
  props: CallParamsWithoutMethod<M, Request>
) => Promise<Response>;

export const method: Method = props => call({ ...props });

export const createMethod = (...createCallParams: Parameters<typeof createCall>): Method => {
  const callInstance = createCall(...createCallParams);

  return props => callInstance({ ...props });
};
