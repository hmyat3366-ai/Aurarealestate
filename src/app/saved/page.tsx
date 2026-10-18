import { redirect } from "next/navigation";

export default function LegacySavedPage() {
  redirect("/account/saved");
}
