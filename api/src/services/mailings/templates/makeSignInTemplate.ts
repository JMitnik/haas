import Color from 'color';
import mjml2html from 'mjml';

import config from '../../../config/config';

interface makeSignInProps {
  recipientMail: string;
  token?: string;
  bgColor?: string;
}

const makeSignInTemplate = ({ recipientMail, token, bgColor = '#0059f8' }: makeSignInProps) => {
  const lighterBg = Color(bgColor).darken(0.1).hex();

  return mjml2html(`
        <mjml>
        <mj-body background-color=${bgColor}>
            <mj-section text-align="center">
                <mj-column>
                    <mj-image align="center" src="https://res.cloudinary.com/dx8khik9g/image/upload/v1586902351/haas/logo-haas.png" width="125px" alt="" />
                </mj-column>
            </mj-section>
            <mj-spacer height="30px" />
            <mj-section border-radius="5px 5px 0 0"  background-color=${lighterBg}>
                <mj-column>
                    <mj-text font-size="20px" color="white" align="left">
                        ✨ Your HAAS Magic link is ready!
                    </mj-text>
                </mj-column>
            </mj-section>
            <mj-section background-color="#eef1f5">
            <mj-column width="100%">
            <mj-text>
            Hi ${recipientMail}, you have requested a sign in link.
            
            ${token && `To sign in, please click on the following link: <a href="${config.dashboardUrl}/verify_token?token=${token}">Sign in</a>`}
                    </mj-text>
                </mj-column>
            </mj-section>
        </mj-body>
        </mjml>
    `).html;
};

export default makeSignInTemplate;
