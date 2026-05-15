import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const pointerCursor = "url('/cursor-pointer.png') 0 0, pointer";

export default function ContactModal({ isOpen, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleClose() {
    onClose();
    setTimeout(() => setSubmitted(false), 300);
  }

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    await fetch("https://getform.io/f/b955fc50-0382-4ab9-bea4-19fcec60d47f", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    setLoading(false);
    setSubmitted(true);
  }

  return (
    <>
      {/* backdrop (blurred) */}
      <div
        className="fixed inset-0 z-50"
        style={{
          background: "rgba(42,59,30,0.85)",
          backdropFilter: "blur(4px)",
        }}
        onClick={handleClose}
      />

      {/* modal */}
      <div
        className="fixed z-50 border relative"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "var(--gd)",
          borderColor: "rgba(224,217,188,0.25)",
          width: "90%",
          maxWidth: "480px",
          minHeight: "300px",
          padding: "2rem",
          position: "fixed",
        }}
      >
        {submitted ? (
          /* success message */
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            {/* close button, x*/}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 flex items-center justify-center transition-colors duration-150"
              style={{
                color: "var(--cd)",
                cursor: pointerCursor,
                fontSize: "1rem",
                width: "32px",
                height: "32px",
                background: "transparent",
                border: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cd)")}
            >
              ✕
            </button>

            <p
              style={{
                fontFamily: "Dreamer, serif",
                color: "var(--c)",
                fontSize: "2.5rem",
                letterSpacing: "0.08em",
              }}
              className="mb-3"
            >
              message sent.
            </p>
            <p
              className="text-[0.72rem]"
              style={{
                color: "var(--cd)",
                fontFamily: "DM Mono, monospace",
                letterSpacing: "0.12em",
              }}
            >
              thanks, i'll get back to you soon!
            </p>
          </div>
        ) : (
          <>
            {/* header */}
            <div className="flex justify-between items-center mb-6">
              <p
                className="text-[0.6rem] uppercase tracking-widest"
                style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace" }}
              >
                contact
              </p>
              <button
                onClick={handleClose}
                className="flex items-center justify-center transition-colors duration-150"
                style={{
                  color: "var(--cd)",
                  cursor: pointerCursor,
                  fontSize: "1rem",
                  width: "32px",
                  height: "32px",
                  background: "transparent",
                  border: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c)")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--cd)")
                }
              >
                ✕
              </button>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* name */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[0.55rem] uppercase tracking-widest"
                  style={{
                    color: "var(--cd)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="bg-transparent border-b outline-none py-2 text-[0.75rem]"
                  style={{
                    borderColor: "rgba(224,217,188,0.25)",
                    color: "var(--c)",
                    fontFamily: "DM Mono, monospace",
                  }}
                />
              </div>

              {/* email */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[0.55rem] uppercase tracking-widest"
                  style={{
                    color: "var(--cd)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="bg-transparent border-b outline-none py-2 text-[0.75rem]"
                  style={{
                    borderColor: "rgba(224,217,188,0.25)",
                    color: "var(--c)",
                    fontFamily: "DM Mono, monospace",
                  }}
                />
              </div>

              {/* message */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[0.55rem] uppercase tracking-widest"
                  style={{
                    color: "var(--cd)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  message
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="bg-transparent border-b outline-none py-2 text-[0.75rem] resize-none"
                  style={{
                    borderColor: "rgba(224,217,188,0.25)",
                    color: "var(--c)",
                    fontFamily: "DM Mono, monospace",
                  }}
                />
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 text-[0.6rem] uppercase tracking-widest px-4 py-2 border transition-all duration-150 self-start"
                style={{
                  borderColor: "rgba(224,217,188,0.25)",
                  color: loading ? "var(--cd)" : "var(--c)",
                  background: "transparent",
                  fontFamily: "DM Mono, monospace",
                  cursor: pointerCursor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--c)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(224,217,188,0.25)";
                }}
              >
                {loading ? "sending..." : "send"}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
