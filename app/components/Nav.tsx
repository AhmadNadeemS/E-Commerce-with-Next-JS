"use client";

import { useCartStore } from "@/store";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Cart from "./Cart";
import { AiFillShopping } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import DarkLight from "./DarkLight";

export default function Nav({ user }: Session) {
  const cartStore = useCartStore();
  return (
    <nav className="flex justify-between items-center py-8">
      <Link href={"/"}>
        <h1 className="font-lobster text-xl">Styled</h1>
      </Link>
      <ul className="flex items-center gap-8">
        <li
          onClick={() => cartStore.toggleCart()}
          className="text-3xl relative cursor-pointer"
        >
          <AiFillShopping />
          <AnimatePresence>
            {cartStore.cart.length > 0 && (
              <motion.span
                animate={{ scale: 1 }}
                initial={{ scale: 0 }}
                exit={{ scale: 0 }}
                className="bg-primary text-white absolute w-5 h-5 rounded-full flex items-center justify-center left-4 bottom-4 text-sm"
              >
                {cartStore.cart.length}
              </motion.span>
            )}
          </AnimatePresence>
        </li>
        <DarkLight />
        {!user && (
          <li className="bg-primary text-white px-4 py-2 rounded-md">
            <button onClick={() => signIn()}>Sign In</button>
          </li>
        )}
        {user && (
          <>
            <li>
              <div className="dropdown dropdown-end cursor-pointer">
                <Image
                  src={user?.image as string}
                  alt={user.name as string}
                  width={36}
                  height={36}
                  className="rounded-full w-auto"
                  tabIndex={0}
                />
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 my-4 rounded-box w-52"
                >
                  <Link
                    className="hover:bg-base-300 p-4 rounded-md"
                    href={"/dashboard"}
                    onClick={() => {
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }}
                  >
                    Orders
                  </Link>
                  <li
                    className="hover:bg-base-300 p-4 rounded-md"
                    onClick={() => {
                      signOut();
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }}
                  >
                    Sign Out
                  </li>
                </ul>
              </div>
            </li>
          </>
        )}
      </ul>
      <AnimatePresence>{cartStore.isOpen && <Cart />}</AnimatePresence>
    </nav>
  );
}
