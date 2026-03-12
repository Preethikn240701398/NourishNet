import { Badge } from './ui/badge';

interface CategoryBadgeProps {
  category: 'red' | 'yellow' | 'green';
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const styles = {
    red: 'bg-red-100 text-red-700 border-red-300',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    green: 'bg-green-100 text-green-700 border-green-300',
  };

  const labels = {
    red: 'High Priority',
    yellow: 'Medium Priority',
    green: 'Low Priority',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <Badge className={`${styles[category]} ${sizeClasses[size]} border`}>
      {labels[category]}
    </Badge>
  );
}
