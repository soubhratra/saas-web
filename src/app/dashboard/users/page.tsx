import UserList from "@/app/dashboard/users/UserList";


export default function UsersPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <UserList />
    </div>
  );
}
