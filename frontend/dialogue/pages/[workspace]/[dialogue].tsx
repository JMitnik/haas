import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { Customer, Dialogue as DialogueType, GetDialogueDocument, GetDialogueQuery, GetDialogueQueryResult, GetDialogueQueryVariables } from 'types/generated-types';
import client from 'config/apollo';
import Dialogue from 'components/Dialogue/Dialogue';

interface DialogueProps {
  dialogue: DialogueType;
  workspace: Customer
}

const DialoguePage = ({ dialogue, workspace }: DialogueProps) => {
  return (
    <div>
      <Head>
        <title>{`${workspace.name}: ${dialogue.title}`}</title>
        <meta name="description" content={dialogue.description} />
        <meta property="og:title" content={`${workspace.name}: ${dialogue.title}`} />
        <meta property="og:description" content={dialogue.description} />
        <meta property="og:image" content="https://haas-public-assets.s3.eu-central-1.amazonaws.com/haas-cover.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ width: '100%', height: '100vh' }}>
        <Dialogue
          dialogue={dialogue}
          workspace={workspace}
        />
      </div>
    </div>
  );
}

/**
 * Retrieves the dialogue and workspace from API.
 *
 * - If they cannot be found, redirect to 404 page.
 * @param context
 * @returns
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await client.query<GetDialogueQuery, GetDialogueQueryVariables>({
    query: GetDialogueDocument,
    variables: {
      customerSlug: context.query.workspace as string,
      dialogueSlug: context.query.dialogue as string,
    }
  });

  if (!res.data.customer || !res.data.customer.dialogue) {
    return {
      props: {},
      redirect: {
        destination: '/404',
      }
    }
  }

  return {
    props: {
      workspace: res.data.customer,
      dialogue: res.data.customer.dialogue,
    },
  }
};

export default DialoguePage;
