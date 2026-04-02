export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

export const initializePaystack = ({ email, amount, onSuccess, onClose }) => {
  const handler = window.PaystackPop.setup({
    key:       PAYSTACK_PUBLIC_KEY,
    email,
    amount:    Math.round(amount * 100), // Paystack uses kobo
    currency:  "NGN",
    ref:       `NKS-${Date.now()}`,
    callback:  (response) => onSuccess(response),
    onClose:   () => onClose(),
  });
  handler.openIframe();
};