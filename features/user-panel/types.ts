import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type UserProfile = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type UserReservation = {
  id: string;
  title: string;
  checkIn: string;
  guests: number;
  status: ReservationStatus;
  reference: string;
};

export type WalletTransaction = {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: "credit" | "debit";
};
