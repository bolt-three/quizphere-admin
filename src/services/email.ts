import axios from 'axios';

interface EmailRequest {
  to: string;
  subject: string;
  body?: string;
  html_body?: string;
  is_html: boolean;
}

export const sendEmail = async (emailData: EmailRequest) => {
  try {
    const response = await axios.post(
      'https://dev-api.thegamechangercompany.io/mailer/api/v1/emails',
      emailData
    );
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendPasswordEmail = async (email: string, password: string, isNewUser: boolean) => {
  const subject = isNewUser 
    ? 'Bienvenue sur QuizPhere - Vos identifiants de connexion' 
    : 'QuizPhere - Votre nouveau mot de passe';

  const html_body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">QuizPhere Platform</h2>
      <p>Bonjour,</p>
      ${isNewUser 
        ? '<p>Votre compte a été créé avec succès sur la plateforme QuizPhere.</p>'
        : '<p>Votre mot de passe a été mis à jour sur la plateforme QuizPhere.</p>'
      }
      <p>Voici vos identifiants de connexion :</p>
      <ul>
        <li><strong>Email :</strong> ${email}</li>
        <li><strong>Mot de passe :</strong> ${password}</li>
      </ul>
      <p style="color: #EF4444; font-weight: bold;">Important : Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe dès votre première connexion via les paramètres de votre profil.</p>
      <p>Cordialement,<br>L'équipe QuizPhere</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    html_body,
    is_html: true
  });
};