import { useLayoutEffect } from 'react';

interface Props {
  data: unknown;
  downloadFn: () => unknown | Promise<unknown>;
}

export const useInitDownloadData = ({ data, downloadFn }: Props) => {
  useLayoutEffect(() => {
    if (!data) void downloadFn();
  }, []);
};
