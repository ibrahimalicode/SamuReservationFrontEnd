import { useState } from "react";
import UserActions from "./actions/UserActions";

const UsersTable = ({ users }) => {
  const [open, setOpen] = useState(null);
  return (
    <div className="relative h-max sm:rounded-lg overflow-x-auto ">
      <table className="w-full h-max text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Ad Soyad
            </th>
            <th scope="col" className="px-6 py-3">
              E-Posta
            </th>
            <th scope="col" className="px-6 py-3">
              Tel
            </th>
            <th scope="col" className="px-6 py-3">
              Role
            </th>
            <th scope="col" className="px-6 py-3">
              Cinsiyet
            </th>
            <th scope="col" className="px-6 py-3">
              Bölüm
            </th>
            <th scope="col" className="px-6 py-3">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <tr
              key={user.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {user.FirstName} {user.LastName}
              </th>
              <td className="px-6 py-4">{user.Email}</td>
              <td className="px-6 py-4">{user.PhoneNumber}</td>
              <td className="px-6 py-4">
                {user.Auth == 0 ? "Yetkili" : "Kulanıcı"}
              </td>

              <td className="px-6 py-4">
                {user.Gender == 0 ? "Kız" : "Erkek"}
              </td>
              <td className="px-6 py-4">{user.Department}</td>
              <td className="px-6 py-4">
                <UserActions
                  userId={user.id}
                  index={index}
                  open={open}
                  setOpen={setOpen}
                  user={user}
                  itemNumber={users.length}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
