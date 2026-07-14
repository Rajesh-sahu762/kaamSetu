import { T } from "@/utils/vendorTheme";

const Avatar = ({
  image,
  initials,
  size = 36,
  bg = T.slateMid,
  onclick,
}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        overflow: "hidden",

        color: T.white,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        fontFamily: "Geist,sans-serif",
        fontSize: size * 0.33,
        fontWeight: 600,

        flexShrink: 0,
      }}
      onClick={onclick}
    >
      {image ? (
        <img
          src={image}
          alt="Profile"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        initials
      )}
    </div>
  );
};

export default Avatar;