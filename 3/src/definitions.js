import { ASYNC_MODEL_TYPES } from "./libs/scalecube.js";

export const userServiceDefinition = {
  serviceName: "UserService",
  methods: {
    register: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
    authorize: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
    isRegistered: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
  },
};
export const sessionServiceDefinition = {
  serviceName: "SessionService",
  methods: {
    openSession: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
    closeSession: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
    validate: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
    getUser: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
  },
};
export const messageServiceDefinition = {
  serviceName: "MessageService",
  methods: {
    forward: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
    getMessageStream: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_STREAM,
    },
  },
};
