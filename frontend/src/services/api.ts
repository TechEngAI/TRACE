/**
 * TRACE API Client Foundation.
 *
 * Implements base HTTP client and health probe.
 * Business endpoints remain uncalled in Part 1 to prevent premature execution.
 */

import type { HealthResponse } from '../types/contracts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function checkBackendHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Health check failed with HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export { API_BASE_URL };
