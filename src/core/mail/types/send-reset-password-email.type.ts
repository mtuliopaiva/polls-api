export type SendResetPasswordEmailData = {
  to: string;
  resetLink: string;
  userName?: string;
};
