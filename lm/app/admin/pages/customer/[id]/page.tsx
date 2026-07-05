"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./customerde.module.css";
import { Phone, CalendarDays, Mail, Pencil, X, Check } from "lucide-react";
import { useParams } from "next/navigation";

import { ENDPOINTS } from "../../../../lib/endpoints.js"



/* ================= TYPES ================= */
type Customer = {
  customer_id: string;
  card_no: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  created_at?: string;
};

type Transaction = {
  id: string;
  bill_number: string;
  purchase_date: string;
  amount: number;
  reward_points: number;
  product: string;
  tier: string;
  type?: "purchase" | "redeem";
};

export default function CustomerDetails() {
  const params = useParams();
  const id = params?.id as string;

  const [tab, setTab] = useState<"purchase" | "redeem">("purchase");
  const [filterMonth, setFilterMonth] = useState("");

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [editData, setEditData] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [purchases, setPurchases] = useState<Transaction[]>([]);
  const [redeems, setRedeems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= CUSTOMER ================= */
  useEffect(() => {
    if (!id) return;

    (async () => {
      const res = await fetch(ENDPOINTS.CUSTOMER_BY_ID(id), {
  credentials: "include",
});

      const data = await res.json();

      if (res.ok) {
        setCustomer(data);
        setEditData(data);
      }
    })();
  }, [id]);

  /* ================= PURCHASES ================= */
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);

        const res = await fetch(ENDPOINTS.PURCHASE_BY_CUSTOMER(id), {
  credentials: "include",
});

        const data = await res.json();

        setPurchases(
          Array.isArray(data?.data)
            ? data.data.map((t: any) => ({
                ...t,
                type: "purchase",
              }))
            : []
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ================= REDEEMS ================= */
  useEffect(() => {
    if (!id) return;

    (async () => {
     const res = await fetch(ENDPOINTS.REDEEM_BY_CUSTOMER(id), {
  credentials: "include",
});

      const data = await res.json();

    setRedeems(
  Array.isArray(data?.data)
    ? data.data.map((r: any) => ({
        id: r.id,
        bill_number: "REDEEM",
        purchase_date: r.issue_date,
        amount: r.coupon_value,

        reward_points: r.points_used,

        product: r.partner_shops?.name || "REDEEM",
        tier: r.partner_shops?.category || "-",

        type: "redeem",
      }))
    : []
);
    })();
  }, [id]);

  /* ================= MERGED DATA ================= */
  const transactions = useMemo(() => {
    return [...purchases, ...redeems];
  }, [purchases, redeems]);

  /* ================= SAVE EDIT ================= */
  const saveEdit = async () => {
    if (!editData) return;

    const res = await fetch(ENDPOINTS.CUSTOMER_BY_ID(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(editData),
    });

    if (res.ok) {
      const updated = await res.json();
      setCustomer(updated);
      setEditData(updated);
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setEditData(customer);
    setIsEditing(false);
  };

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    return transactions.filter((item) => {
      const matchTab =
        tab === "purchase"
          ? item.type === "purchase"
          : item.type === "redeem";

      const matchMonth = filterMonth
        ? item.purchase_date?.slice(0, 7) === filterMonth
        : true;

      return matchTab && matchMonth;
    });
  }, [transactions, tab, filterMonth]);

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    const totalEarned = purchases.reduce(
      (sum, t) => sum + Number(t.reward_points || 0),
      0
    );

    const totalUsed = redeems.reduce(
      (sum, r) => sum + Number(r.reward_points || 0),
      0
    );

    return {
      totalEarned,
      totalUsed,
      remaining: totalEarned - totalUsed,
    };
  }, [purchases, redeems]);

  if (!customer || !editData) return <p>Loading customer...</p>;

  return (
    <div className={styles.page}>

      {/* PROFILE (UNCHANGED) */}
      <div className={styles.profileCard}>
        <div className={styles.left}>
          <div className={styles.avatar}>
            {customer.name?.charAt(0)}
          </div>

          <div>
            {!isEditing ? (
              <>
                <h2 className={styles.name}>{customer.name}</h2>
                <p>ID: {customer.customer_id}</p>
                <p>Card: {customer.card_no}</p>
              </>
            ) : (
              <input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            )}
          </div>
        </div>

        <div className={styles.info}>
          <div>
            <Phone size={16} />
            {isEditing ? (
              <input
                value={editData.mobile}
                onChange={(e) =>
                  setEditData({ ...editData, mobile: e.target.value })
                }
              />
            ) : (
              <span>{customer.mobile}</span>
            )}
          </div>

          <div>
            <Mail size={16} />
            {isEditing ? (
              <input
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
            ) : (
              <span>{customer.email}</span>
            )}
          </div>

          <div>
            <CalendarDays size={16} />
            <span>{customer.created_at?.slice(0, 10)}</span>
          </div>
        </div>

        <div className={styles.editActions}>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>
              <Pencil size={16} /> Edit
            </button>
          ) : (
            <>
              <button onClick={saveEdit}>
                <Check size={16} /> Save
              </button>
              <button onClick={cancelEdit}>
                <X size={16} /> Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* STATS (FIXED) */}
      <div className={styles.stats}>
        <div className={styles.card}>
          <p>Total Earned</p>
          <h2>{stats.totalEarned}</h2>
        </div>

        <div className={styles.card}>
          <p>Total Used</p>
          <h2>{stats.totalUsed}</h2>
        </div>

        <div className={styles.card}>
          <p>Remaining</p>
          <h2>{stats.remaining}</h2>
        </div>
      </div>

      {/* FILTER (UNCHANGED) */}
      <div className={styles.smallFilterCard}>
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        />
        <button onClick={() => setFilterMonth("")}>Clear</button>
      </div>

      {/* TABS (UNCHANGED) */}
      <div className={styles.history}>
        <div className={styles.tabs}>
          <button
            className={tab === "purchase" ? styles.activeTab : ""}
            onClick={() => setTab("purchase")}
          >
            Purchase
          </button>

          <button
            className={tab === "redeem" ? styles.activeTab : ""}
            onClick={() => setTab("redeem")}
          >
            Redeem
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredData.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Bill</th>
                <th>Product</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Points</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.purchase_date}</td>
                  <td>{item.bill_number}</td>
                  <td>{item.product}</td>
                  <td>{item.tier}</td>
                  <td>₹{item.amount}</td>
                  <td>{item.reward_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}