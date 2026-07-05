import Sidebar from "../pages/components/page";
import styles from "./admin.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}