export interface UserProfileData {
  name: string;
  email: string;
  avatar: string;
}

export function formatNameFromEmail(email: string): string {
  if (!email) return "Desai Vatshal";
  const local = email.split("@")[0] || "";
  const cleaned = local.replace(/[._\-0-9]+/g, " ").trim();
  const words = (cleaned || local).split(/\s+/).filter(Boolean);
  if (words.length === 0) return "Desai Vatshal";
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

export function getUserProfile(): UserProfileData {
  if (typeof window === "undefined") {
    return {
      name: "Desai Vatshal",
      email: "desaivatshal72839@gmail.com",
      avatar: "/images/profile-avatar.png",
    };
  }

  const storedEmail = localStorage.getItem("user_email") || "desaivatshal72839@gmail.com";
  let storedName = localStorage.getItem("user_name");
  
  if (!storedName || storedName === "David Miller" || storedName === "Marcus Thorne" || storedName === "Farmer") {
    storedName = formatNameFromEmail(storedEmail);
    localStorage.setItem("user_name", storedName);
  }

  const storedAvatar = localStorage.getItem("user_custom_avatar") || "/images/profile-avatar.png";

  return {
    name: storedName,
    email: storedEmail,
    avatar: storedAvatar,
  };
}

export function setUserProfile(data: Partial<UserProfileData>) {
  if (typeof window === "undefined") return;

  if (data.email !== undefined) localStorage.setItem("user_email", data.email);
  if (data.name !== undefined) localStorage.setItem("user_name", data.name);
  if (data.avatar !== undefined) localStorage.setItem("user_custom_avatar", data.avatar);

  window.dispatchEvent(new Event("user-profile-updated"));
  window.dispatchEvent(new Event("storage"));
}

export function subscribeUserProfile(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("user-profile-updated", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("user-profile-updated", callback);
    window.removeEventListener("storage", callback);
  };
}
