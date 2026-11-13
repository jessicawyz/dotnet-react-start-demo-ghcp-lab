import { useEffect, useState } from 'react';
import { executeApiRequest } from '../../lib/api';
import type { SingleItemEnvelope, SystemHealthInfo } from '../../lib/types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

type PageState = 'loading' | 'success' | 'error';

/**
 * System health monitoring page.
 * Fetches and displays the current health status from the backend API.
 */
export function SystemHealthPage() {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [healthData, setHealthData] = useState<SingleItemEnvelope<SystemHealthInfo> | null>(null);
  const [errorText, setErrorText] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function fetchHealthStatus() {
      try {
        const apiResponse = await executeApiRequest<SingleItemEnvelope<SystemHealthInfo>>(
          '/v1/health'
        );
        
        if (isMounted) {
          setHealthData(apiResponse);
          setPageState('success');
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          setErrorText(errorMessage);
          setPageState('error');
        }
      }
    }

    fetchHealthStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  if (pageState === 'loading') {
    return <LoadingSpinner />;
  }

  if (pageState === 'error') {
    return (
      <ErrorMessage
        errorTitle="Health Check Failed"
        errorDescription={errorText}
      />
    );
  }

  if (!healthData) {
    return null;
  }

  const { item: healthInfo, metadata } = healthData;
  const statusColorClass = healthInfo.status === 'healthy' 
    ? 'bg-green-100 text-green-800 border-green-300'
    : 'bg-yellow-100 text-yellow-800 border-yellow-300';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-brand-text)]">
        System Health Status
      </h2>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium w-32">Status:</span>
          <span className={`px-3 py-1 rounded-full border font-semibold ${statusColorClass}`}>
            {healthInfo.status.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium w-32">Version:</span>
          <span className="text-[var(--color-brand-text)]">{healthInfo.version}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium w-32">Environment:</span>
          <span className="text-[var(--color-brand-text)]">{healthInfo.environment}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium w-32">Checked At:</span>
          <span className="text-[var(--color-brand-text)]">
            {new Date(healthInfo.checkedAtDate).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Response Metadata</h3>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Transaction ID:</span> {metadata.transactionId}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Timestamp:</span> {metadata.timestamp}
        </p>
      </div>
    </div>
  );
}
