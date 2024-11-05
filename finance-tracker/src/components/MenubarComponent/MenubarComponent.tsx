"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RiLogoutCircleLine } from "react-icons/ri";
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

  useEffect(() => {
    localStorage.setItem("activeMenu", activeMenu);
    if (activeMenu === "dashboard") {
      router.push("/home");
    } else if (activeMenu === "transaction") {
      router.push("/home/transactions");
    } else if (activeMenu === "budget") {
      router.push("/home/budget");
    }
  }, [activeMenu]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div>
      <div className="flex justify-between pl-16 pr-16 py-6">
        <div className="flex gap-20">
          <div className="text-[#1ba0e2] text-xl font-semibold">
            [ Finance Tracker ]
          </div>
          <div className="flex gap-6 text-lg">
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
            <div
              className={`cursor-pointer ${
                activeMenu === "goals"
                  ? "text-[#1ba0e2]"
                  : "hover:text-[#1ba0e2]"
              }`}
            >
              Goals
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-lg text-[#ea5681] cursor-pointer" onClick={handleLogout}><RiLogoutCircleLine/> Logout</div>
      </div>
    </div>
  );
};

export default MenubarComponent;
