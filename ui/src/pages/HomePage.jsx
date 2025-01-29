import { motion } from "framer-motion";
import TextPressure from "../assets/TextPressure";

export const HomePage = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{ padding: "2rem", textAlign: "center" }}
  >
    <div style={{ position: "relative" }}>
      <TextPressure
        text="MIST!"
        flex={true}
        alpha={false}
        stroke={false}
        width={true}
        weight={true}
        italic={true}
        textColor="#ffffff"
        strokeColor="#ff0000"
        minFontSize={456}
      />
    </div>
  </motion.div>
);
