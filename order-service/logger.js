// logger.js
import pino from "pino";
import { trace } from "@opentelemetry/api";

const logger = pino({
  transport: {
    targets: [
      {
        target: "pino-opentelemetry-transport",
        options: {
          resourceAttributes: {
            "service.name": "order-service",
          },
        },
      },
      {
        target: "pino-pretty",
        level: "info",
        options: { colorize: true },
      },
    ],
  },
  formatters: {
    log: (log) => {
      const currentSpan = trace.getActiveSpan();
      if (currentSpan) {
        const { traceId, spanId, traceFlags } = currentSpan.spanContext();

        log.traceId = traceId;
        log.spanId = spanId;
        log.traceFlags = traceFlags;

        console.log("Hereeee in the object", traceId, " + ", spanId);
      }
      return log;
    },
  },
});

export default logger;
