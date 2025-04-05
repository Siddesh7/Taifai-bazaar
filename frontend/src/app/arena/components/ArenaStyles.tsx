import React from "react";

const ArenaStyles: React.FC = () => {
  return (
    <style jsx global>{`
      @font-face {
        font-family: "PixelFont";
        src: url("data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAQwAA0AAAAAClwAAAPVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP0ZGVE0cGh4GYACCXhEICotIigILFAABNgIkAxoEIAWDcwc9G9EHyI7jOJ0sBhHpPdmZfzOZ3f1/EEJS2sooopJgoyOqoKG6WhhLu1pq57/esr9d7CGRREt9E814aISqRPgn8CDcJbzw5b/XmptfyMIm3RMaVReJTBLtkThCIqRIvEOIRCVevKzZ+bX7AAAAAIQAdAh1A+gDOANoA+gCiAPoBIgAjAPoBRgACABcxY54AIADABaAfOzZAmABwAQAiKl4kIBJAfJwMSkD8rC9B2SyQ1KnJRfjF5vLYgB40r4hAE+0//+PugCcSgO4cwJAF0A3PGiAQdMAVvwXBmPxWp6Wq5Vq5VqpVqj5ap6WrWVqwZZkSbQkWqLRUx0ttRytlrm1LK2Wuc1TXvWgK13oQAOUoRRlKUdZ8qMPfehD7/pAD3pA93pAN/pA+jTYMD3pAY3KYMEYo6YY8ZOqGjp16tR00qFJgw4dTfrpYNQsXdr00sFPk3bdWlRo0KJKl2Yd2vToYNZNu+K/3Ww0+v+HZ2hAZE4OEZOLLzSnLJRN+z30yPyEZ10ycYu0YpLpFxKPFqnZK2ITXr40qUZV8qJEzC5qRtUaVGhUJZ9MJfG6i1qFZkX+S2L1iXbNCuTdWSZJJU7dqnRpF4tFLfpJqdZPl1bVokFVPEOVbfHYM1Sb8vgL9y5LT69eaT1qTVRpWmK+hKomk2ZCZaNOeXeKJpXyFGxJYaQg5GpH45aXKsyy6YDJbJsydDDHpgyLbMrA+SkDo0/gk2OOQY33Zud1f9hwdZ3lzftGZ/CtO6VvHJVPXu5xkfA2uGtqWBsPzHi0UW+QL/jLYjBZ7fM+Z3QOEqWHV3qyOtDg/F0NdPx29SX5r1YWnZBGGwxaBIEhqFk1WrVpEysBAAAAQAeAEQBeANwAogAuAfwBUgBEAFoAngBxAF4AZwAYALEEYADmApwEYAagAUCR6VsPAC4AQgCACNfRbkxZbwBuAEoAQgBqANoAGgB6AGRSIQUkAEAAIAhAmPdDAIAgOE8A4BwAEQB4AFgEA8AHQAaAPABKAHIA0gBcALQAGAGQASAEoAlACIASgBCASgB6AOoAlAE0A7ACsAXgAiAPwA1AAYAbgDAABQB5ANwAZADwB+AGQARAFwA7ADUA7ABkAJACMARgBKAGIAsgGEAEgAEAOQAaACwAWgAUABgA0AcgDCANwB+AN4Ai")
          format("woff2");
        font-weight: normal;
        font-style: normal;
      }
      .font-pixel {
        font-family: "PixelFont", monospace;
        letter-spacing: 0.5px;
      }
      @keyframes float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
      }
      @keyframes float-slow {
        0%,
        100% {
          transform: translateY(0);
          opacity: 0.6;
        }
        50% {
          transform: translateY(-8px);
          opacity: 0.9;
        }
      }
      @keyframes pulse-slow {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.8;
        }
      }
      html,
      body {
        overflow: hidden;
        margin: 0;
        padding: 0;
      }
    `}</style>
  );
};

export default ArenaStyles;
