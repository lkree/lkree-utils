import type { ReactEventHandler } from 'react';

export const stopPropagation: ReactEventHandler = e => e.stopPropagation();

export const preventDefault: ReactEventHandler = e => e.preventDefault();
