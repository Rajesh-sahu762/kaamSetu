import { T } from "@/utils/vendorTheme";

const Avatar = ({
  initials,
  size = 36,
  bg = T.slateMid,
}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,

        color: T.white,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        fontFamily: "Geist,sans-serif",
        fontSize: size * 0.33,
        fontWeight: 600,

        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;