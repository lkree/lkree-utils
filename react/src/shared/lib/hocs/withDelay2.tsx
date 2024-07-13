import { useState, type ComponentType, useLayoutEffect } from 'react';

import { useIsMounted, usePrev } from '~/shared/lib/hooks';

import { initHoc } from './initHoc';

const OPEN_DELAY = 0;
const CLOSE_DELAY = 0;

export const WithDelay = initHoc<
  {
    closeDelay?: number;
    destroyIfClosed?: boolean;
    notifyClosingStarted?: boolean;
    notifyOpeningEnded?: boolean;
    openDelay?: number;
    openPropName: string;
  },
  {
    openEnds?: boolean;
    closeStarts?: boolean;
    closeEnds?: boolean;
  }
>(
  ({
    baseComponent,
    closeDelay = CLOSE_DELAY,
    destroyIfClosed = true,
    notifyClosingStarted = false,
    notifyOpeningEnded = false,
    openDelay = OPEN_DELAY,
    openPropName,
    ...props
  }) => {
    const { 0: internalShow, 1: setInternalShow } = useState(false);
    const isMounted = useIsMounted();
    const { 0: openingProcessEnded, 1: setOpeningProcessEnded } = useState(false);
    const { 0: closingProcessStarted, 1: setClosingProcessStarted } = useState(false);
    const externalShow = props[openPropName];
    const prevExternalShow = usePrev(externalShow);

    useLayoutEffect(() => {
      if (!isMounted) return;

      let closeNotifyId: ReturnType<typeof setTimeout>;
      let openNotifyId: ReturnType<typeof setTimeout>;

      if (externalShow) {
        setInternalShow(true);

        if (notifyOpeningEnded) openNotifyId = setTimeout(() => setOpeningProcessEnded(true), openDelay);
      } else if (prevExternalShow.current) {
        setOpeningProcessEnded(false);

        if (notifyClosingStarted) setClosingProcessStarted(true);

        closeNotifyId = setTimeout(() => {
          setInternalShow(false);
          setClosingProcessStarted(false);
        }, closeDelay);
      }

      return () => {
        if (closeNotifyId) {
          setInternalShow(false);
          setClosingProcessStarted(false);
          clearTimeout(closeNotifyId);
        }
        if (openNotifyId) {
          setOpeningProcessEnded(true);
          clearTimeout(openNotifyId);
        }
      };
    }, [externalShow]);

    if (destroyIfClosed && !externalShow && !internalShow) return null;

    const Component = baseComponent as ComponentType<Record<string, unknown>>;

    // const show = !externalShow && internalShow ? externalShow : internalShow;

    return (
      <Component
        {...{
          ...props,
          [openPropName]: internalShow,
          ...(notifyOpeningEnded && { openEnds: openingProcessEnded }),
          ...(notifyClosingStarted && { closeStarts: closingProcessStarted }),
        }}
      />
    );
  }
);
