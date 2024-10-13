import { type MutableRefObject, useLayoutEffect, useRef } from 'react';

import type { Nullable } from 'lkree-common-utils';

import { useShow } from '~/shared/lib/hooks';

import { initHoc } from './initHoc';

export const WithDownload = <T extends () => Promise<any>, K extends Awaited<ReturnType<T>>>({
  downloadFn,
  onError,
  onSuccess,
  passDataToComponent,
}: {
  downloadFn: T;
  onSuccess?: (data: K) => any;
  onError?: (e: Error, show: () => void) => any;
  passDataToComponent?: boolean;
}) =>
  initHoc<void, { data?: T }>(({ baseComponent, ...props }) => {
    const Component = baseComponent;
    const { isShow, show } = useShow(false);
    const data = useRef(null) as MutableRefObject<Nullable<K>>;

    useLayoutEffect(() => {
      downloadFn()
        .then(d => {
          onSuccess?.(d);

          if (passDataToComponent) data.current = d;
        })
        .then(show)
        .catch(e => onError?.(e, show));
    }, []);

    if (!isShow) return null;

    return <Component {...props} {...(passDataToComponent && { data: data.current })} />;
  });
