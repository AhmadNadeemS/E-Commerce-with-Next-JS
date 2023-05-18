import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import formatPrice from "@/util/PriceFormat";
import Image from "next/image";
import { prisma } from "@/util/prisma";

export const revalidate = 0;

const fetchOrders = async () => {
  const user = await getServerSession(authOptions);
  if (!user) {
    return null;
  }
  const orders = await prisma.order.findMany({
    where: {
      userId: user?.user?.id,
      status: "complete",
    },
    include: {
      products: true,
    },
  });
  return orders;
};

async function Dashboard() {
  const orders = await fetchOrders();
  if (orders === null)
    return <div>You need to be logged in to view your orders</div>;
  if (orders.length === 0) return <div>No Orders placed</div>;
  return (
    <div>
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-lg my-4 bg-base-200 p-8 space-y-2"
        >
          <h2 className="text-xs font-medium ">Order reference: {order.id}</h2>

          <p className="text-xs">
            Status:{" "}
            <span
              className={`${
                order.status === "complete" ? "bg-teal-500" : "bg-orange-500"
              } text-white py-1 rounded-md px-2 text-xs mx-2`}
            >
              {order.status}
            </span>
          </p>

          <p className="text-xs">
            Time: {new Date(order.createdDate).toString()}
          </p>

          <div className="text-sm lg:flex items-center gap-4">
            {order.products.map((product) => (
              <div className="py-2" key={product.id}>
                <h2 className="py-2">{product.name}</h2>
                <div className="flex gap-4 items-baseline">
                  <Image
                    src={product.image!}
                    width={36}
                    height={36}
                    alt={product.name}
                    priority={true}
                    className="w-auto"
                  />
                  <p>{formatPrice(product.unit_amount)}</p>
                  <p>Quantity: {product.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="font-medium py-2">Total: {formatPrice(order.amount)}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
