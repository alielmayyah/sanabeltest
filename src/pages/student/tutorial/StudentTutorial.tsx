import { useTranslation } from "react-i18next";
import PrimaryButton from "../../../components/PrimaryButton";
import i18n from "../../../i18n";
import BackArrow from "../../../icons/BackArrow";
import { useHistory } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { medalsImgs } from "../../../data/Medals";
import xpIcon from "../../../assets/resources/اكس بي.png";
import lock from "../../../icons/lock.svg";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import Intro from "./Intro";
import Promo from "./Promo";
import ProfilePicture from "./ProfilePicture";
import XpStep from "./XpIntro";
import LevelStep from "./LevelStep";
import MedalsStep from "./MedalsStep";
import Leaderboard from "./Leaderboard";
import Sanabel from "./Sanabel";
import SanabelMissions from "./SanabelMissions";
import SanabelTypes from "./SanabelTypes";
import Rewards from "./Rewards";
import Shop from "./Shop";
import TreeGrow from "./TreeGrow";
import TreeFrames from "./TreeFrames";
import Outro from "./Outro";
import Trophies from "./Trophies";

import { avatars } from "../../../data/Avatars";

import { useUserContext } from "../../../context/StudentUserProvider";

const StudentTutorial: React.FC = () => {
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [stepCount, setStepCount] = useState(0);
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);

  const [treeProgress, setTreeProgress] = useState(0);
  const [treeFrames, setTreeFrames] = useState(0);
  const [isShopDone, seIsShopDone] = useState(false);

  const [trophyIndex, setTrophyIndex] = useState(0);

  const typeColors = [
    "bg-blueprimary",
    "bg-redprimary",
    "bg-yellowprimary",
    "bg-greenprimary",
  ];

  const updateTypeIndex = (index: number) => {
    setCurrentTypeIndex(index);
  };

  const { user } = useUserContext();

  const steps = [
    <ProfilePicture />,
    <Intro name={`${user?.firstName}`} />,
    <Promo />,
    <SanabelTypes />,
    <Sanabel
      onTypeChange={updateTypeIndex}
      currentTypeIndex={currentTypeIndex}
    />,
    <SanabelMissions />,
    <Trophies trophyIndex={trophyIndex} setTrophyIndex={setTrophyIndex} />,
    <Rewards />,
    <Shop isShopDone={isShopDone} seIsShopDone={seIsShopDone} />,

    <TreeGrow treeProgress={treeProgress} setTreeProgress={setTreeProgress} />,
    <TreeFrames treeFrames={treeFrames} setTreeFrames={setTreeFrames} />,

    <XpStep />,
    <LevelStep />,
    <MedalsStep />,
    <Leaderboard />,
    <Outro />,
  ];

  // Handle step navigation
  function changeStepIncrement() {
    if (stepCount < steps.length - 1) {
      setStepCount(stepCount + 1);

      setTreeProgress(0);
      setTreeFrames(0);
      seIsShopDone(false);
    }
  }

  function changeStepDecrement() {
    if (stepCount > 0) {
      setStepCount(stepCount - 1);
      setTreeProgress(0);
      setTreeFrames(0);
      seIsShopDone(false);
    }
  }

  // Only apply the background color when on the SanabelTypes step

  const [bgColor, setBgColor] = useState("bg-white");

  useEffect(() => {
    if (stepCount === 4) {
      setBgColor(typeColors[currentTypeIndex]);
    } else if (stepCount === 5) {
      setBgColor("bg-blueprimary");
    } else if (stepCount === 6) {
      if (trophyIndex == 1) {
        setBgColor("bg-blueprimary/30");
      } else {
        setBgColor("bg-yellowprimary/30");
      }
    } else {
      setBgColor("bg-white");
    }
  }, [stepCount, currentTypeIndex, typeColors]);

  const navigationButton = (
    <div className="flex items-center w-full gap-2">
      <div className="flex-1 border-2 border-white rounded-2xl">
        <PrimaryButton
          style="fill"
          text={stepCount === steps.length - 1 ? t("ابدأ الآن") : t("متابعة")}
          arrow={isRTL ? "left" : "right"}
          onClick={changeStepIncrement}
        />
      </div>
      {stepCount > 0 && (
        <div
          className="flex-center p-3 border-2 border-[#EAECF0] bg-white rounded-xl w-14 h-14 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={changeStepDecrement}
        >
          <BackArrow
            size={24}
            className={`text-gray-500 ${isRTL ? "" : "rotate-180"}`}
          />
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`flex flex-col items-center justify-between p-4 h-full w-full ${bgColor} transition-colors duration-500`}
    >
      {/* Progress indicator */}
      <div className="flex flex-row-reverse justify-center gap-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 
        ${stepCount === index ? "w-8 bg-yellow-500" : "w-2 bg-gray-300"}`}
          />
        ))}
      </div>

      <div
      // key={reRenderKey}
      >
        {steps[stepCount]}
      </div>

      {/* Navigation buttons */}
      {(stepCount !== 9 || (stepCount === 9 && treeProgress > 3)) &&
        (stepCount !== 8 || isShopDone) &&
        stepCount != steps.length - 1 &&
        navigationButton}

      {(stepCount === 9 && treeProgress < 4) ||
      (stepCount === 8 && !isShopDone) ||
      stepCount == steps.length - 1 ? (
        <div className=""></div>
      ) : null}
    </div>
  );
};

export default StudentTutorial;
