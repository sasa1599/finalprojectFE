import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/helper/supabase-config";
import { toast } from "react-toastify";
import { ValuesSetPassAccGoogle } from "@/types/setpass-types";
import { getSession } from "next-auth/react";

const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

const ProfileServices = () => {
  const router = useRouter();
  const defaultAvatar =
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  const [profile, setProfile] = useState({
    avatar: "",
    username: "Loading..",
    userId: 0,
    firstName: "Loading..",
    lastName: "Loading..",
    email: "Loading..",
    phone: 0,
    password: "Loading..",
    role: "Loading..",
    status: "Loading..",
    referral_code: "",
    is_google: false,
    verified: false,
    password_reset_token: null,
  });
  const [refCode, setRefCode] = useState();

  const [isSaveAvatar, setIsSaveAvatar] = useState(false);
  const [isChangeAvatar, setIsChangeAvatar] = useState(false);
  const [newFile, setNewFile] = useState<{ file: File | null; url: string }>({
    file: null,
    url: "",
  });

  useEffect(() => {
    getDataUser();
  }, []);

  const getDataUser = async () => {
    try {
      const res = await fetch(`${base_url_be}/customer/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const { data } = await res.json();
        setProfile((prev) => ({
          ...prev,
          avatar: data.avatar || defaultAvatar,
          username: data.username ?? "",
          password: data.password ?? "",
          userId: data.user_id,
          firstName: data.first_name ?? "",
          lastName: data.last_name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          role: data.role,
          status: data.verified ? "Active" : "Inactive",
          referral_code: data.referral_code ?? "",
          is_google: data.is_google,
          verified: data.verified,
          password_reset_token: data.password_reset_token ?? null
        }));
      }
    } catch {
      showToast("Failed to get user data.", "error");
    }
  };

  const saveChanges = async () => {
    try {
      const session = await getSession();
      const res = await fetch(`${base_url_be}/customer/profile/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
        }),
      });
      if (res.ok) {
        showToast("Profile updated successfully.", "success", () =>
          router.push("/profile")
        );
      }
    } catch {
      showToast("Failed to update profile.", "error");
    }
  };

  const setPasswordHandle = async (values: ValuesSetPassAccGoogle) => {
    try {
      const res = await fetch(`${base_url_be}/customer/profile/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          password: values.password,
          confirmPassword: values.password,
        }),
      });
      if (res.ok) {
        showToast("Profile updated successfully.", "success", () =>
          location.reload()
        );
      }
    } catch {
      showToast("Failed to update profile.", "error");
    }
  };

  const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes

    if (!file) return;
    if (!validateFileSize(file)) return;
    if (file.size > maxSize) {
      showToast("File size should be less than 1MB", "error");
      setIsSaveAvatar(false);
      return;
    }

    const fileURL = URL.createObjectURL(file);
    setNewFile({ file, url: fileURL });
    setIsChangeAvatar(true);
  };

  const handleChangeAvatar = async () => {
    if (!newFile.file) return;
    try {
      setIsSaveAvatar(true);
      await removeOldAvatar();
      const filePath = await uploadNewAvatar(newFile.file);
      await updateAvatarInDb(filePath);
      showToast("Avatar updated successfully.", "success", () =>
        location.reload()
      );
    } catch {
      setIsSaveAvatar(false);
      showToast("Failed to update avatar.", "error");
    }
  };

  const validateFileSize = (file: File) => {
    const maxSize = 1 * 1024 * 1024; // 1 MB
    if (file.size > maxSize) {
      showToast("Max file size is 1MB. Please select another file.", "error");
      return false;
    }
    return true;
  };

  const removeOldAvatar = async () => {
    if (profile.avatar === defaultAvatar) return;
    const oldFilePath = profile.avatar.replace(
      `${process.env.NEXT_PUBLIC_BASE_URL_SUPABASE}/storage/v1/object/public/user_avatar/`,
      ""
    );
    const { error } = await supabase.storage
      .from("user_avatar")
      .remove([oldFilePath]);
    if (error) throw new Error("Failed to delete old image.");
  };

  const uploadNewAvatar = async (file: File) => {
    const extension = file.name.split(".").pop();
    const filePath = `user-${Date.now()}.${extension}`;
    const { error } = await supabase.storage
      .from("user_avatar")
      .upload(filePath, file, { cacheControl: "3600" });
    if (error) throw error;
    return filePath;
  };

  const updateAvatarInDb = async (filePath: string) => {
    const res = await fetch(`${base_url_be}/customer/profile/avatar/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        avatar: `${process.env.NEXT_PUBLIC_BASE_URL_SUPABASE}/storage/v1/object/public/user_avatar/${filePath}`,
      }),
    });
    if (!res.ok) throw new Error("Failed to update avatar in database.");
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning",
    onClose?: (() => void) | null
  ) => {
    toast.dismiss();

    if (type === "success") {
      toast.success(message, {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
        hideProgressBar: false,
        onClose: onClose || undefined,
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
        hideProgressBar: false,
        onClose: onClose || undefined,
      });
    } else if (type === "info") {
      toast.info(message, {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
        hideProgressBar: false,
        onClose: onClose || undefined,
      });
    } else if (type === "warning") {
      toast.warning(message, {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
        hideProgressBar: false,
        onClose: onClose || undefined,
      });
    }
  };

  return {
    profile,
    isChangeAvatar,
    newFile,
    setProfile,
    setPasswordHandle,
    getDataUser,
    saveChanges,
    handlePickImage,
    handleChangeAvatar,
    isSaveAvatar,
    setIsSaveAvatar,
  };
};

export default ProfileServices;