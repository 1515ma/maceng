import React from "react";

const createMotionComponent = (tag: string) => {
  return React.forwardRef<HTMLElement, Record<string, unknown>>(
    ({ children, ...props }, ref) => {
      const filteredProps: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(props)) {
        if (
          !key.startsWith("initial") &&
          !key.startsWith("animate") &&
          !key.startsWith("exit") &&
          !key.startsWith("transition") &&
          !key.startsWith("whileHover") &&
          !key.startsWith("whileTap") &&
          !key.startsWith("whileInView") &&
          !key.startsWith("viewport") &&
          !key.startsWith("variants") &&
          key !== "layout" &&
          key !== "layoutId"
        ) {
          filteredProps[key] = value;
        }
      }
      return React.createElement(tag, { ...filteredProps, ref }, children as React.ReactNode);
    }
  );
};

export const motion = {
  div: createMotionComponent("div"),
  span: createMotionComponent("span"),
  header: createMotionComponent("header"),
  section: createMotionComponent("section"),
  button: createMotionComponent("button"),
  p: createMotionComponent("p"),
  h1: createMotionComponent("h1"),
  h2: createMotionComponent("h2"),
  a: createMotionComponent("a"),
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const useAnimation = () => ({
  start: jest.fn(),
  stop: jest.fn(),
  set: jest.fn(),
});
export const useInView = () => true;
export const useScroll = () => ({ scrollY: { get: () => 0, onChange: jest.fn() } });
