import React, { useState } from "react";
import { CloseI } from "../../../assets/icons";
import { usePopup } from "../../../context/PopupContext";
import toast from "react-hot-toast";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const AddFacility = ({ onSuccess }) => {
  const { setPopupContent } = usePopup();

  function handleClick() {
    setPopupContent(<AddFacilityPopup onSuccess={onSuccess} />);
  }
  return (
    <button
      onClick={handleClick}
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      Tesis Ekle
    </button>
  );
};

export default AddFacility;

//
//POPUP
function AddFacilityPopup({ onSuccess }) {
  const { setPopupContent } = usePopup();

  const [isLoading, setIsLoading] = useState(false);
  const [facilityData, setFacilityData] = useState({
    Name: "",
    Description: "",
    MaxUsers: "",
    MinUsers: "",
    UserPerWeek: "",
    Programs: {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
    },
  });

  const handleAddTime = (day) => {
    setFacilityData((prev) => ({
      ...prev,
      Programs: {
        ...prev.Programs,
        [day]: [
          ...prev.Programs[day],
          {
            StartTime: "",
            EndTime: "",
            NumberOfUsers: 0, // default values for new time entry
          },
        ],
      },
    }));
  };

  const handleRemoveTime = (day, index) => {
    setFacilityData((prev) => ({
      ...prev,
      Programs: {
        ...prev.Programs,
        [day]: prev.Programs[day].filter((_, i) => i !== index),
      },
    }));
  };

  const handleInputChange = (day, index, field, value) => {
    setFacilityData((prev) => ({
      ...prev,
      Programs: {
        ...prev.Programs,
        [day]: prev.Programs[day].map((entry, i) =>
          i === index ? { ...entry, [field]: value } : entry
        ),
      },
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsLoading(true);
      toast.loading("İşleniyor...");

      const newFacilityRef = doc(collection(db, "Facilities"));
      await setDoc(newFacilityRef, {
        ...facilityData,
        createdAt: new Date(),
      });

      onSuccess();
      toast.dismiss();
      setIsLoading(false);
      setPopupContent(null);
      toast.success("Tesis başarıyla eklendi.");
    } catch (error) {
      toast.dismiss();
      setIsLoading(false);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyiniz");
      console.error("Error during registration:", error.message);
    }
  }

  return (
    <div className="py-8 px-4 max-h-[50rem] overflow-y-auto relative">
      <h1 className="text-center font-bold text-2xl">Tesis Ekle</h1>
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={() => setPopupContent(null)}
      >
        <CloseI />
      </button>
      <div className="relative w-full max-w-2xl max-h-full">
        <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="Name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              İsim
            </label>
            <input
              type="text"
              name="Name"
              id="Name"
              value={facilityData.Name}
              onChange={(e) =>
                setFacilityData((prev) => {
                  return {
                    ...prev,
                    Name: e.target.value,
                  };
                })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="İsim"
              required
            />
          </div>

          <div>
            <label
              htmlFor="Description"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Açıklama
            </label>
            <input
              type="text"
              name="Description"
              id="Description"
              value={facilityData.Description}
              onChange={(e) =>
                setFacilityData((prev) => {
                  return {
                    ...prev,
                    Description: e.target.value,
                  };
                })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Açıklama"
              required
            />
          </div>

          <div>
            <label
              htmlFor="MinUsers"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Min Kullanıcı Sayısı
            </label>
            <input
              type="number"
              name="MinUsers"
              id="MinUsers"
              value={facilityData.MinUsers}
              onChange={(e) =>
                setFacilityData((prev) => {
                  return {
                    ...prev,
                    MinUsers: e.target.value,
                  };
                })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Min"
              required
            />
          </div>

          <div>
            <label
              htmlFor="MaxUsers"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Max Kullanıcı Sayısı
            </label>
            <input
              type="number"
              name="MaxUsers"
              id="MaxUsers"
              value={facilityData.MaxUsers}
              onChange={(e) =>
                setFacilityData((prev) => {
                  return {
                    ...prev,
                    MaxUsers: e.target.value,
                  };
                })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Max"
              required
            />
          </div>

          <div>
            <label
              htmlFor="MinUsers"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Kullanıcının Hafatada Max Rezervasyon Sayısı
            </label>
            <input
              type="number"
              name="UserPerWeek"
              id="UserPerWeek"
              value={facilityData.UserPerWeek}
              onChange={(e) =>
                setFacilityData((prev) => {
                  return {
                    ...prev,
                    UserPerWeek: e.target.value,
                  };
                })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Max"
              required
            />
          </div>

          {Object.keys(facilityData.Programs).map((day, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2 text-sm font-medium text-gray-900 dark:text-white border-b">
                <p>{day}</p>
                <button
                  type="button"
                  onClick={() => handleAddTime(day)}
                  className="text-white text-xs bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Saat Ekle
                </button>
              </div>
              {facilityData.Programs[day].map((program, index) => (
                <React.Fragment key={index}>
                  {index == 0 && (
                    <div className="flex items-center mb-1 space-x-2 text-sm">
                      <p className="w-full">Başlangıç Saati</p>
                      <p className="w-full">Bitiş Saati</p>
                      <p className="w-full">Cinsiyet</p>
                    </div>
                  )}
                  <div className="flex items-center mb-1 space-x-2">
                    <input
                      type="text"
                      value={program.StartTime}
                      onChange={(e) =>
                        handleInputChange(
                          day,
                          index,
                          "StartTime",
                          e.target.value
                        )
                      }
                      className="p-2 border rounded"
                    />
                    <input
                      type="text"
                      value={program.EndTime}
                      onChange={(e) =>
                        handleInputChange(day, index, "EndTime", e.target.value)
                      }
                      className="p-2 border rounded"
                    />
                    <div className="min-w-max flex gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleInputChange(day, index, "Gender", 1)
                        }
                        className={`text-sm w-16 py-1.5 ${
                          program.Gender == 1
                            ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            : "text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        }`}
                      >
                        Erkek
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleInputChange(day, index, "Gender", 0)
                        }
                        className={`text-sm w-16 py-1.5 ${
                          program.Gender == 0
                            ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            : "text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        }`}
                      >
                        Kız
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(day, index)}
                      className="text-white text-xs bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-md px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    >
                      -
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
