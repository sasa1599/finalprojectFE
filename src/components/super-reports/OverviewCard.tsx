import { Store, Package } from "lucide-react";

interface OverviewProps {
  totalStores: number;
  totalItems: number;
  totalValue: number;
  averageItemsPerStore: number;
  displayedStores?: number;
}

interface OverviewCardsProps {
  overview: OverviewProps;
}

// Component for individual stats card
const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
}> = ({ icon, title, value, subtitle }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border">
    <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
    <div className="flex items-center">
      {icon}
      <p className="text-3xl font-bold">{value}</p>
    </div>
    {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
  </div>
);

export const OverviewCards: React.FC<OverviewCardsProps> = ({ overview }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<Store className="h-8 w-8 text-blue-500 mr-3" />}
        title="Total Stores"
        value={overview.totalStores}
        subtitle={
          overview.displayedStores !== undefined
            ? `Showing ${overview.displayedStores} of ${overview.totalStores} stores`
            : undefined
        }
      />

      <StatCard
        icon={<Package className="h-8 w-8 text-green-500 mr-3" />}
        title="Total Items"
        value={overview.totalItems.toLocaleString()}
      />

      <StatCard
        icon={
          <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mr-3">
            Rp
          </div>
        }
        title="Total Value"
        value={overview.totalValue.toLocaleString()}
      />

      <StatCard
        icon={
          <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mr-3">
            Avg
          </div>
        }
        title="Avg Items/Store"
        value={overview.averageItemsPerStore.toFixed(1)}
      />
    </div>
  );
};
