import React from "react";
import { Trash, Shield, User as UserIcon } from "lucide-react";
import Swal from "sweetalert2";

interface User {
  user_id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: "customer" | "store_admin" | "super_admin";
  verified: boolean;
  created_at: string;
  updated_at: string;
}

const UserCard = ({
  user,
  onDelete,
}: {
  user: User;
  onDelete: (userId: number) => void;
}) => {
  const RoleIcon = user.role === "customer" ? UserIcon : Shield;
  const roleColor =
    user.role === "customer" ? "text-green-500" : "text-blue-500";

  const handleDelete = (userId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await onDelete(userId);
          Swal.fire("Deleted!", "The user has been deleted.", "success");
        } catch (error) {
          console.error(error);
          Swal.fire("Error!", "There was an issue deleting the user.", "error");
        }
      }
    });
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl mx-auto flex flex-col">
      <div className="p-4 sm:p-5 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${roleColor} bg-opacity-20 mr-3`}>
              <RoleIcon className={`${roleColor} h-5 w-5 sm:h-6 sm:w-6`} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 break-words">
              {user.first_name} {user.last_name}
            </h3>
          </div>
          <span
            className={`${roleColor} text-sm font-medium px-2 py-1 rounded-full bg-opacity-20 whitespace-nowrap`}
          >
            {user.role}
          </span>
        </div>

        {/* User details */}
        <div className="space-y-2 text-sm sm:text-base text-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium min-w-24">Email:</span>
            <span className="w-full sm:w-auto break-all">{user.email}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium min-w-24">Username:</span>
            <span className="w-full sm:w-auto break-all">{user.username}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium min-w-24">Verified:</span>
            <span className={user.verified ? "text-green-500" : "text-red-500"}>
              {user.verified ? "Yes" : "No"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium min-w-24">Created:</span>
            <span>{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 pt-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => handleDelete(user.user_id)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-red-500 rounded-lg transition-colors duration-300 hover:bg-red-500 hover:text-white"
          >
            <Trash className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
