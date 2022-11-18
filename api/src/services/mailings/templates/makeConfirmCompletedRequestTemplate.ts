import Color from 'color';
import mjml2html from 'mjml';

import config from '../../../config/config';

export interface makeConfirmCompletedRequestTemplateProps {
  requestEmail: string;
  requestCreatedDate: Date;
  actionRequestId: string;
  topic: string;
  workspaceSlug: string;
  dialogueSlug: string;
  bgColor?: string;
}

const makeConfirmCompletedRequestTemplate = ({
  workspaceSlug, dialogueSlug, topic, requestEmail, actionRequestId, requestCreatedDate, bgColor = '#0059f8',
}: makeConfirmCompletedRequestTemplateProps) => {
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
                        ✨ Get in touch with your people!
                    </mj-text>
                </mj-column>
            </mj-section>
            <mj-section background-color="#eef1f5">
            <mj-column width="100%">
              <mj-text>
              Hi ${requestEmail}, someone has set your action request about ${topic} (created at ${requestCreatedDate}) to completed.
              </mj-text>

              <mj-text>
              To confirm this on your side, please click on one of the following buttons:
              </mj-text>
              <mj-button href="${config.clientUrl}/${workspaceSlug}/${dialogueSlug}/c/${actionRequestId}?agree=1" background-color="#36d399">
              👍 Accept
              </mj-button>
              <mj-button href="${config.clientUrl}/${workspaceSlug}/${dialogueSlug}/c/${actionRequestId}?agree=0" background-color="#FF7F7F">
              👎 Reject
              </mj-button>
          
            </mj-column>
          </mj-section>
        </mj-body>
        </mjml>
    `).html;
};

export default makeConfirmCompletedRequestTemplate;
