import { IUserData } from "../../../../App";
import User from "./User";
import UserInList from "./User";
import "./users-list.module.css";

interface UsersListProps {
  userData: IUserData;
  users: Array<{
    name: string;
    id: string;
    role: string;
  }>;
}

export default function UsersList({ users, userData }: UsersListProps) {
  return (
    <>
      {users.map((user) => (
        <User key={user.id} user={user} userData={userData} />
      ))}
    </>
  );
}
