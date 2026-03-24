interface Props {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
      <p className="text-red-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
