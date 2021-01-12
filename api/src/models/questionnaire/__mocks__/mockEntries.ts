import { InputSource, NodeType } from "@prisma/client";

export const mockNegativeEntries = [
  {
    id: 'ckjmq8fzt5480rx11t1e8vu2y',
    creationDate: new Date('2021-01-07T10:47:46.170Z'),
    depth: 2,
    relatedEdgeId: 'ckf5hoii39739128go2ekltkaz1',
    relatedNodeId: 'ckf5hoihx9739048go2pf1ycrha',
    sessionId: 'ckjmq8fzt5477rx11gjhfoy4k',
    inputSource: 'CLIENT' as InputSource,
    choiceNodeEntry: {
      id: 1840,
      value: 'Has to wear a Feyenoord jersey for a day',
      nodeEntryId: 'ckjmq8fzt5480rx11t1e8vu2y'
    },
    linkNodeEntry: null,
    registrationNodeEntry: null,
    sliderNodeEntry: null,
    textboxNodeEntry: null,
    relatedNode: {
      id: 'ckf5hoihx9739048go2pf1ycrha',
      creationDate: new Date('2020-09-16T14:37:25.029Z'),
      updatedAt: new Date('2020-09-16T14:37:25.030Z'),
      isLeaf: false,
      isRoot: false,
      title: 'What should be his punishment?',
      type: 'CHOICE' as NodeType,
      overrideLeafId: null,
      questionDialogueId: 'ckf5fd2ol8671528go2z5qosa7v',
      edgeId: null,
      sliderNodeId: null,
      formNodeId: null
    }
  },
];

export const mockPositiveEntries = [
  {
    id: 'ckjiuvbe35918dl1122yyngpk',
    creationDate: new Date('2021-01-04T17:46:27.051Z'),
    depth: 2,
    relatedEdgeId: 'ckf5h10to9548808go2gpaypapt',
    relatedNodeId: 'ckf5h10tg9548728go2rgf98shz',
    sessionId: 'ckjiuvbe25915dl118v75rze6',
    inputSource: 'CLIENT' as InputSource,
    choiceNodeEntry: {
      id: 1834,
      value: 'The Polish space program',
      nodeEntryId: 'ckjiuvbe35918dl1122yyngpk'
    },
    linkNodeEntry: null,
    registrationNodeEntry: null,
    sliderNodeEntry: null,
    textboxNodeEntry: null,
    relatedNode: {
      id: 'ckf5h10tg9548728go2rgf98shz',
      creationDate: new Date('2020-09-16T14:19:09.028Z'),
      updatedAt: new Date('2020-09-16T14:19:09.029Z'),
      isLeaf: false,
      isRoot: false,
      title: 'What topics did you like?',
      type: 'CHOICE' as NodeType,
      overrideLeafId: null,
      questionDialogueId: 'ckf5fd2ol8671528go2z5qosa7v',
      edgeId: null,
      sliderNodeId: null,
      formNodeId: null
    },
    x: 'Mon, 04 Jan 2021 17:46:27 GMT',
    y: 85,
    entryId: 'ckjiuvbe25916dl11rqchbyse'
  },
  {
    id: 'ckjlsv6xv4259bt11jumfw2pc',
    creationDate: new Date('2021-01-06T19:13:40.579Z'),
    depth: 2,
    relatedEdgeId: 'ckf5h10to9548808go2gpaypapt',
    relatedNodeId: 'ckf5h10tg9548728go2rgf98shz',
    sessionId: 'ckjlsv6xt4256bt11dsngooor',
    inputSource: 'CLIENT' as InputSource,
    choiceNodeEntry: {
      id: 1836,
      value: 'Why cheap Tequila is best Tequila',
      nodeEntryId: 'ckjlsv6xv4259bt11jumfw2pc'
    },
    linkNodeEntry: null,
    registrationNodeEntry: null,
    sliderNodeEntry: null,
    textboxNodeEntry: null,
    relatedNode: {
      id: 'ckf5h10tg9548728go2rgf98shz',
      creationDate: new Date('2020-09-16T14:19:09.028Z'),
      updatedAt: new Date('2020-09-16T14:19:09.029Z'),
      isLeaf: false,
      isRoot: false,
      title: 'What topics did you like?',
      type: 'CHOICE' as NodeType,
      overrideLeafId: null,
      questionDialogueId: 'ckf5fd2ol8671528go2z5qosa7v',
      edgeId: null,
      sliderNodeId: null,
      formNodeId: null
    },
    x: 'Wed, 06 Jan 2021 19:13:40 GMT',
    y: 82,
    entryId: 'ckjlsv6xu4257bt111qsmai9q'
  },
  {
    id: 'ckjmq7zu25114rx112pphi626',
    creationDate: new Date('2021-01-07T10:47:25.226Z'),
    depth: 2,
    relatedEdgeId: 'ckf5hc1tz9644098go2s9z4w9um',
    relatedNodeId: 'ckf5hc1tt9644018go2e1wkq72p',
    sessionId: 'ckjmq7zu15111rx11ngpwt0fw',
    inputSource: 'CLIENT' as InputSource,
    choiceNodeEntry: {
      id: 1838,
      value: 'Stop yelling! We can hear you fine.',
      nodeEntryId: 'ckjmq7zu25114rx112pphi626'
    },
    linkNodeEntry: null,
    registrationNodeEntry: null,
    sliderNodeEntry: null,
    textboxNodeEntry: null,
    relatedNode: {
      id: 'ckf5hc1tt9644018go2e1wkq72p',
      creationDate: new Date('2020-09-16T14:27:43.553Z'),
      updatedAt: new Date('2020-09-16T14:27:43.553Z'),
      isLeaf: false,
      isRoot: false,
      title: 'Was ist los mit meine Deutsch?',
      type: 'CHOICE' as NodeType,
      overrideLeafId: null,
      questionDialogueId: 'ckf5fd2ol8671528go2z5qosa7v',
      edgeId: null,
      sliderNodeId: null,
      formNodeId: null
    },
    x: 'Thu, 07 Jan 2021 10:47:25 GMT',
    y: 74,
    entryId: 'ckjmq7zu25112rx11mrico96a'
  }
];
