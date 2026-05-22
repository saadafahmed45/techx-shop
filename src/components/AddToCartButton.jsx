import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }) {
  const { addToCart, openCart } = useCart();

  return (
    <button
      onClick={() => {
        addToCart(product);
        openCart();
      }}
      className="px-4 py-2 bg-black text-white rounded-xl"
    >
      Add To Cart
    </button>
  );
}