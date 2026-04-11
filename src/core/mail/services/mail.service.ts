import { SendResetPasswordEmailData } from '../types/send-reset-password-email.type';

export abstract class MailService {
  abstract sendResetPasswordEmail(
    data: SendResetPasswordEmailData,
  ): Promise<void>;
}
