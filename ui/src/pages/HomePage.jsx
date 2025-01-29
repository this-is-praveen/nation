import { motion } from 'framer-motion';

export const HomePage = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{ padding: '2rem', textAlign: 'center' }}
  >
    <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>MIST</h1>
    <p style={{ color: '#66b2ff' }}>Advanced Analytics Platform</p>
  </motion.div>
);