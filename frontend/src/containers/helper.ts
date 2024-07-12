export const BRNum = /^[0-9]+$/;


/**
 * @param func callback function to be throttled
 * @param delay time in milliseconds
 * @returns 
 */
export function throttle(func: () => void, delay: number) {
  let inThrottle = false;
  return function () {
    if (!inThrottle) {
      inThrottle = true;
      func();
      setTimeout(() => (inThrottle = false), delay);
    }
  };
}

/**
 * @param val string to be checked
 * @returns true if the string is a number or empty otherwise false
 */
export function checkNumber(val: string) {
  return BRNum.test(val) || val === "";
}
