import { Link, useParams } from "react-router-dom";
import { AdjustI, OrdersI, PackagesI, PlusI, UsersI } from "../../assets/icons";
import { useAuth } from "../../context/AuthContext";
import MenuI from "../../assets/icons/menu";

const Sidebar = ({ isSideOpen, setIsSideOpen }) => {
  const params = useParams()["*"];
  const { user } = useAuth();

  const sidebar = [
    {
      label: "Rapor",
      icon: <OrdersI />,
      path: "/dashboard",
      param: "dashboard",
      show: user.Auth === 0,
    },
    {
      label: "Kullanıcılar",
      icon: <UsersI />,
      path: "/users",
      param: "users",
      show: user.Auth === 0,
    },
    {
      label: "Tesisler",
      icon: <MenuI />,
      path: "/facilities",
      param: "facilities",
      show: true,
    },
    {
      label: "Ayarlar",
      icon: <AdjustI />,
      path: "/settings",
      param: "settings",
      show: user.Auth === 0,
    },
    {
      label: "Talep-İstek",
      icon: <PlusI />,
      path: "/requests",
      param: "requests",
      show: true,
    },
    {
      label: "Sosyal Medya",
      icon: <PackagesI />,
      path: "/contact",
      param: "contact",
      show: true,
    },
  ];
  return (
    <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-24 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700 ${
        isSideOpen && "translate-x-0"
      }`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-normal">
          {sidebar
            .filter((S) => S.show)
            .map((side) => (
              <li key={side.label}>
                <Link
                  to={side.path}
                  onClick={() => setIsSideOpen(false)}
                  className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    params === side.param &&
                    "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  {side.icon}
                  <span className="ms-3">{side.label}</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
