import { EMPTY_ARRAY } from 'lkree-common-utils/const';

import { computeWebSocketSendData } from '~/shared/lib/helpers';

export class SendDataConfigurator<Events> {
  configurePositive<T extends Parameters<typeof computeWebSocketSendData>[0]>({
    data,
    events = EMPTY_ARRAY,
  }: {
    events?: Array<Events>;
    data?: T;
  }) {
    return computeWebSocketSendData({
      data,
      events,
      status: true,
    });
  }

  configureNegative({
    errors = EMPTY_ARRAY,
    errorsMessages,
    events = EMPTY_ARRAY,
  }: {
    events?: Array<Events>;
    errors?: Array<Error>;
    errorsMessages: Array<string>;
  }) {
    return {
      errors,
      errorsMessages,
      events,
      status: false,
    };
  }
}
