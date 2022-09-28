import Color from 'color';
import mjml2html from 'mjml';
import { Dialogue } from 'prisma/prisma-client';

import config from '../../../config/config';

interface makeDialogueLinkReminderProps {
  recipientMail: string;
  dialogueClientUrl?: string;
  bgColor?: string;
  dialogues: Dialogue[];
  workspaceSlug: string;
}

const makeDialogueLinkReminderTemplate = ({ workspaceSlug, dialogues, recipientMail, dialogueClientUrl, bgColor = '#0059f8' }: makeDialogueLinkReminderProps) => {
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
                        ✨ Your team link is ready!
                    </mj-text>
                </mj-column>
            </mj-section>
            <mj-section background-color="#eef1f5">
            <mj-column width="100%">
            <mj-text>
            Hi ${recipientMail}, a new haas survey is ready for your team members.
            </mj-text>
            
            ${dialogues.length === 1 ? `
              <mj-text>
              To access it, please click on the following link:
              </mj-text>
              <mj-button href="${config.clientUrl}/${workspaceSlug}/${dialogues?.[0]?.slug}" background-color="#36d399">
              ✨ haas survey link
              </mj-button>
            ` : `
              ${dialogues.map((dialogue) => `
              <mj-text>
                <div>
                ${dialogue.title}
                </div>
                <a href="${config.clientUrl}/${workspaceSlug}/${dialogue.slug}" target="_blank">${dialogue.title} link</a>
              </mj-text>
              `)}
            `}
                </mj-column>
            </mj-section>
        </mj-body>
        </mjml>
    `).html;
};

export default makeDialogueLinkReminderTemplate;
