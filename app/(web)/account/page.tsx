import type { Metadata } from "next";

import AccountSettings from "@/components/pages/account/account-settings";

export const metadata: Metadata = {
  title: "Account Settings",
  description:
    "Manage your Gravis customer profile and account preferences in one place.",
};

export default function AccountPage() {
  return <AccountSettings />;
}
