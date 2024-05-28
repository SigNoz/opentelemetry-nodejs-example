// logger.js
import pino from "pino";
import { trace } from "@opentelemetry/api";

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
  formatters: {
    log: (log) => {
      const currentSpan = trace.getActiveSpan();
      if (currentSpan) {
        const { traceId, spanId } = currentSpan.spanContext();

        log.traceId = traceId;
        log.spanId = spanId;

        console.log("Hereeee", traceId, " + ", spanId);
      }
      console.log(log);
      return log;
    },
  },
});

export default logger;
