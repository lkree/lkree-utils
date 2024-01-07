import { useState, ComponentType, ComponentPropsWithoutRef, useLayoutEffect } from 'react';

import { useIsMounted, usePrev } from '~/shared/lib/hooks';

type AdditionalPropsToComponent = {
  openEnds?: boolean;
  closeStarts?: boolean;
  closeEnds?: boolean;
};

type ComponentProps<T extends ComponentType> = Omit<ComponentPropsWithoutRef<T>, keyof AdditionalPropsToComponent>;

interface HOCProps<T extends ComponentType> {
  closeDelay?: number;
  destroyIfClosed?: boolean;
  notifyClosingStarted?: boolean;
  notifyOpeningEnded?: boolean;
  openDelay?: number;
  openPropName: keyof ComponentProps<T>;
}

interface BaseComponent<T extends ComponentType> {
  baseComponent: T;
}

type DelayedProps<T extends ComponentType> = HOCProps<T> & ComponentProps<T> & BaseComponent<T>;

const OPEN_DELAY = 0;
const CLOSE_DELAY = 0;

const Delayed = <T extends ComponentType>({
  baseComponent,
  closeDelay = CLOSE_DELAY,
  destroyIfClosed = true,
  notifyClosingStarted = false,
  notifyOpeningEnded = false,
  openDelay = OPEN_DELAY,
  openPropName,
  ...props
}: DelayedProps<T>) => {
  const [internalShow, setInternalShow] = useState(false);
  const isMounted = useIsMounted();
  const [openingProcessEnded, setOpeningProcessEnded] = useState(false);
  const [closingProcessStarted, setClosingProcessStarted] = useState(false);
  const externalShow = (props as unknown as ComponentProps<T>)[openPropName];
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
};

export const WithDelay =
  <T extends ComponentType<any>>(Component: T, HOCProps: HOCProps<T>) =>
  (props: ComponentProps<T>) =>
    <Delayed {...props} {...HOCProps} baseComponent={Component} />;
