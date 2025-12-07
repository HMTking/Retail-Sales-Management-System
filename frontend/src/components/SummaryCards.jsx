import { Package, DollarSign, Tag, Info } from "lucide-react";

const SummaryCards = ({ summary }) => {
  const cards = [
    {
      title: "Total units sold",
      value: summary.totalUnitsSold,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Total Amount",
      value: `₹${summary.totalAmount.toLocaleString()} (${
        summary.totalUnitsSold
      } SRs)`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Discount",
      value: `₹${Math.round(summary.totalDiscount).toLocaleString()} (${
        summary.totalUnitsSold
      } SRs)`,
      icon: Tag,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-start justify-between"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </h3>
              <Info size={16} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {card.value}
            </p>
          </div>
          <div className={`${card.color} p-3 rounded-lg`}>
            <card.icon className="text-white" size={24} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
