// telemetry.js

import { MeterProvider } from '@opentelemetry/sdk-metrics-base';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

const otlpMetricsExporter = new OTLPMetricExporter({
  url: 'http://otel-collector:4318'
});

const meterProvider = new MeterProvider({
  exporter: otlpMetricsExporter,
  interval: 5000, // Export interval in milliseconds
});

const meter = meterProvider.getMeter('order-service-meter');

// Creating a histogram to track order validation duration
const orderValidationDuration = meter.createHistogram('order_validation_duration', {
  description: 'Measures the duration of order validation',
  unit: 'ms' // unit of measure
});

export { orderValidationDuration };
