import { auth } from "@/server/auth";
import Nav from "@/components/navigation/nav";

export default async function NavWrapper() {
  const session = await auth();
  return <Nav session={session} />;
}
