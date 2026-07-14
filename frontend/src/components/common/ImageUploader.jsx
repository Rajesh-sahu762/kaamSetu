import { ImagePlus, X } from "lucide-react";
import { T } from "@/utils/vendorTheme";

const ImageUploader = ({
  id,
  previews = [],
  maxImages = 8,
  onChange,
  onRemove,
}) => {
  return (
    <>
      <input
        id={id}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={onChange}
      />

      <div
        onClick={() => document.getElementById(id).click()}
        style={{
          border: `2px dashed ${T.border}`,
          borderRadius: 18,
          padding: "36px 20px",
          textAlign: "center",
          cursor: "pointer",
          background: T.surfaceLow,
          transition: ".25s",
        }}
      >
        <ImagePlus size={42} color={T.slateGray} />

        <h3
          style={{
            marginTop: 14,
            fontSize: 17,
            color: T.slate,
          }}
        >
          Upload Images
        </h3>

        <p
          style={{
            marginTop: 8,
            color: T.slateGray,
            fontSize: 13,
          }}
        >
          Click to browse your images
        </p>

        <p
          style={{
            marginTop: 5,
            color: T.slateGray,
            fontSize: 12,
          }}
        >
          JPG • PNG • WEBP • Max {maxImages}
        </p>
      </div>

      {previews.length > 0 && (
        <>
          <div
            style={{
              marginTop: 18,
              marginBottom: 12,
              color: T.slateGray,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {previews.length} / {maxImages} Images Selected
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(90px,1fr))",
              gap: 14,
            }}
          >
            {previews.map((image, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  borderRadius: 12,
                  overflow: "hidden",
                  aspectRatio: "1",
                }}
              >
                <img
                  src={image.url}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {index === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      left: 6,
                      bottom: 6,
                      background: T.green,
                      color: "#fff",
                      fontSize: 10,
                      padding: "3px 7px",
                      borderRadius: 20,
                    }}
                  >
                    Cover
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                  }}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    background: "rgba(0,0,0,.6)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default ImageUploader;