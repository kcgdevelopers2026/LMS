"use client";

import { useEffect, useState } from "react";
import styles from "./partner.module.css";
import { Pencil, Trash2, Plus } from "lucide-react";

type Shop = {
  id?: string;
  name: string;
  category: string;
  coupons: string;
  image?: string;
  status: "Active" | "Inactive";
};

const API = "https://lms-7y23.onrender.com/api/shops";


export default function PartnerShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);

  const [form, setForm] = useState<Shop>({
    name: "",
    category: "",
    coupons: "",
    image: "",
    status: "Active",
  });

  const [unlocked, setUnlocked] = useState(false);
const [password, setPassword] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Shop | null>(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    fetch(API, {
  credentials: "include",
})
      .then((res) => res.json())
      .then((data) => setShops(data?.data || []))
      .catch(() => setShops([]));
  }, []);

  /* ================= ADD ================= */
  const handleAddShop = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(API, {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(form),
});

    const data = await res.json();

    if (res.ok) {
      setShops([data.data, ...shops]);

      setForm({
        name: "",
        category: "",
        coupons: "",
        image: "",
        status: "Active",
      });
    }
  };

  const handleUnlock = async () => {
  try {
    const res = await fetch("https://lms-7y23.onrender.com/api/admin/unlock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Incorrect password");
      return;
    }

    setUnlocked(true);
    setPassword("");
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  /* ================= EDIT ================= */
  const handleEdit = (shop: Shop) => {
    setEditingId(shop.id || null);
    setEditForm(shop);
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;

    const res = await fetch(`${API}/${editingId}`, {
  method: "PUT",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(editForm),
});

    const data = await res.json();

    if (res.ok) {
      setShops(
        shops.map((s) =>
          s.id === editingId ? data.data : s
        )
      );

      setEditingId(null);
      setEditForm(null);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this shop?")) return;

    await fetch(`${API}/${id}`, {
  method: "DELETE",
  credentials: "include",
});

    setShops(shops.filter((s) => s.id !== id));
  };


  if (!unlocked) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2>🔒 Partner Shops Locked</h2>

        <input
          className={styles.input}
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleUnlock();
          }}
        />

        <button className={styles.saveBtn} onClick={handleUnlock}>
          Unlock
        </button>
      </div>
    </div>
  );
}


  return (
    <div className={styles.page}>

      {/* ================= TABLE ================= */}
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Partner Shops</h2>

          
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Shop Name</th>
              <th>Category</th>
              <th>Coupons</th>
              
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {shops.map((shop) => (
              <tr key={shop.id}>

                {/* IMAGE */}
                <td>
                  {editingId === shop.id ? (
                    <input
                      className={styles.input}
                      value={editForm?.image || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm!,
                          image: e.target.value,
                        })
                      }
                    />
                  ) : (
                    shop.image && (
                      <img
                        src={shop.image}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 6,
                          objectFit: "cover",
                        }}
                      />
                    )
                  )}
                </td>

                {/* NAME */}
                <td>
                  {editingId === shop.id ? (
                    <input
                      className={styles.input}
                      value={editForm?.name || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm!,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    shop.name
                  )}
                </td>

                {/* CATEGORY */}
                <td>
                  {editingId === shop.id ? (
                    <input
                      className={styles.input}
                      value={editForm?.category || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm!,
                          category: e.target.value,
                        })
                      }
                    />
                  ) : (
                    shop.category
                  )}
                </td>

                {/* COUPONS */}
                <td>
                  {editingId === shop.id ? (
                    <input
                      className={styles.input}
                      value={editForm?.coupons || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm!,
                          coupons: e.target.value,
                        })
                      }
                    />
                  ) : (
                    shop.coupons
                  )}
                </td>

                {/* STATUS
                <td>
                  {editingId === shop.id ? (
                    <select
                      className={styles.input}
                      value={editForm?.status}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm!,
                          status: e.target.value as any,
                        })
                      }
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  ) : (
                    <span>
                      {shop.status}
                    </span>
                  )}
                </td> */}

                {/* ACTION */}
                <td>
                  {editingId === shop.id ? (
                    <>
                      <button
                        className={styles.saveBtn}
                        onClick={handleSave}
                      >
                        Save
                      </button>

                      <button
                        className={styles.cancelBtn}
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <Pencil
                        size={18}
                        onClick={() => handleEdit(shop)}
                      />

                      <Trash2
                        size={18}
                        onClick={() =>
                          handleDelete(shop.id)
                        }
                      />
                    </>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* ================= ADD FORM ================= */}
      <div className={styles.card}>
        <h2>Add Partner Shop</h2>

        <form onSubmit={handleAddShop} className={styles.form}>

          <input
            className={styles.input}
            placeholder="Image URL"
            value={form.image}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
          />

          <input
            className={styles.input}
            placeholder="Shop Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className={styles.input}
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <input
            className={styles.input}
            placeholder="Coupons"
            value={form.coupons}
            onChange={(e) =>
              setForm({ ...form, coupons: e.target.value })
            }
          />

          <select
            className={styles.input}
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as any,
              })
            }
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button className={styles.addBtn} type="submit">
            <Plus size={18} />
            Add Partner
          </button>
        </form>

      </div>

    </div>
  );
}