import { TrimStringMiddleware } from "src/middlewares/TrimString";

export default {
  middlewares: [new TrimStringMiddleware()],
};
