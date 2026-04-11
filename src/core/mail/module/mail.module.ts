import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from '../services/mail.service';
import { SmtpMailService } from '../services/smtp-mail.service';

@Module({
  imports: [ConfigModule],
  providers: [
    SmtpMailService,
    {
      provide: MailService,
      inject: [ConfigService, SmtpMailService],
      useFactory: (
        configService: ConfigService,
        smtpMailService: SmtpMailService,
      ) => {
        return smtpMailService;
      },
    },
  ],
  exports: [MailService],
})
export class MailModule {}
