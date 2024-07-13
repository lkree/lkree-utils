import { useLayoutEffect, useRef } from 'react';

import { useShow } from '~/shared/lib/hooks';

import { initHoc } from './initHoc';

export const WithDownload = initHoc<
  {
    downloadFn: () => Promise<any>;
    onSuccess?: (data: any) => any;
    onError?: (e: Error, show: () => void) => any;
    passDataToComponent?: boolean;
  },
  { data?: any }
>(({ baseComponent, downloadFn, onError, onSuccess, passDataToComponent, ...props }) => {
  const Component = baseComponent;
  const { isShow, show } = useShow(false);
  const data = useRef(null);

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
