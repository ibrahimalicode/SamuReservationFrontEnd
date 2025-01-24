import toast from "react-hot-toast";
import { db } from "../../../firebase";
import React, { useState } from "react";
import { CloseI } from "../../../assets/icons";
import { usePopup } from "../../../context/PopupContext";
import { collection, doc, setDoc } from "firebase/firestore";

const AddFacility = () => {
  const { setPopupContent } = usePopup();

  function handleClick() {
    setPopupContent(<AddFacilityPopup />);
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
function AddFacilityPopup() {
  const { setPopupContent } = usePopup();

  const [isLoading, setIsLoading] = useState(false);
  const [facilitiyData, setFacilitiyData] = useState({
    Name: "",
    Description: "",
    MaxUsers: "",
    MinUsers: "",
    UserPerWeek: "",
    IsGenderDifferent: true,
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
    setFacilitiyData((prev) => ({
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
    setFacilitiyData((prev) => ({
      ...prev,
      Programs: {
        ...prev.Programs,
        [day]: prev.Programs[day].filter((_, i) => i !== index),
      },
    }));
  };

  const handleInputChange = (day, index, field, value) => {
    setFacilitiyData((prev) => ({
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
        ...facilitiyData,
        createdAt: new Date(),
      });

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
    <div className="py-8 px-4 max-h-[95vh] overflow-y-auto relative">
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
              value={facilitiyData.Name}
              onChange={(e) =>
                setFacilitiyData((prev) => {
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
              value={facilitiyData.Description}
              onChange={(e) =>
                setFacilitiyData((prev) => {
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
              value={facilitiyData.MinUsers}
              onChange={(e) =>
                setFacilitiyData((prev) => {
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
              value={facilitiyData.MaxUsers}
              onChange={(e) =>
                setFacilitiyData((prev) => {
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
              htmlFor="UserPerDay"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Kullanıcının Günde Max Rezervasyon Sayısı
            </label>
            <input
              type="number"
              name="UserPerDay"
              id="UserPerDay"
              value={facilitiyData.UserPerDay}
              onChange={(e) =>
                setFacilitiyData((prev) => {
                  return {
                    ...prev,
                    UserPerDay: e.target.value,
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
              value={facilitiyData.UserPerWeek}
              onChange={(e) =>
                setFacilitiyData((prev) => {
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

          <div>
            <div className="flex items-center gap-3">
              <label
                htmlFor="GenderDiff"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Kadın-Erkek ayrı mı
              </label>

              <input
                type="checkbox"
                name="GenderDiff"
                id="GenderDiff"
                className="size-4"
                checked={facilitiyData.IsGenderDifferent}
                onChange={() =>
                  setFacilitiyData((prev) => {
                    return {
                      ...prev,
                      IsGenderDifferent: !facilitiyData.IsGenderDifferent,
                    };
                  })
                }
              />
            </div>
          </div>

          {Object.keys(facilitiyData.Programs).map((day, i) => (
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
              {facilitiyData.Programs[day].map((program, index) => (
                <React.Fragment key={index}>
                  {index == 0 && (
                    <div className="flex items-center mb-1 space-x-2 text-sm">
                      <p className="w-full">Başlangıç Saati</p>
                      <p className="w-full">Bitiş Saati</p>
                      {facilitiyData.IsGenderDifferent && (
                        <p className="w-full">Cinsiyet</p>
                      )}
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
                    {facilitiyData.IsGenderDifferent && (
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
                          Kadın
                        </button>
                      </div>
                    )}

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
