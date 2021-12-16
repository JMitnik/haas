import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { CreateSessionDocument, CreateSessionMutation, CreateSessionMutationVariables, Customer, Dialogue as DialogueType, GetDialogueDocument, GetDialogueQuery, GetDialogueQueryResult, GetDialogueQueryVariables, useUploadSessionEventsMutation } from 'types/generated-types';
import client from 'config/apollo';
import Dialogue from 'components/Dialogue/Dialogue';
import { SessionEventInput } from 'types/helper-types';
import { ApolloProvider } from '@apollo/client';
import { DialogueAdapter } from 'components/Dialogue/DialogueAdapter';

interface DialogueProps {
  sessionId: string;
  dialogue: DialogueType;
  workspace: Customer
}

const DialoguePage = ({ sessionId, dialogue, workspace }: DialogueProps) => {
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

      <ApolloProvider client={client}>
        <div style={{ width: '100%', height: '100vh' }}>
          <DialogueAdapter sessionId={sessionId} dialogue={dialogue} workspace={workspace} />
        </div>
      </ApolloProvider>
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


  const session = await client.mutate<CreateSessionMutation, CreateSessionMutationVariables>({
    mutation: CreateSessionDocument,
    variables: { input: { dialogueId: res.data.customer.dialogue.id } }
  });

  const sessionId = session.data?.createSession?.id;
  if (!sessionId) {
    return {
      props: {},
      redirect: {
        destination: '/404',
      }
    }
  }

  const workspace = res.data.customer;
  const dialogue = res.data.customer;

  return {
    props: {
      sessionId: sessionId,
      workspace: res.data.customer,
      dialogue: res.data.customer.dialogue,
    },
  }
};

export default DialoguePage;
