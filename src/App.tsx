
import AppRoutes from "./routes/AppRoutes";
import "./styles/globals.css";

function App() {

  return <AppRoutes />;
}

export default App;

// import { useEffect, useState } from "react";
// import { supabase } from "./lib/supabase";
// import type { User } from "./features/user/types/user";

// export default function App() {
//   const [users, setUsers] = useState<User[]>([]);

//   useEffect(() => {
//     getUsers();
//   }, []);

//   // 🔹 READ
//   async function getUsers() {
//     const { data, error } = await supabase
//       .from("tbl_users")
//       .select("*");

//     if (error) {
//       console.error("Error fetching users:", error.message);
//       return;
//     }

//     setUsers(data || []);
//   }

//   // 🔹 UPDATE
//   async function updateUser(id: number) {
//     const newName = prompt("Enter new name:");
//     if (!newName) return;

//     const { error } = await supabase
//       .from("tbl_users")
//       .update({ name: newName })
//       .eq("id", id);

//     if (error) {
//       console.error("Update error:", error.message);
//       return;
//     }

//     getUsers(); // refresh
//   }

//   // 🔹 DELETE
//   async function deleteUser(id: number) {
//     const confirmDelete = confirm("Delete this user?");
//     if (!confirmDelete) return;

//     const { error } = await supabase
//       .from("tbl_users")
//       .delete()
//       .eq("id", id);

//     if (error) {
//       console.error("Delete error:", error.message);
//       return;
//     }

//     getUsers(); // refresh
//   }

//   return (
//     <div>
//       {users.map((user) => (
//         <div key={user.id} style={{ marginBottom: "10px" }}>
//           <span>{user.name}</span>

//           <button onClick={() => updateUser(user.id)}>
//             Update
//           </button>

//           <button onClick={() => deleteUser(user.id)}>
//             Delete
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }