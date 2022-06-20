// import React, { useCallback, useContext, useRef } from 'react';
// import qs from 'qs';
// import useDialogueTree from 'providers/DialogueTreeProvider';

// import { useAppendToInteractionMutation, useCreateSessionMutation } from 'types/generated-types';
// import { useLocation } from 'react-router-dom';

// const UploadQueueContext = React.createContext({} as any);

// export const UploadQueueProvider = ({ children }: { children: React.ReactNode }) => {
//   const willAppend = useRef(false);
//   const location = useLocation();

//   const queue = useRef<any>([]);
//   const { store, originUrl, device, startTime } = useDialogueTree();
//   const [createInteraction, { data: interactionData }] = useCreateSessionMutation();
//   const [appendToInteraction] = useAppendToInteractionMutation();
//   const ref = qs.parse(location.search, { ignoreQueryPrefix: true })?.ref?.toString() || '';

//   /**
//    * Upload the main interaction
//   */
//   const handleUploadInteraction = useCallback(() => {
//     const uploadEntries = store.relevantSessionEntries;

//     // We only upload if we have not done so before, and also, as long as we have any entries to upload after all.
//     if (!willAppend.current && uploadEntries.length) {
//       createInteraction({
//         variables: {
//           input: {
//             dialogueId: store.tree?.id || '',
//             deliveryId: ref,
//             totalTimeInSec: Math.min(600, Math.floor((Date.now() - startTime) / 1000)) || -1,
//             originUrl,
//             device,
//             entries: uploadEntries.map((entry: any) => ({
//               nodeId: entry.node.node.id,
//               edgeId: entry.edge?.id,
//               depth: entry.depth,
//               data: entry.node?.data,
//             })),
//           },
//         },
//       }).then(() => {
//         store.finalize();
//         willAppend.current = true;
//       });
//     }
//   }, [createInteraction, store, willAppend, ref, originUrl]);

//   /**
//    * Dequeue the first item in our queue.
//    */
//   const dequeueEntry = () => {
//     if (!queue.current.length || !interactionData || !willAppend.current) return;

//     const entry = queue.current[0];

//     appendToInteraction({
//       variables: {
//         input: {
//           sessionId: interactionData?.createSession?.id,
//           nodeId: entry.nodeId,
//           edgeId: entry.edgeId,
//           data: { ...entry.data },
//         },
//       },
//     })
//       .catch((err: any) => console.error(err))
//       .finally(() => {
//         // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
//         const [_, ...tempQueue] = queue.current;
//         queue.current = tempQueue;

//         if (queue.current.length) dequeueEntry();
//       });
//   };

//   const reset = () => {
//     if (willAppend.current) {
//       queue.current = [];
//       willAppend.current = false;
//     }
//   };

//   /**
//    * Queue an item to the end of our list, and instantly dequeue it.
//    */
//   const queueEntry = (entry: any) => {
//     if (willAppend.current) {
//       queue.current = [...queue.current, entry];
//       dequeueEntry();
//     }
//   };

//   return (
//     <UploadQueueContext.Provider value={{
//       reset,
//       queueEntry,
//       dequeueEntry,
//       uploadInteraction: handleUploadInteraction,
//       appendToInteraction: null,
//       willQueueEntry: willAppend,
//     }}
//     >
//       {children}
//     </UploadQueueContext.Provider>
//   );
// };

// const useUploadQueue = () => useContext(UploadQueueContext);

// export default useUploadQueue;
