interface StatusBadgeProps {
  status: 'healthy' | 'unhealthy';
}

const STATUS_LABELS = {
  healthy: 'Healthy',
  unhealthy: 'Unhealthy',
};

const STATUS_CLASSES = {
  healthy: 'bg-green-100 text-green-800 border-green-300',
  unhealthy: 'bg-red-100 text-red-800 border-red-300',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border font-semibold ${STATUS_CLASSES[status]}`}
      role="status"
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
