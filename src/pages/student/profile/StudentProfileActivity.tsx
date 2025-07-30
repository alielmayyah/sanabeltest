import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../context/ThemeContext";
import { useUserContext } from "../../../context/StudentUserProvider";
import { treeStages } from "../../../data/Tree";
import sanabelType from "../../../data/SanabelTypeData";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

import { sanabelImgs } from "../../../data/SanabelDictionary";

const Profile: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { user } = useUserContext();
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");

  // Define a type for the keys of sanabelImgs
  type SanabelImgKeys = keyof typeof sanabelImgs;

  // Update the recentActivity type to include the correct key type
  interface Activity {
    createdAt: string;
    type: string;
    title: any;
  }

  // Update the state with the Activity type
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  // Function to fetch user data
  const fetchUserData = async (token?: string) => {
    setIsLoading(true);
    const authToken = token || localStorage.getItem("token");
    if (!authToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://sanabel.wonderlearn.net/students/student-task-completed",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Sort activities by date (newest first)
        const sortedActivities = [...response.data.completedTasks].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentActivity(sortedActivities);
        console.log("Recent Activity:", response.data.completedTasks);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const savedLanguage = localStorage.getItem("language") || "ar";

  // Calculate relative time with fixed implementation
  // Filter activities based on selected time range
  const filteredActivities = useMemo(() => {
    const now = new Date();

    switch (activeFilter) {
      case "today":
        return recentActivity.filter((activity) => {
          const activityDate = new Date(activity.createdAt);
          return activityDate.toDateString() === now.toDateString();
        });

      case "week":
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return recentActivity.filter((activity) => {
          const activityDate = new Date(activity.createdAt);
          return activityDate >= oneWeekAgo;
        });

      case "month":
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return recentActivity.filter((activity) => {
          const activityDate = new Date(activity.createdAt);
          return activityDate >= oneMonthAgo;
        });

      default:
        return recentActivity;
    }
  }, [recentActivity, activeFilter]);

  // Group activities by date for better organization
  const groupedActivities = useMemo(() => {
    const groups: { [date: string]: Activity[] } = {};

    filteredActivities.forEach((activity) => {
      const activityDate = new Date(activity.createdAt);
      const dateKey = activityDate.toDateString();

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(activity);
    });

    return Object.entries(groups).sort(
      (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
  }, [filteredActivities]);

  // Filter buttons animation variants
  const buttonVariants = {
    active: {
      backgroundColor: "#4AAAD6",
      color: "white",
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    inactive: {
      backgroundColor: "#F3F4F6",
      color: "#374151",
      scale: 1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col justify-start items-center h-full w-full overflow-y-auto pb-16 ${" text-gray-900"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={`w-full px-4 pb-6 flex flex-row-reverse justify-between gap-2 sticky  z-10 ${"bg-white"}`}
      >
        <motion.button
          variants={buttonVariants}
          animate={activeFilter === "all" ? "active" : "inactive"}
          onClick={() => setActiveFilter("all")}
          className="flex-1 py-2 text-sm font-medium rounded-lg shadow-sm"
        >
          {t("الكل")}
        </motion.button>
        <motion.button
          variants={buttonVariants}
          animate={activeFilter === "today" ? "active" : "inactive"}
          onClick={() => setActiveFilter("today")}
          className="flex-1 py-2 text-sm font-medium rounded-lg shadow-sm"
        >
          {t("اليوم")}
        </motion.button>
        <motion.button
          variants={buttonVariants}
          animate={activeFilter === "week" ? "active" : "inactive"}
          onClick={() => setActiveFilter("week")}
          className="flex-1 py-2 text-sm font-medium rounded-lg shadow-sm"
        >
          {t("الأسبوع")}
        </motion.button>
        <motion.button
          variants={buttonVariants}
          animate={activeFilter === "month" ? "active" : "inactive"}
          onClick={() => setActiveFilter("month")}
          className="flex-1 py-2 text-sm font-medium rounded-lg shadow-sm"
        >
          {t("الشهر")}
        </motion.button>
      </motion.div>
      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center w-full p-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-8 h-8 mb-4 border-4 rounded-full border-blueprimary border-t-blue-600"
          />
          <p className="text-gray-500">{t("جاري تحميل النشاطات...")}</p>
        </div>
      )}
      {/* Empty State */}
      {!isLoading && filteredActivities.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`flex flex-col items-center justify-center w-full p-8 mt-8 ${"bg-white"} rounded-lg shadow-sm`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-4 text-gray-400"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
            <line x1="16" x2="16" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="2" y2="6"></line>
            <line x1="3" x2="21" y1="10" y2="10"></line>
            <path d="M8 14h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M16 14h.01"></path>
            <path d="M8 18h.01"></path>
            <path d="M12 18h.01"></path>
            <path d="M16 18h.01"></path>
          </svg>
          <p className={`text-lg font-medium ${"text-gray-700"}`}>
            {t("لا توجد نشاطات")}
          </p>
          <p className="mt-2 text-center text-gray-500">
            {activeFilter === "all"
              ? t("لم تقم بإكمال أي مهام بعد")
              : t("لا توجد نشاطات في هذه الفترة")}
          </p>
        </motion.div>
      )}
      {/* Activity List */}
      {!isLoading && groupedActivities.length > 0 && (
        <div className="w-full px-4">
          {groupedActivities.map(([dateKey, activities], groupIndex) => (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.05, duration: 0.4 }}
              className="mb-4"
            >
              {/* Date Header */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: groupIndex * 0.05 + 0.1, duration: 0.3 }}
                className={`mb-2 pb-1 border-b ${"border-gray-200"}`}
              >
                <h2 className={`text-sm ${"text-gray-600"}`}>
                  {new Date(dateKey).toLocaleDateString(savedLanguage, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
              </motion.div>

              {/* Activities for this date */}
              {activities.map((activity, index) => (
                <motion.div
                  key={`${activity.createdAt}-${index}`}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: groupIndex * 0.05 + index * 0.03 + 0.2,
                    duration: 0.3,
                  }}
                  className={`flex items-center p-3 mb-2 rounded-lg ${"bg-white "} shadow-sm transition duration-200`}
                >
                  {/* Activity Icon */}
                  <div
                    className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${"bg-blue-50"}`}
                  >
                    <img
                      src={sanabelImgs[activity.type]}
                      alt={activity.type}
                      className="w-8 h-8"
                    />
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 mr-4 text-right">
                    <h3 className={`font-medium ${"text-blueprimary"}`}>
                      {t(t("سنبلة") + " " + t(activity.type))}
                    </h3>
                    <p className={`text-sm ${"text-gray-700"}`}>
                      {t(activity.title)}
                    </p>
                  </div>

                  {/* Activity Time */}
                  <div className="flex flex-col items-end">
                    <span className={`text-xs mt-1 ${"text-gray-400"}`}>
                      {new Date(activity.createdAt).toLocaleTimeString(
                        savedLanguage,
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      )}
      {/* Summary Box */}
      {!isLoading && filteredActivities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`fixed bottom-4 left-4 right-4 p-3 rounded-lg shadow-lg flex justify-between items-center ${"bg-white"}`}
        >
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${"bg-blue-100 text-blue-600"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
              </svg>
            </div>
            <div>
              <h4 className={`text-sm font-medium ${"text-gray-800"}`}>
                {t("مجموع النشاطات")}
              </h4>
              <p className={`text-xs ${"text-gray-500"}`}>
                {activeFilter === "all"
                  ? t("كل الوقت")
                  : activeFilter === "today"
                  ? t("اليوم")
                  : activeFilter === "week"
                  ? t("هذا الأسبوع")
                  : t("هذا الشهر")}
              </p>
            </div>
          </div>
          <div className={`text-xl font-bold ${"text-blue-600"}`}>
            {filteredActivities.length}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Profile;
