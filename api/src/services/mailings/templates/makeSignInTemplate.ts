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
        <mj-head>
        <mj-attributes>
          <mj-text font-family="Ubuntu, Helvetica, Arial, sans-serif" color="#000000"></mj-text>
          <mj-class name="description"></mj-class>
          <mj-class name="preheader" color="#000000" font-size="11px" padding-left="25px" padding-right="25px"></mj-class>
          <mj-class name="strong" font-weight="700"></mj-class>
          <mj-class name="button" background-color="#fcc245" color="#000000" font-size="18px" border-radius="3px" font-family="Ubuntu, Helvetica, Arial, sans-serif"></mj-class>
        </mj-attributes>
        <mj-style inline="inline">a { text-decoration: none!important; }
        </mj-style>
      </mj-head>
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
            </mj-text>
            
           
            ${token && `
                <mj-text>
                To sign in, please click on the following link:         
                </mj-text>
                <mj-button href="${config.dashboardUrl}/verify_token?token=${token}" background-color="#36d399">
                ✨ Magic link
                </mj-button>
                
                <mj-text>
                Please note that this link expires in <span style="font-weight: 700">3 days</span>. If you wish to request a new login link, simply
                go to <a href="${config.dashboardUrl}">the dashboard login</a> and fill in your mail again.
                </mj-text>
            `}
                </mj-column>
            </mj-section>
        </mj-body>
        </mjml>
    `).html;
};

export default makeSignInTemplate;
