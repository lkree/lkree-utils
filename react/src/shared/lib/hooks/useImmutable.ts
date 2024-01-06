import { useRef } from 'react';

export const useImmutable = <T>(d: T): T => useRef(d).current;
