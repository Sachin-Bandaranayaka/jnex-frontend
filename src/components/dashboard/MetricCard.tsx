interface MetricCardProps {
    title: string;
    value: number;
    subtitle: string;
    trend: number;
    trendLabel: string;
    trendType?: 'positive' | 'negative' | 'neutral';
}

export default function MetricCard({
    title,
    value,
    subtitle,
    trend,
    trendLabel,
    trendType = 'positive'
}: MetricCardProps) {
    const getTrendColor = () => {
        if (trendType === 'positive') {
            return trend >= 0 ? 'text-green-500' : 'text-red-500';
        }
        if (trendType === 'negative') {
            return trend > 0 ? 'text-red-500' : 'text-green-500';
        }
        return 'text-gray-500';
    };

    const getTrendIcon = () => {
        if (trendType === 'positive') {
            return trend >= 0 ? '↑' : '↓';
        }
        if (trendType === 'negative') {
            return trend > 0 ? '↑' : '↓';
        }
        return '→';
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-semibold text-gray-900">{value}</p>
                <p className="ml-2 text-sm text-gray-500">{subtitle}</p>
            </div>
            <div className="mt-4">
                <div className={`flex items-center ${getTrendColor()}`}>
                    <span className="text-sm font-medium">
                        {getTrendIcon()} {Math.abs(trend)}%
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                        {trendLabel}
                    </span>
                </div>
            </div>
        </div>
    );
} 