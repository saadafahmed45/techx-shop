import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default function AdminPage() {
  const { userId } = auth();

  // if (!userId) return <div>Unauthorized</div>;

  return <div className="p-4 flex items-center justify-between">
    Admin Dashboard
    <span>
      <UserButton/>
    </span>

    
  </div>;
}