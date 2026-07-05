"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./side.module.css";

import {
  FiHome,
  FiUsers,
  FiGift,
  FiShoppingCart,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import { MdStore } from "react-icons/md";

export default function Sidebar() {

  
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: <FiHome />, path: "/admin/pages/dashboard" },
    { name: "Customers", icon: <FiUsers />, path: "/admin/pages/customer" },
    { name: "Purchase Entry", icon: <FiShoppingCart />, path: "/admin/pages/purchase_en" },
    { name: "Reward Coupons", icon: <FiGift />, path: "/admin/pages/reward_cu" },
    { name: "Partner Shops", icon: <MdStore />, path: "/admin/pages/partner_add" },
    { name: "Reports", icon: <FiBarChart2 />, path: "/admin/pages/reports" },
    { name: "Contest", icon: <FiGift />, path: "/admin/pages/contest" },
    { name: "Settings", icon: <FiSettings />, path: "/admin/pages/settings" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <aside className={styles.sidebar}>

      {/* LOGO */}
      <div className={styles.logo}>
        <img src="/kc_logo.png" alt="logo" className={styles.logoImg} />

        <div>
          <h2 className={styles.logoTitle}>JEWEL LOYALTY</h2>
          <span className={styles.logoSub}>Admin Panel</span>
        </div>
      </div>

      {/* MENU */}
      <nav className={styles.nav}>
        {menu.map((item, i) => (
          <Link
            key={i}
            href={item.path}
            className={`${styles.link} ${
              isActive(item.path) ? styles.active : ""
            }`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}

        <Link href="/admin/auth/" className={styles.link}>
          <span className={styles.icon}><FiLogOut /></span>
          <span>Logout</span>
        </Link>
      </nav>
    </aside>
  );
}