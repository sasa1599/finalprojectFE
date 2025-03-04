import { Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { Category } from "@/types/category-types";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex gap-4">
        {/* Category thumbnail */}
        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          {category.category_thumbnail ? (
            <img
              src={category.category_thumbnail}
              alt={category.category_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="text-gray-400" size={24} />
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{category.category_name}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(category)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDelete(category.category_id)}
                className="text-red-600 hover:text-red-700 dark:text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
            {category.description}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Total Products: {category.Product?.length || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
