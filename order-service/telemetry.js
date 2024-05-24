import { metrics } from '@opentelemetry/api';
import { MeterProvider, PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

const resource = Resource.default().merge(
  new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'order-service'
  }),
);metrics

const otlpMetricsExporter = new OTLPMetricExporter({
  url: 'http://otel-collector:4318/v1/metrics'
});


const metricReader = new PeriodicExportingMetricReader({
  exporter: otlpMetricsExporter,

  // Default is 60000ms (60 seconds). Set to 10 seconds for demonstrative purposes only.
  exportIntervalMillis: 10000,
});

const myServiceMeterProvider = new MeterProvider({
  resource: resource,
  readers: [metricReader],
});

// Set this MeterProvider to be global to the app being instrumented.
metrics.setGlobalMeterProvider(myServiceMeterProvider);
