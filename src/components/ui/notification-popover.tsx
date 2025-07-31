"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useThemeMode } from '../../contexts/ThemeContext'; // Import useThemeMode
import { formatDateToDDMMYYYYHHMM } from '../../utils/dateUtils'; // Import date utility
import { useLanguage } from '../../contexts/LanguageContext'; // Import useLanguage

export type Notification = {
  id: string;
  title: string;
  description: string;
  created_date: string; // Changed from timestamp: Date
  status: 'read' | 'unread'; // Changed from read: boolean
  link?: string; // Added link
  priority?: string; // Added priority
  source_id?: string; // Added source_id
  type?: string; // Added type
};

interface NotificationItemProps {
  notification: Notification;
  index: number;
  onMarkAsRead: (id: string) => void;
  textColor?: string;
  hoverBgColor?: string;
  dotColor?: string;
  onNotificationClick: (notification: Notification) => void; // Added click handler
}

const NotificationItem = ({
  notification,
  index,
  onMarkAsRead,
  textColor = "text-white",
  dotColor = "bg-white",
  hoverBgColor = "hover:bg-[#ffffff37]",
  onNotificationClick,
}: NotificationItemProps) => {
  const { theme } = useThemeMode();
  const isUnread = notification.status === 'unread';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.3, delay: index * 0.05 }} // Reduced delay for faster animation
      key={notification.id}
      className={cn(
        `p-4 cursor-pointer transition-colors`,
        isUnread ? `bg-[${theme.palette.background.paper}]` : `bg-[${theme.palette.background.default}]`, // Dynamic background
        hoverBgColor // Use passed hover color
      )}
      onClick={() => onNotificationClick(notification)} // Use the new click handler
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {isUnread && (
            <span className={`h-1 w-1 rounded-full`} style={{ backgroundColor: theme.palette.primary.main }} /> // Dynamic dot color
          )}
          <h4 className={`text-sm font-medium`} style={{ color: isUnread ? theme.palette.text.primary : theme.palette.text.secondary }}>
            {notification.title}
          </h4>
        </div>

        <span className={`text-xs opacity-80`} style={{ color: theme.palette.text.secondary }}>
          {formatDateToDDMMYYYYHHMM(notification.created_date)}
        </span>
      </div>
      <p className={`text-xs opacity-70 mt-1`} style={{ color: theme.palette.text.secondary }}>
        {notification.description}
      </p>
    </motion.div>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  textColor?: string;
  hoverBgColor?: string;
  dividerColor?: string;
  onNotificationClick: (notification: Notification) => void; // Added click handler
}

const NotificationList = ({
  notifications,
  onMarkAsRead,
  textColor,
  hoverBgColor,
  dividerColor = "divide-gray-200/40",
  onNotificationClick,
}: NotificationListProps) => {
  const { theme } = useThemeMode();
  const { t } = useLanguage(); // Use translation hook
  return (
    <div className={`divide-y`} style={{ borderColor: theme.palette.divider }}>
      {notifications.length === 0 ? (
        <p className="p-4 text-sm" style={{ color: theme.palette.text.secondary }}>{t('notificationsPage.noNotifications')}</p>
      ) : (
        notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            index={index}
            onMarkAsRead={onMarkAsRead}
            textColor={textColor}
            hoverBgColor={hoverBgColor}
            onNotificationClick={onNotificationClick}
          />
        ))
      )}
    </div>
  );
};

interface NotificationPopoverProps {
  notifications: Notification[]; // Now required
  onMarkAllAsRead: () => void; // New prop for marking all as read
  onMarkAsRead: (id: string) => void; // New prop for marking single as read
  onNotificationClick: (notification: Notification) => void; // New prop for handling notification click
  buttonClassName?: string;
  popoverClassName?: string;
  textColor?: string;
  hoverBgColor?: string;
  dividerColor?: string;
  headerBorderColor?: string;
}

export const NotificationPopover = ({
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  onNotificationClick,
  buttonClassName, // Removed default, let DashboardLayout handle it
  popoverClassName, // Removed default
  textColor, // Removed default
  hoverBgColor, // Removed default
  dividerColor, // Removed default
  headerBorderColor, // Removed default
}: NotificationPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useThemeMode();
  const { t } = useLanguage(); // Use translation hook

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className={`relative`} style={{ color: theme.palette.text.primary }}>
      <Button
        onClick={toggleOpen}
        size="icon"
        className={cn("relative", buttonClassName)}
        style={{
          backgroundColor: theme.palette.background.paper, // Use theme color
          color: theme.palette.text.secondary, // Use theme color
          border: `1px solid ${theme.palette.divider}`, // Use theme color
          boxShadow: 'none', // Remove default shadcn shadow
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs border text-white"
            style={{
              backgroundColor: theme.palette.error.main, // Use theme color for badge
              borderColor: theme.palette.background.paper, // Use theme color for badge border
            }}
          >
            {unreadCount}
          </div>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto rounded-xl shadow-lg",
              popoverClassName
            )}
            style={{
              backgroundColor: theme.palette.background.paper, // Use theme color
              border: `1px solid ${theme.palette.divider}`, // Use theme color
              boxShadow: theme.palette.mode === 'dark' ? '0px 8px 24px rgba(0, 0, 0, 0.4)' : '0px 8px 24px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              className={`p-4 border-b flex justify-between items-center`}
              style={{ borderColor: theme.palette.divider }}
            >
              <h3 className="text-sm font-medium" style={{ color: theme.palette.text.primary }}>{t('notificationsPage.yourNotifications')}</h3>
              <Button
                onClick={onMarkAllAsRead}
                variant="ghost"
                size="sm"
                className={`text-xs`}
                style={{
                  color: theme.palette.text.secondary,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.text.primary,
                  },
                }}
              >
                {t('notificationsPage.markAllAsRead')}
              </Button>
            </div>

            <NotificationList
              notifications={notifications}
              onMarkAsRead={onMarkAsRead}
              textColor={textColor}
              hoverBgColor={hoverBgColor}
              dividerColor={dividerColor}
              onNotificationClick={(notif) => {
                onNotificationClick(notif);
                setIsOpen(false); // Close popover on click
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
