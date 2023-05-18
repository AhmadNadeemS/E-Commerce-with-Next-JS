import { useCartStore } from "@/store";
import formatPrice from "@/util/PriceFormat";
import Image from "next/image";
import basket from "@/public/basket.png";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import Checkout from "./Checkout";
import OrderConfirmed from "./OrderConfirmed";
import OrderAnimation from "./OrderAnimation";

export default function Cart() {
  const cartStore = useCartStore();

  const totalPrice = cartStore.cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);

  return (
    <motion.div
      //   layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => cartStore.toggleCart()}
      className="fixed w-full h-screen top-0 left-0 bg-black/25 "
    >
      <motion.div
        layout
        onClick={(e) => e.stopPropagation()}
        className="bg-base-200 absolute right-0 top-0 p-12 overflow-y-scroll  h-screen w-full new-md:w-2/5"
      >
        {cartStore.onCheckout === "cart" && (
          <button
            onClick={() => cartStore.toggleCart()}
            className="text-sm font-bold pb-12"
          >
            Back to store 🏃‍♂️
          </button>
        )}
        {cartStore.onCheckout === "checkout" && (
          <button
            onClick={() => cartStore.setOnCheckout("cart")}
            className="text-sm font-bold pb-12"
          >
            Back to cart 🛒
          </button>
        )}
        {/* Cart Items */}
        {cartStore.onCheckout === "cart" && (
          <>
            {cartStore.cart.map((item) => {
              return (
                <motion.div
                  layout
                  className="flex p-4 bg-base-100 gap-4 my-4 rounded-lg"
                  key={item.id}
                >
                  <Image
                    className="rounded-md h-24 w-auto"
                    src={item.image}
                    width={120}
                    height={120}
                    alt={item.name}
                  />
                  <div>
                    <h2>{item.name}</h2>
                    <div className="flex gap-2">
                      <h2>Quantity: {item.quantity}</h2>
                      <button
                        onClick={() =>
                          cartStore.addProduct({
                            id: item.id,
                            name: item.name,
                            image: item.image,
                            unit_amount: item.unit_amount,
                            quantity: item.quantity,
                          })
                        }
                      >
                        <IoAddCircle />
                      </button>
                      <button
                        onClick={() =>
                          cartStore.removeProduct({
                            id: item.id,
                            name: item.name,
                            image: item.image,
                            unit_amount: item.unit_amount,
                            quantity: item.quantity,
                          })
                        }
                      >
                        <IoRemoveCircle />
                      </button>
                    </div>
                    <p className="text-sm">
                      {item.unit_amount && formatPrice(item.unit_amount)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </>
        )}

        {cartStore.cart.length > 0 && cartStore.onCheckout === "cart" && (
          <motion.div layout>
            <p>Total : {formatPrice(totalPrice)}</p>

            <button
              onClick={() => cartStore.setOnCheckout("checkout")}
              className="py-2 mt-4 bg-primary w-full rounded-md text-white"
            >
              Checkout
            </button>
          </motion.div>
        )}
        {cartStore.onCheckout === "checkout" && <Checkout />}
        {cartStore.onCheckout === "success" && <OrderConfirmed />}
        <AnimatePresence>
          {!cartStore.cart.length && (
            <motion.div
              initial={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
              animate={{ scale: 1, rotateZ: 0, opacity: 0.75 }}
              exit={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
              className="flex flex-col gap-12 text-2xl font-medium pt-52 opacity-75 items-center"
            >
              <h1>Uhhh ohhh...it's empty 😪</h1>
              <Image src={basket} width={200} height={200} alt="empty-cart" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
