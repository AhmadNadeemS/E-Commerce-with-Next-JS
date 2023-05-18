import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect } from "react";
import dance from "@/public/dance.gif";
import Link from "next/link";
import { useCartStore } from "@/store";

function OrderConfirmed() {
  const cartStore = useCartStore();

  const checkoutOrder = () => {
    setTimeout(() => {
      cartStore.setOnCheckout("cart");
    }, 1000);
    cartStore.toggleCart();
  };

  useEffect(() => {
    cartStore.setPaymentIntent("");
    cartStore.clearCart();
  }, []);
  return (
    <motion.div
      className="flex justify-center items-center my-12"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="p-12 text-center">
        <h1 className="text-xl font-medium">Your order has been placed 🚀</h1>
        <h2 className="text-sm my-4">Check your email for the receipt</h2>
        <Image src={dance} className="py-8" alt="dancing kid" />
        <div>
          <Link href={"/dashboard"}>
            <button onClick={checkoutOrder} className="font-medium">
              Check your Order
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default OrderConfirmed;
