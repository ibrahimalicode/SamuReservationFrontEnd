import { useRef, useState } from "react";
import { CloseI } from "../../../assets/icons";
import { usePopup } from "../../../context/PopupContext";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

const AddOthers = ({
  day,
  index,
  time,
  facilitiy,
  facilities,
  setFacilities,
}) => {
  const toastId = useRef();
  const { user } = useAuth();
  const { setPopupContent } = usePopup();
  const [email, setEmail] = useState("");
  const [usersData, setUsersData] = useState([
    {
      FullName: `${user.FirstName} ${user.LastName}`,
      StudentNumber: user.IdNumber,
      UserId: user.Email,
    },
  ]);
  const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  async function handleSearch(e) {
    e.preventDefault();

    if (email == user.Email) return;
    if (!email.includes("samsun.edu.tr")) {
      toast.error("Lütfen okul E-Posta adresini giriniz. (samsun.edu.tr)");
      return;
    }
    if (usersData.some((U) => U.UserId == email)) {
      toast.error("Kullanıcıyı zaten eklediniz");
      return;
    }

    try {
      toastId.current = toast.loading("İşleniyor...");

      // Reference the user document by email
      const userRef = doc(db, "Users", email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // User data exists
        const userDoc = userSnap.data();
        const userData = {
          FullName: `${userDoc.FirstName} ${userDoc.LastName}`,
          StudentNumber: userDoc.IdNumber,
          UserId: userDoc.Email,
        };
        setUsersData([...usersData, userData]);
      } else {
        // User does not exist
        toast.dismiss(toastId.current);
        toast.error("Kullanıcı bulunamadı.");
      }
    } catch (error) {
      toast.dismiss(toastId.current);
      toast.error("Bir hata oluştu.");
      console.error("Error fetching user:", error);
    }
  }

  function handleTakeReservation() {
    if (facilitiy.MinUsers != usersData.length) {
      toast.dismiss(toastId.current);
      toast.error(
        `Lütfen en az ${facilitiy.MinUsers} en cok ${facilitiy.MaxUsers} kullanıcı ekleyiniz.`
      );
      return;
    }
    try {
      // Helper to calculate the next occurrence of the selected day
      const getNextOccurrence = (day) => {
        const targetDayIndex = daysOrder.indexOf(day);
        const now = new Date();

        // Get the difference in days from today
        const dayDiff = (targetDayIndex - now.getDay() + 7) % 7;

        // Calculate the next occurrence of the selected day
        const nextDate = new Date(now);
        nextDate.setDate(now.getDate() + dayDiff);
        nextDate.setHours(0, 0, 0, 0); // Set to start of the day

        return Timestamp.fromDate(nextDate);
      };

      // Determine the timestamp for the selected day
      const selectedDayTimestamp =
        day === new Date().toLocaleString("en-US", { weekday: "short" })
          ? Timestamp.now() // If today, use the current timestamp
          : getNextOccurrence(day); // Otherwise, calculate the next occurrence

      // Helper to update facilities and Firestore
      const updateFacility = (updatedPrograms) => {
        const updatedFacilities = [...facilities];
        const facilityIndex = updatedFacilities.findIndex(
          (fac) => fac.id === facilitiy.id
        );
        updatedFacilities[facilityIndex].Programs = updatedPrograms;

        // Update Firestore
        const facilityRef = doc(db, "Facilities", facilitiy.id);
        updateDoc(facilityRef, { Programs: updatedPrograms });

        // Update state
        setFacilities(updatedFacilities);
        console.log("Updated facilities:", updatedFacilities);
      };

      // Clone current programs
      const updatedPrograms = { ...facilitiy.Programs };
      const updatedUsers = time?.Users ? time.Users : [];

      if (
        !time?.LastTaken ||
        Timestamp.now().seconds > time.LastTaken.seconds
      ) {
        // Override Users and set PastUsers
        updatedPrograms[day][index] = {
          ...time,
          PastUsers: updatedUsers,
          Users: usersData,
          LastTaken: selectedDayTimestamp,
        };
      } else {
        // Append the current user to Users
        updatedPrograms[day][index] = {
          ...time,
          Users: usersData,
        };
      }

      // Apply updates
      updateFacility(updatedPrograms);
    } catch (err) {
      console.log(err);
      toast.dismiss(toastId.current);
      toast.error("Bir hata oluştu.");
      return;
    }

    setPopupContent(null);
    toast.dismiss(toastId.current);
    toast.success("Randevunuz başarıyla alınmıştır.");
  }

  return (
    <main className="py-8 px-4 max-h-[50rem] overflow-y-auto relative dark:text-white">
      <h1 className="text-center font-bold text-2xl">Kullanıcı Seç</h1>
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={() => setPopupContent(null)}
      >
        <CloseI />
      </button>

      <form className="flex items-end gap-5" onSubmit={handleSearch}>
        <div className="w-full">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            E-Posta <span className="text-blue-600">@samsun.edu.tr</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            min={10}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Ara..."
            required
          />
        </div>
        <div>
          <button
            disabled={email == user.Email}
            className="text-white bg-blue-700 hover:bg-blue-800 rounded-md text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 px-6 py-3 disabled:opacity-50"
          >
            Ara
          </button>
        </div>
      </form>

      <div className="mt-4">
        {usersData.length > 0 ? (
          <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-1 text-left">
                  Ad
                </th>
                <th className="border border-gray-300 px-4 py-1 text-left">
                  E-Posta
                </th>
                <th className="border border-gray-300 px-4 py-1 text-left">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((U, i) => (
                <tr key={i} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4">{U.FullName}</td>
                  <td className="border border-gray-300 px-4">{U.UserId}</td>
                  <td className="border border-gray-300 px-4">
                    <button
                      disabled={U.UserId == user.Email}
                      onClick={() => {
                        const updatedUsers = usersData.filter(
                          (_, index) => index !== i
                        );
                        setUsersData(updatedUsers);
                      }}
                      className="text-white bg-red-600 hover:bg-red-700 disabled:bg-red-700 disabled:opacity-50 px-4 py-2 rounded-sm"
                    >
                      Kaldır
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">
            Henüz bir kullanıcı seçilmedi.
          </p>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleTakeReservation}
          disabled={email == user.Email}
          className="text-white bg-blue-700 hover:bg-blue-800 rounded-md text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 px-6 py-3 disabled:opacity-50"
        >
          Randevu Al
        </button>
      </div>
    </main>
  );
};

export default AddOthers;
