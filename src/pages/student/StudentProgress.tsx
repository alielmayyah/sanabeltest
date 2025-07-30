import { useTheme } from "../../context/ThemeContext";

import { useTranslation } from "react-i18next";
import { useState } from "react";

import StudentNavbar from "../../components/navbar/StudentNavbar";

// Pages
import ProgressMissions from "./progress/ProgressMissions";
import ProgressMedals from "./progress/ProgressMedals";
import ProgressTrophies from "./progress/ProgressTrophies";
import ProgressTree from "./progress/ProgressTree";
// Navbar

import missionsDoneImg from "../../assets/target.png";
import trophyIcon from "../../assets/trophy.png";
import xpIcon from "../../assets/resources/اكس بي.png";
import tree from "../../assets/tree/28.png";

const navbar = [
  { name: "التحديات", icon: missionsDoneImg },
  { name: "الجوائز", icon: trophyIcon },
  { name: "المستوي", icon: xpIcon },
  { name: "الشجرة", icon: tree },
];

const Progress: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { t } = useTranslation();
  const [selectProgressType, setSelectProgressType] = useState(3);

  return (
    <div
      className="flex flex-col h-full w-full items-center justify-between p-4 gap-0"
      id="page-height"
    >
      <div className="flex flex-col gap-0 justify-center items-end w-full">
        <h1 className="text-black font-bold text-2xl text-end ">
          {t("تقدمك نحو الخير")}
        </h1>

        <p className="text-[#B3B3B3] text-sm  text-end ">
          {t("تابع إنجازاتك وازرع سنابل الخير كل يوم")}
        </p>
      </div>

      <div className="flex w-full bg-[#E6E6E6] rounded-3xl p-1 gap-2 justify-between items-center">
        {navbar.map((item, index) => (
          <div
            key={index}
            className={`flex transition-all cursor-pointer ${
              selectProgressType === index
                ? "flex-[2] bg-blueprimary text-white shadow-lg"
                : "flex-[1] bg-gray-100 text-gray-700 hover:bg-blue-100"
            } rounded-2xl py-2 items-center justify-center gap-2`}
            onClick={() => setSelectProgressType(index)}
          >
            <img
              src={item.icon}
              alt="icon"
              className="p-2 bg-white rounded-full w-12 h-12 shadow-md"
            />
            <h1
              className={`text-sm font-medium ${
                selectProgressType === index ? "block" : "hidden"
              }`}
            >
              {t(item.name)}
            </h1>
          </div>
        ))}
      </div>

      {selectProgressType == 0 && <ProgressMissions />}
      {selectProgressType == 1 && <ProgressTrophies />}
      {selectProgressType == 2 && <ProgressMedals />}
      {selectProgressType == 3 && <ProgressTree />}

      <StudentNavbar />
    </div>
  );
};

export default Progress;
