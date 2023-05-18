import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";
import order from "@/public/order.json";

function OrderAnimation() {
  return (
    <div className="flex items-center justify-center flex-col mt-4 p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Preparing your order 🌟
      </motion.div>
      <Player autoplay loop src={order}></Player>
    </div>
  );
}

export default OrderAnimation;
