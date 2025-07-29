import { useNavigate } from "react-router-dom";

const STATUSES = ["out_of_stock", "low", "normal", "good"];
const STATUS_LABELS = {
  out_of_stock: "Out of Stock",
  low: "Low",
  normal: "Normal",
  good: "Good",
};
const STATUS_COLORS = {
  out_of_stock: "bg-red-500",
  low: "bg-yellow-500",
  normal: "bg-blue-500",
  good: "bg-green-500",
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      className="border p-4 rounded shadow hover:shadow-md cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <img
        src={product.image?.url || product.image}
        alt={product.name}
        className="w-full h-40 object-cover mb-2 rounded"
      />
      <h2 className="font-bold text-lg">{product.name}</h2>

      <div className="flex flex-wrap mt-2 gap-2">
        {STATUSES.map((status) => (
          <span
            key={status}
            className={`px-2 py-1 rounded text-sm border ${
              product.status === status
                ? `${STATUS_COLORS[status]} text-white`
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {STATUS_LABELS[status]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
