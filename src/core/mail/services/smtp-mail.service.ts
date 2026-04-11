import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailService } from './mail.service';
import { SendResetPasswordEmailData } from '../types/send-reset-password-email.type';
import { resetPasswordEmailTemplate } from '../templates/reset-password-email.template';

@Injectable()
export class SmtpMailService implements MailService {
  constructor(private readonly configService: ConfigService) {}

  async sendResetPasswordEmail(
    data: SendResetPasswordEmailData,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('MAIL_HOST'),
      port: Number(this.configService.getOrThrow<string>('MAIL_PORT')),
      secure: this.configService.get<string>('MAIL_SECURE') === 'true',
      auth: {
        user: this.configService.getOrThrow<string>('MAIL_USER'),
        pass: this.configService.getOrThrow<string>('MAIL_APP_PASSWORD'),
      },
    });

    const template = resetPasswordEmailTemplate(data);

    await transporter.sendMail({
      from: this.configService.getOrThrow<string>('MAIL_FROM'),
      to: data.to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }
}
