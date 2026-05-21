// import { useEffect, useState } from "react";
// import type { User } from "../typs/User";
// import { adminService } from "../services/userService";
// import { delay } from "../../../utils/delay";
// export default function useUsers() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const start = Date.now();

//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const data = await adminService.getAllUsers();

//           const elapsed = Date.now() - start;
  
//           if (elapsed < 500) {
//             await delay(500 - elapsed);
//           }
//         setUsers(data);
//       } catch (error) {
//         console.error(error);
//         setUsers([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const getUserById = async (id: number) => {
//     const user = await adminService.getUserById(id);
//     setSelectedUser(user);
//     return user;
//   };

//   const clearSelection = () => setSelectedUser(null);

//   return { users, selectedUser, loading, getUserById, clearSelection };
// }


import { useEffect, useState, useCallback } from "react";
import type { User } from "../types/User"; // Fixed typo 'typs'
import { adminService } from "../services/userService";
import { delay } from "../../../utils/delay";

export default function useUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const startTime = Date.now();
      try {
        setLoading(true);
        const data = await adminService.getAllUsers();
        
        const elapsed = Date.now() - startTime;
        if (elapsed < 500) {
          await delay(500 - elapsed);
        }
        setUsers(data || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getUserById = useCallback(async (id: number) => {
    try {
      const user = await adminService.getUserById(id);
      setSelectedUser(user);
      return user;
    } catch (error) {
      console.error("Error fetching user detail:", error);
    }
  }, []);

  const clearSelection = useCallback(() => setSelectedUser(null), []);

  return { users, selectedUser, loading, getUserById, clearSelection };
}