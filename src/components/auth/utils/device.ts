export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth <= 768);
};

export const hasClipboardSupport = () => {
  return !!navigator.clipboard && !!navigator.clipboard.readText;
};

export const hasVibrationSupport = () => {
  return 'vibrate' in navigator;
};

export const simulateHapticFeedback = () => {
  if (hasVibrationSupport()) {
    navigator.vibrate(50);
  }
}; 