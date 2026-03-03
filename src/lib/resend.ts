import { Resend } from "resend";

export const FROM_EMAIL = "noreply@halaliya.com";
export const SUPPORT_EMAIL = "support@halaliya.com";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || "");
  }
  return _resend;
}

// Convenience wrapper that matches Resend API surface
export const resend = {
  emails: {
    send: (params: any) => getResend().emails.send(params),
  },
};
