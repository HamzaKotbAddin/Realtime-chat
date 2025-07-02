import { redirect } from "next/navigation";

export default function NotFoundRedirectPage() {
  redirect("/auth");
}
