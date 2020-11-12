// TODO: Replace CRA with Nextjs
const DialogueTemplate = `
haas:
  ctas:
    - node: { handle: 'CTA-SHARE', heading: 'Share with your friends!', type: 'Share' }
    - node: { handle: 'CTA-OPINION', heading: 'Let us know your opinion!', type: 'Opinion' }
    - node: { handle: 'CTA-OPINION-2', heading: 'Were sorry to hear that. Let us know your opinion!', type: 'Opinion' }

  dialogue: 
    node: { handle: '0-SLIDER', heading: 'How do you feel?', type: 'Slider' }
    children: 
    
    # Positive
    - node: {
        condition: { min: 60, max: 100 },
        node: { heading: 'Why do you feel good?', type: 'Choice', options: ['Application', 'Facilities']  },
        cta: { byHandle: 'CTA-SHARE' },
        children: [
          node: {
            condition: { matchValue: 'Application' },
            heading: 'What did you like about the Application?', type: 'Choice', options: ['Application Design', 'Website design', 'Good AI Partner'],
          },
          node: {
            condition: { matchValue: 'Facilities' },
            heading: 'What did you like about the Facilities?', type: 'Choice', options: ['Application Design', 'Website design', 'Good AI Partner'],
          },
        ]
      }
`;

export default DialogueTemplate;
