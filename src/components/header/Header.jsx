//modules
// import toast from "react-hot-toast";
import { useState } from "react";
import { Link } from "react-router-dom";

//comp
import { UserI } from "../../assets/icons";
import MenuI from "../../assets/icons/menu";
// import logo from "../../assets/icons/logo.svg";

//redux
import { useAuth } from "../../context/AuthContext";

const Header = ({ isSideOpen, setIsSideOpen }) => {
  // const toastId = useRef();
  const { user } = useAuth();
  // const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  function handleLogout() {
    //
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              onClick={() => setIsSideOpen(!isSideOpen)}
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <MenuI />
            </button>
            <Link
              to="https://holiday.ashamlolie.com"
              className="flex ms-2 md:me-24"
            >
              {/* <img src={logo} className="h-8 me-3" alt="ashamholiday Logo" /> */}
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                Samu Reservasyon
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3 relative">
              <div>
                <button
                  type="button"
                  onClick={() => setOpenMenu(!openMenu)}
                  className="flex text-sm dark:bg-gray-800 bg-gray-50 rounded-full"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                  <UserI className="size-[2rem]" />
                </button>
              </div>
              <div
                className={`z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 ${
                  openMenu ? "absolute right-2 top-2" : "hidden"
                }`}
                id="dropdown-user"
              >
                <div className="px-4 py-3" role="none">
                  <p
                    className="text-sm text-gray-900 dark:text-white"
                    role="none"
                  >
                    {user?.FirstName}
                  </p>
                  <p
                    className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                    role="none"
                  >
                    {user?.Email}
                  </p>
                </div>
                <ul className="py-1" role="none">
                  <li>
                    <Link
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 whitespace-nowrap hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      Çıkış Yap
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
