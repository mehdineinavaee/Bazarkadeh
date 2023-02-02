import React from "react";
import { motion, AnimatePresence } from "framer-motion";
export const Modal = React.forwardRef(({ children, setOpen, open }) => {
  return (
    <AnimatePresence>
      {open && (
        <React.Fragment>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.3,
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                delay: 0.3,
              },
            }}
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              height: "100vh",
              width: "100vw",
              top: 0,
              left: 0,
              background: "rgba(0, 0, 0, 0.4)",
              zIndex: 9999,
            }}
          />
          <motion.div
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
              transition: {
                duration: 0.3,
              },
            }}
            exit={{
              scale: 0,
              transition: {
                delay: 0.3,
              },
            }}
            style={{
              position: "fixed",
              width: "500px",
              height: "700px",
              background: "white",
              margin: "auto",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              padding: "10px",
              zIndex: 99999,
              borderRadius: "20px",
            }}
          >
            <div
              onClick={() => {
                setOpen(false);
              }}
              style={{
                position: "absolute",
                top: "10%",
                left: "10%",
              }}
            >
              <svg style={{ width: "34px" }} fill="black" viewBox="0 0 24 24">
                <g data-name="Layer 2">
                  <g data-name="close">
                    <rect
                      width="24"
                      height="24"
                      transform="rotate(180 12 12)"
                      opacity="0"
                    />
                    <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" />
                  </g>
                </g>
              </svg>
            </div>
            <motion.div
              initial={{
                x: 100,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  delay: 0.3,
                  duration: 0.3,
                },
              }}
              exit={{
                x: 100,
                opacity: 0,
                transition: {
                  duration: 0.3,
                },
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
});
