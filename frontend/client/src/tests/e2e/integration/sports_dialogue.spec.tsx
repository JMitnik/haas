/**
 * This test suite is meant to test the dialogue meant for Sports teams.
 */

import {
  AppendToInteractionInput,
  SessionInput,
} from 'types/generated-types';
import { mockMutationAppendToInteraction } from 'tests/__mocks__/AppendToInteraction.mock';
import { mockMutationCreateSessionMock } from 'tests/__mocks__/CreateSession.mock';
import { mockQueryGetCustomer } from 'tests/__mocks__/GetSportsDialogue.mock';

/**
 * Flow follows:
 * 1. Positive slide (80)
 * 2. Choice: Coaching
 * 3. Finish
 */
it('dialogue is finished on a positive flow', () => {
  mockQueryGetCustomer((res) => ({ ...res }));

  cy.visit('http://localhost:3000/club-hades/Female-U18-Team2');

  cy.wait('@gqlGetCustomerQuery').then((req) => {
    expect(req.request.body.variables.slug).equal('club-hades');
  });

  cy.findByText('How are you feeling?');

  // Slide positive to an 8.0
  cy.slide(80, 2);

  // Arrive at a positive screen
  cy.findByText('What\'s going well?');

  mockMutationCreateSessionMock((res) => ({ ...res }));
  // Find a coaching button and click on it.
  cy.findByText('Coaching').click();

  cy.wait('@gqlcreateSessionMutation').then((req) => {
    const input = req.request.body.variables?.input as SessionInput;
    expect(input.entries).to.length(2);
    expect(input.entries?.[0]?.depth).to.be.equal(0);
    expect(input.entries?.[0]?.data?.slider?.value).to.be.equal(80);

    expect(input.entries?.[1]?.depth).to.be.equal(1);
    expect(input.entries?.[1]?.data?.choice?.value).to.be.equal('Coaching');
  });

  // Should finish the dialogue
  cy.findByText('Thank you for your input!');

  cy.wait(1000);

  // TODO: Assert mutation was run with appropriate variables

  // We should not be back in the loading screen.
  cy.findByText('How are you feeling').should('not.exist');
});

/**
 * Flow follows:
 * 1. Positive slide (80)
 * 2. Go back
 * 3. Negative slide (20)
 * 4. Choice: Coaching
 * 5. Form-fill (and share)
 * 6. Finish
 */
it('dialogue follows negative flow, share details', () => {
  mockQueryGetCustomer((res) => ({ ...res }));
  cy.visit('http://localhost:3000/club-hades/Female-U18-Team2');

  cy.wait('@gqlGetCustomerQuery').then((req) => {
    expect(req.request.body.variables.slug).equal('club-hades');
  });

  cy.findByText('How are you feeling?');

  // Slide positive to an 8.0
  cy.slide(80, 2);

  // Arrive at a positive screen
  cy.findByText('What\'s going well?');

  // // Go back
  cy.go('back');

  // Slide negative to a 2.0 instead
  cy.slide(20, 2);

  // Arrive at a negative screen
  cy.findByText('What went wrong?');

  mockMutationCreateSessionMock((res) => ({ ...res }));
  // Find a coaching button and click on it.
  cy.findByText('Coaching').click();

  cy.findByText('Next').click();

  cy.wait('@gqlcreateSessionMutation').then((req) => {
    const input = req.request.body.variables?.input as SessionInput;

    expect(input.entries).to.length(2);
    expect(input.entries?.[0]?.depth).to.be.equal(0);
    expect(input.entries?.[0]?.data?.slider?.value).to.be.equal(20);

    expect(input.entries?.[1]?.depth).to.be.equal(1);
    expect(input.entries?.[1]?.data?.choice?.value).to.be.equal('Coaching');
  });

  // Should arrive at a form screen
  cy.findByText('Your feedback will always remain anonymous, unless you want to talk to someone.');

  mockMutationAppendToInteraction((res) => ({ ...res }));
  // Fill out the form
  // cy.findByLabelText('First name').type('John');
  // cy.findByLabelText('Last name').type('Doe');
  cy.findByLabelText('Email*').type('johndoe@gmail.com');

  // Submit button
  cy.findByRole('button', { name: 'Submit' }).click();

  cy.wait('@gqlappendToInteractionMutation').then((req) => {
    const input = req.request.body.variables?.input as AppendToInteractionInput;
    expect(input.sessionId).to.be.equal('TEST_SESSION_1');
    expect(input.data?.form?.values).length(2);
    // expect(input.data?.form?.values?.[0]?.shortText).to.be.equal('John');
    // expect(input.data?.form?.values?.[1]?.shortText).to.be.equal('Doe');
    expect(input.data?.form?.values?.[0]?.email).to.be.equal('johndoe@gmail.com');
  });

  // Should finish the dialogue
  cy.findByText('Thank you for your input!');
  cy.wait(1000);

  // // We should not be back in the loading screen.
  cy.findByText('How are you feeling').should('not.exist');

  // If we refresh, we should be sent back to the start of the dialogue
  mockQueryGetCustomer((res) => ({ ...res }));
  cy.reload();
  cy.findByText('How are you feeling?');
});

/**
 * Flow follows:
 * 1. Positive slide (80)
 * 2. Go back
 * 3. Negative slide (20)
 * 4. Choice: Coaching
 * 5. Form-fill (and NOT share)
 * 6. Finish
 */
it('dialogue follows negative flow, not share details, and goes back', () => {
  mockQueryGetCustomer((res) => ({ ...res }));
  cy.visit('http://localhost:3000/club-hades/Female-U18-Team2');

  cy.findByText('How are you feeling?');

  // Slide positive to an 8.0
  cy.slide(80, 2);

  // Arrive at a positive screen
  cy.findByText('What\'s going well?');

  // // Go back
  cy.go('back');

  // Slide negative to a 2.0 instead
  cy.slide(20, 2);

  // Arrive at a negative screen
  cy.findByText('What went wrong?');

  mockMutationCreateSessionMock((res) => ({ ...res }));
  // Find a coaching button and click on it.
  cy.findByText('Coaching').click();

  cy.findByText('Next').click();

  cy.wait('@gqlcreateSessionMutation').then((req) => {
    const input = req.request.body.variables?.input as SessionInput;

    expect(input.entries).to.length(2);
    expect(input.entries?.[0]?.depth).to.be.equal(0);
    expect(input.entries?.[0]?.data?.slider?.value).to.be.equal(20);

    expect(input.entries?.[1]?.depth).to.be.equal(1);
    expect(input.entries?.[1]?.data?.choice?.value).to.be.equal('Coaching');
  });

  // Should arrive at a form screen
  cy.findByText('Your feedback will always remain anonymous, unless you want to talk to someone.');

  mockMutationAppendToInteraction((res) => ({ ...res }));
  // Submit button
  cy.findByRole('button', { name: 'Stay anonymous' }).click();

  cy.wait('@gqlappendToInteractionMutation').then((req) => {
    const input = req.request.body.variables?.input as AppendToInteractionInput;
    expect(input.sessionId).to.be.equal('TEST_SESSION_1');
    // expect(input.data?.form?.values).length(2);
    // expect(input.data?.form?.values?.[0]?.email).to.be.equal(undefined);
    // expect(input.data?.form?.values?.[1]?.shortText).to.be.equal(undefined);
    // expect(input.data?.form?.values?.[2]?.email).to.be.equal(undefined);
  });

  // Should finish the dialogue
  cy.findByText('Thank you for your input!');

  cy.wait(1000);

  // // We should not be back in the loading screen.
  cy.findByText('How are you feeling').should('not.exist');

  // If we go back NOW, we should be sent to the start of the dialogue
  cy.go('back');
  cy.findByText('Try again?');
});
