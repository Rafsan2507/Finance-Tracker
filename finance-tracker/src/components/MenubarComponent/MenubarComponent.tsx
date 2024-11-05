"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {};

const MenubarComponent = (props: Props) => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string>("");
  useEffect(() => {
    const savedMenu = localStorage.getItem("activeMenu");
    if (savedMenu) {
      setActiveMenu(savedMenu);
    }
  }, []);

  useEffect(()=>{
    localStorage.setItem("activeMenu", activeMenu);
    if (activeMenu === "dashboard") {
      router.push("/home");
    } else if (activeMenu === "transaction") {
      router.push("/home/transactions");
    } else if (activeMenu === "budget") {
      router.push("/home/budget");
    }
  },[activeMenu])

  return (
    <div>
      <div className="flex justify-between px-8 py-8 text-lg">
        <div>Finance Tracker</div>
        <div className="flex gap-4">
          <div
            className={`cursor-pointer ${
              activeMenu === "dashboard"
                ? "text-[#1ba0e2]"
                : "hover:text-[#1ba0e2]"
            }`}
            onClick={() => setActiveMenu("dashboard")}
          >
            Dashboard
          </div>
          <div
            className={`cursor-pointer ${
              activeMenu === "transaction"
                ? "text-[#1ba0e2]"
                : "hover:text-[#1ba0e2]"
            }`}
            onClick={() => setActiveMenu("transaction")}
          >
            Transaction
          </div>
          <div
            className={`cursor-pointer ${
              activeMenu === "budget"
                ? "text-[#1ba0e2]"
                : "hover:text-[#1ba0e2]"
            }`}
            onClick={() => setActiveMenu("budget")}
          >
            Budget
          </div>
        </div>
        <div>Logout</div>
      </div>
    </div>
  );
};

export default MenubarComponent;
