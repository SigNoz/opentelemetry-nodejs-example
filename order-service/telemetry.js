// telemetry.js

// import { MeterProvider } from '@opentelemetry/sdk-metrics-base';
// import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

// const otlpMetricsExporter = new OTLPMetricExporter({
//   url: 'http://otel-collector:4318'
// });

// const meterProvider = new MeterProvider({
//   exporter: otlpMetricsExporter,
//   interval: 5000, // Export interval in milliseconds
// });

// const meter = meterProvider.getMeter('order-service-meter');

// // Creating a histogram to track order validation duration
// const orderValidationDuration = meter.createHistogram('order_validation_duration', {
//   description: 'Measures the duration of order validation',
//   unit: 'ms' // unit of measure
// });

// export { orderValidationDuration };


// 


import { metrics } from '@opentelemetry/api';
import { MeterProvider, PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

const resource = Resource.default().merge(
  new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'order-service'
  }),
);

const metricReader = new PeriodicExportingMetricReader({
  exporter: new ConsoleMetricExporter(),

  // Default is 60000ms (60 seconds). Set to 10 seconds for demonstrative purposes only.
  exportIntervalMillis: 10000,
});

const myServiceMeterProvider = new MeterProvider({
  resource: resource,
  readers: [metricReader],
});

// Set this MeterProvider to be global to the app being instrumented.
metrics.setGlobalMeterProvider(myServiceMeterProvider);
