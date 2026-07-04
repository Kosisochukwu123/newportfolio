// const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = import.meta.env.VITE_API_URL || "/api";

export const sendChat = async (message) => {
  const res = await fetch(`${API}/chat`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      message,
    }),
  });

  return res.json();
};
