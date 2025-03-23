'use client';

export default function Home() {
  return (
    <div>
      <button
        onClick={() => {
          window.location.href = "/login";
        }}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </div>
  );
}
