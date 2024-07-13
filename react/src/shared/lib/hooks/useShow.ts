import { useState } from 'react';

import { useImmutable } from './useImmutable';

export const useShow = (initialState = false) => {
  const { 0: isShow, 1: setIsHow } = useState(initialState);

  return {
    hide: useImmutable(() => setIsHow(false)),
    isShow,
    show: useImmutable(() => setIsHow(true)),
  };
};
