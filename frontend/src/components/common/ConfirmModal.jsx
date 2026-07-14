import { X, TriangleAlert } from "lucide-react";

const ConfirmModal = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
}) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        animation: "fadeIn .2s ease",
      }}
    >
      <div
        style={{
          width: 420,
          maxWidth: "92%",
          background: "#fff",
          borderRadius: 20,
          padding: 28,
          position: "relative",
          boxShadow: "0 30px 80px rgba(0,0,0,.15)",
        }}
      >
        {/* Close */}

        <button
          onClick={onCancel}
          style={{
            position: "absolute",
            right: 18,
            top: 18,
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </button>

        {/* Icon */}

        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            margin: "0 auto",
            background: danger
              ? "#FEE2E2"
              : "#F3F4F6",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TriangleAlert
            size={30}
            color={danger ? "#DC2626" : "#B67A35"}
          />
        </div>

        {/* Title */}

        <h2
          style={{
            textAlign: "center",
            marginTop: 18,
            fontSize: 24,
            fontWeight: 700,
            fontFamily: "Geist,sans-serif",
            color: "#0F172A",
          }}
        >
          {title}
        </h2>

        {/* Message */}

        <p
          style={{
            marginTop: 12,
            textAlign: "center",
            color: "#64748B",
            lineHeight: 1.7,
            fontSize: 14,
          }}
        >
          {message}
        </p>

        {/* Buttons */}

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 28,
          }}
        >
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              height: 46,
              borderRadius: 10,
              border: "1px solid #CBD5E1",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              height: 46,
              border: "none",
              borderRadius: 10,
              background: danger
                ? "#DC2626"
                : "#0F172A",

              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;