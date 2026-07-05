"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./customer.module.css";
import { Eye, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";

type Customer = {
  id: string;           // UUID (DB only)
  customer_id: string;  // KCG1 (UI + routing)
  card_no: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
};

const API_URL = "http://localhost:5001/api/customers";

export default function CustomerPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 5;

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
  });

  // ================= FETCH =================
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(API_URL, { credentials: "include" });

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
        setCustomers([]);
      }
    };

    fetchCustomers();
  }, []);

  // ================= ADD =================
  const [errors, setErrors] = useState({
  mobile: "",
  email: "",
  general: "",
});

const addCustomer = async () => {
  setErrors({ mobile: "", email: "", general: "" });

  if (!form.name || !form.mobile) {
    setErrors((prev) => ({
      ...prev,
      general: "Name & Mobile required",
    }));
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      // 👇 handle backend validation errors
      if (data?.field === "mobile") {
        setErrors((prev) => ({
          ...prev,
          mobile: data.message,
        }));
      } else if (data?.field === "email") {
        setErrors((prev) => ({
          ...prev,
          email: data.message,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: data.message || "Something went wrong",
        }));
      }
      return;
    }

    // success
    if (data?.id) {
      setCustomers((prev) => [data, ...prev]);
      setForm({ name: "", mobile: "", email: "", address: "" });
    }
  } catch (err) {
    setErrors((prev) => ({
      ...prev,
      general: "Server error",
    }));
  }
};

  // ================= DELETE =================
 const deleteCustomer = async (id: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this customer?"
  );

  if (!confirmDelete) return; // ❌ cancel if No

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to delete customer");
      return;
    }

    // remove from UI
    setCustomers((prev) => prev.filter((c) => c.id !== id));

    alert("Customer deleted successfully!");
  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};

  // ================= SEARCH =================
  const filtered = useMemo(() => {
    return customers.filter((c) =>
      `${c.customer_id} ${c.name} ${c.mobile} ${c.email} ${c.address}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [customers, search]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return (
    <div className={styles.page}>

      {/* ================= LIST CARD ================= */}
      <div className={styles.card}>
        <h2>Customer List</h2>

        {/* SEARCH */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Search size={18} />
          <input
            className={styles.search}
            placeholder="Search customers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          /> 
        </div>
        <br/>

        {/* TABLE */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length > 0 ? (
                paginated.map((c) => (
                  <tr key={c.id}>
                    <td>{c.customer_id}</td>
                    <td>{c.name}</td>
                    <td>+91 {c.mobile}</td>
                    <td>{c.email}</td>
                    <td>{c.address}</td>

                    <td>
                      <div className={styles.actions}>

                        {/* VIEW */}
                        <Eye
                          size={18}
                          className={styles.view}
                          onClick={() =>
                            router.push(
                              `/admin/pages/customer/${c.id}`
                            )
                          }
                        />

                        {/* DELETE */}
                        <Trash2
                          size={18}
                          className={styles.delete}
                          onClick={() => deleteCustomer(c.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No Customers Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className={styles.footer}>
          <span>
            Showing {filtered.length === 0 ? 0 : start + 1} -{" "}
            {Math.min(start + perPage, filtered.length)} of{" "}
            {filtered.length}
          </span>

          <div className={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            {Array.from({ length: totalPages || 1 }).map((_, i) => (
              <button
                key={i}
                className={page === i + 1 ? styles.active : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ================= ADD CUSTOMER ================= */}
      <div className={styles.card}>
        <h2>Add Customer</h2>

        <div className={styles.form}>

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <div className={styles.mobileGroup}>
            <span className={styles.countryCode}>+91</span>

            <input
              className={styles.mobileInput}
              placeholder="9876543210"
              maxLength={10}
              value={form.mobile}
              onChange={(e) =>
                setForm({
                  ...form,
                  mobile: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <textarea
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          <button onClick={addCustomer} className={styles.addBtn}>
            + Add Customer
          </button>
        </div>
      </div>

    </div>
  );
}