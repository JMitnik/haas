import Color from 'color';
import mjml2html from 'mjml';

interface makeRoleUpdateProps {
    recipientMail: string;
    customerName: string;
    newRoleName: string;
    token?: string;
    bgColor?: string;
}

const makeRoleUpdateTemplate = ({ recipientMail, customerName, newRoleName, bgColor = '#0059f8' }: makeRoleUpdateProps) => {
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
                        Role update!
                    </mj-text>
                </mj-column>
            </mj-section>
            <mj-section background-color="#eef1f5">
            <mj-column width="100%">
            <mj-text>
            Hi ${recipientMail},
            your role has just now been updated to ${newRoleName}
            in the ${customerName} workspace.
                    </mj-text>
                </mj-column>
            </mj-section>
        </mj-body>
        </mjml>
    `).html;
};

export default makeRoleUpdateTemplate;
