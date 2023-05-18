"use client";
import { useCartStore } from "@/store";
import { useState } from "react";

export type AddCartType = {
  id: string;
  name: string;
  unit_amount: number | null;
  image: string;
  quantity?: number | 1;
};

function AddCart({ name, id, unit_amount, image, quantity }: AddCartType) {
  const cartStore = useCartStore();
  const [added, setAdded] = useState(false);
  const handleOnAdded = () => {
    cartStore.addProduct({
      id,
      name,
      unit_amount,
      image,
      quantity,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 500);
  };
  return (
    <button
      onClick={handleOnAdded}
      disabled={added}
      className="my-4 btn btn-primary w-full"
    >
      {!added && <span>Add To Cart</span>}
      {added && <span>Adding to cart 😊</span>}
    </button>
  );
}

export default AddCart;
