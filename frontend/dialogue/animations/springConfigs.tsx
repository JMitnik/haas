interface SpringOption {
  damping: number;
  stiffness: number;
  mass: number;
}

/** A linear spring entails no bounciness, almost linear progress */
export const linearSpring: SpringOption = { damping: 10, mass: 1, stiffness: 100 };
