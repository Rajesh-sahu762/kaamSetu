import { T } from "@/utils/vendorTheme";

const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    bg: T.greenDim,
    color: T.green,
  },

  "in-progress": {
    label: "In Progress",
    bg: T.blueDim,
    color: T.blue,
  },

  pending: {
    label: "Pending",
    bg: T.amberDim,
    color: T.amber,
  },

  completed: {
    label: "Completed",
    bg: T.greenDim,
    color: T.green,
  },

  cancelled: {
    label: "Cancelled",
    bg: T.redDim,
    color: T.red,
  },
};

const StatusPill = ({ status }) => {
  const cfg =
    STATUS_CONFIG[status] ||
    STATUS_CONFIG.pending;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,

        background: cfg.bg,
        color: cfg.color,

        fontFamily: "Geist,sans-serif",
        fontSize: 11,
        fontWeight: 600,

        letterSpacing: "0.04em",

        padding: "4px 10px",
        borderRadius: 4,

        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: cfg.color,
        }}
      />

      {cfg.label}
    </span>
  );
};

export default StatusPill;