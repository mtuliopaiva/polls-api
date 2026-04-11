import { SendResetPasswordEmailData } from '../types/send-reset-password-email.type';

export function resetPasswordEmailTemplate(data: SendResetPasswordEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const greeting = data.userName ? `Olá, ${data.userName}` : 'Olá';

  const subject = 'Redefinição de senha';

  const text = `
${greeting}

Recebemos uma solicitação para redefinir sua senha.

Acesse o link abaixo para criar uma nova senha:
${data.resetLink}

Se você não solicitou essa alteração, ignore este email.

Atenciosamente,
Equipe Skeleton API
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:40px auto;background:#ffffff;padding:32px;border-radius:12px;">
      <h2 style="margin-top:0;color:#111827;">${greeting}</h2>

      <p style="color:#374151;font-size:16px;line-height:1.6;">
        Recebemos uma solicitação para redefinir sua senha.
      </p>

      <p style="color:#374151;font-size:16px;line-height:1.6;">
        Clique no botão abaixo para criar uma nova senha:
      </p>

      <div style="margin:32px 0;">
        <a
          href="${data.resetLink}"
          style="
            display:inline-block;
            padding:14px 24px;
            background:#111827;
            color:#ffffff;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          "
        >
          Redefinir senha
        </a>
      </div>

      <p style="color:#6b7280;font-size:14px;line-height:1.6;">
        Se você não solicitou essa alteração, ignore este email.
      </p>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

      <p style="color:#9ca3af;font-size:12px;line-height:1.6;">
        Caso o botão não funcione, copie e cole este link no navegador:
        <br />
        <a href="${data.resetLink}" style="color:#2563eb;">${data.resetLink}</a>
      </p>
    </div>
  </body>
</html>
`.trim();

  return {
    subject,
    html,
    text,
  };
}
