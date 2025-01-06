import MenuI from "../../../assets/icons/menu";
import EditUser from "./EditUser";

const UserActions = ({ index, open, setOpen, user, itemNumber }) => {
  function handleMenuOpen() {
    setOpen(open === index ? null : index);
  }

  return (
    <div className="w-ful flex items-center justify-center relative cursor-pointer">
      <span onClick={handleMenuOpen}>
        {" "}
        <MenuI />
      </span>
      <div
        className={`absolute right-12  text-gray-700 bg-gray-50 shadow dark:bg-gray-700 dark:text-gray-400 rounded-md overflow-clip ${
          index <= itemNumber / 2 ? "top-1" : "bottom-0"
        } ${open !== index ? "hidden" : index}`}
      >
        <ul>
          <EditUser user={user} setOpen={setOpen} />
        </ul>
      </div>
    </div>
  );
};

export default UserActions;
