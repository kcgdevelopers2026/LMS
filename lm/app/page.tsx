"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    router.push("/users/auth");
  }, [router]);

  return <h1>Loading...</h1>;
}