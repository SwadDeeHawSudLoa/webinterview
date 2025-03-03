"use client";
import { useState, useEffect } from "react";

interface User {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  age: number;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [sortByAge, setSortByAge] = useState(false);

  useEffect(() => {
    fetch(`/api/users?first_name=${search}&last_name=${search}&sort=${sortByAge ? "age" : ""}`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, [search, sortByAge]);

  const handleDelete = async (id: number) => {
    await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-2">
        <input
          placeholder="ค้นหาชื่อ-นามสกุล"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setSortByAge(!sortByAge)}>
          เรียงตามอายุ {sortByAge ? "⬆️" : "⬇️"}
        </button>
      </div>

      <div className="p-6">
        <h1 className="flex justify-center text-4xl">All Users</h1>
        <div className="grid">
          {users.map((user) => (
            <div
              key={user.id}
              className="px-20 mt-10 rounded-lg bg-amber-200 p-4 shadow-md text-black"
            >
              <p className="text-4xl">
                {user.title} {user.first_name} {user.last_name}
              </p>
              <p>Birth Date: {user.birth_date}</p>
              <p>Age: {user.age} years old</p>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-amber-950 text-amber-400"
              >
                delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
