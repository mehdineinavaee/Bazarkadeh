import React, { useEffect } from "react";
export default function Drawer({
  children,
  isOpen = true,
  setIsOpen,
  left,
  search,
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isOpen) document.body.style.overflow = "hidden";
      else document.body.style.removeProperty("overflow");
    }
  }, [isOpen]);
  const handleSide = () => {
    if (left) {
      return {
        left: "0",
        top: "0",
        height: "100%",
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
      };
    } else if (search) {
      return {
        top: "0",
        transform: isOpen ? "translateY(0)" : "translateY(-100%)",
      };
    } else {
      return {
        right: "0",
        height: "100%",
        top: "0",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
      };
    }
  };
  const styles = handleSide();
  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        style={{
          transition: "all .3s",
          top: "0",
          right: "0",
          left: "0",
          bottom: "0",
          position: "fixed",
          zIndex: 20,
        }}
        className={`${isOpen ? "visible opacity-50" : "invisible opacity-50"}`}
      >
        <div
          style={{
            top: "0",
            right: "0",
            left: "0",
            bottom: "0",
            backgroundColor: "black",
            opacity: "0.5",
            position: "absolute",
          }}
        ></div>
      </div>
      <aside
        className={search ? "search-drawer" : "cart-drawer"}
        style={{
          overflow: "auto",
          transition: "all .3s",
          zIndex: 30,
          backgroundColor: "white",
          position: "fixed",
          ...styles,
        }}
      >
        {children}
      </aside>
    </>
  );
}
