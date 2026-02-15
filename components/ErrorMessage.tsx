interface ErrorMessageProps {
  type: 'video' | 'paywall' | 'social' | 'word_limit' | 'extraction' | 'rate_limit' | 'network' | 'generic';
  message?: string;
  wordCount?: number;
  maxWords?: number;
  onTextPaste?: () => void;
}

export default function ErrorMessage({
  type,
  message,
  wordCount,
  maxWords = 5000,
  onTextPaste
}: ErrorMessageProps) {
  const getErrorContent = () => {
    switch (type) {
      case 'video':
        return {
          icon: '🎥',
          title: 'Video URLs not supported',
          description: 'Try an article, blog post, or PDF instead.',
          color: 'red',
        };
      case 'paywall':
        return {
          icon: '🔒',
          title: 'Unable to extract article text',
          description: 'This content may be paywalled or protected. Try pasting the text directly below.',
          color: 'orange',
          showTextPaste: true,
        };
      case 'social':
        return {
          icon: '💬',
          title: 'Social media and forum URLs not supported',
          description: 'Try an article or blog post instead.',
          color: 'red',
        };
      case 'word_limit':
        return {
          icon: '📄',
          title: 'Article too long',
          description: `This article has ${wordCount?.toLocaleString()} words. Free tier supports up to ${maxWords.toLocaleString()} words. Upgrade to Premium for articles up to 25,000 words.`,
          color: 'orange',
          showUpgrade: true,
          showTextPaste: true,
        };
      case 'extraction':
        return {
          icon: '⚠️',
          title: 'Failed to extract content',
          description: message || 'Unable to extract article text. The page structure may be incompatible.',
          color: 'red',
          showTextPaste: true,
        };
      case 'rate_limit':
        return {
          icon: '⏱️',
          title: 'Rate limit reached',
          description: 'You\'ve used all 3 generations this hour. Create a free account for cross-device access or upgrade to Premium for unlimited generations.',
          color: 'orange',
          showUpgrade: true,
        };
      case 'network':
        return {
          icon: '🌐',
          title: 'Network error',
          description: 'Unable to connect. Please check your internet connection and try again.',
          color: 'red',
        };
      default:
        return {
          icon: '❌',
          title: 'Something went wrong',
          description: message || 'An unexpected error occurred. Please try again.',
          color: 'red',
        };
    }
  };

  const { icon, title, description, color, showUpgrade, showTextPaste } = getErrorContent();

  const colorClasses = {
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-900 dark:text-red-100',
      textSecondary: 'text-red-800 dark:text-red-200',
      button: 'bg-red-600 hover:bg-red-700',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-900 dark:text-orange-100',
      textSecondary: 'text-orange-800 dark:text-orange-200',
      button: 'bg-orange-600 hover:bg-orange-700',
    },
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-6 mb-8`}>
      <div className="flex items-start gap-4">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${colors.text} mb-2`}>
            {title}
          </h3>
          <p className={`${colors.textSecondary} mb-4`}>
            {description}
          </p>

          <div className="flex flex-wrap gap-3">
            {showUpgrade && (
              <a
                href="/pricing"
                className={`${colors.button} text-white px-4 py-2 rounded-lg font-medium transition-colors`}
              >
                Upgrade to Premium
              </a>
            )}
            {showTextPaste && onTextPaste && (
              <button
                onClick={onTextPaste}
                className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Or paste the article text directly
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
