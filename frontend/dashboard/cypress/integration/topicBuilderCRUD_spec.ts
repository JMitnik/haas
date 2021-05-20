import "cypress-localstorage-commands";
import getTopicBuilder from '../../src/mocks/fixtures/topic-builder/mockGetTopicBuilder';
import getPostUpdateGetTopicBuilder from '../../src/mocks/fixtures/topic-builder/mockPostEditGetTopicBuilder';
import getDialoguesOfWorkspace from '../../src/mocks/fixtures/mockGetDialoguesOfWorkspace';
import getPostDeleteGetTopicBuilder from '../../src/mocks/fixtures/topic-builder/mockPostDeleteGetTopicBuilder';
import getPreAddGetTopicBuilder from '../../src/mocks/fixtures/topic-builder/mockPreAddGetTopicBuilder'

describe("Login logic", () => {

  beforeEach(() => {
    cy.setLocalStorage("access_token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbTc5ejdmaTAwMDAwMW1oZjhwdzl3a3EiLCJleHAiOjE2MTU4NzI4MzgsImlhdCI6MTYxNTYxMzYzOH0.Zuxda8KPUC7Hw12hcvFgDNtO6AxyZZfiyy0fZ5GhUwc');
    cy.saveLocalStorage();
  });

  it("Read Topic Builder Question", () => {
    cy.login();
    cy.findByText('Lufthansa').should('exist');
    cy.findByTestId('CustomerCard').as('card');
    cy.get('@card').click();
    cy.findByText(getDialoguesOfWorkspace.data.customer.dialogues[0].title).click();
    cy.findByText('Dialogue Builder').should('exist').click();


    // Root question (SLIDER) READ
    cy.findByText(getTopicBuilder.data.customer.dialogue.questions[0].title).as('rootQuestionTitle').should('exist');
    cy.get('@rootQuestionTitle').parent().parent().parent().as('rootQuestion').within(() => {
      cy.findByText('Slider').should('exist');
      cy.get('button').should('exist').click();
    })

    cy.get('form').within(() => {
      cy.findByLabelText(/Title*/gi).parent().within(() => {
        cy.findByText(getTopicBuilder.data.customer.dialogue.questions[0].title).should('exist');
      });

      cy.findByLabelText(/Question type*/gi).as('questionType').should('exist')
      cy.get('@questionType').parent().parent().siblings('div').then((div) => {
        cy.wrap(div).should('have.text', 'Slider');
      })

      // Since slider option is selected markers section should be visible
      cy.findAllByTestId('marker').then((markers) => {
        cy.wrap(markers).should('have.length', 5);
        cy.wrap(markers[0]).within(() => {
          cy.findByLabelText('Label').should('have.value', 'Amazing!');
          cy.findByLabelText('Helper label').should('have.value', 'This is excellent.');
        });

        cy.wrap(markers[1]).within(() => {
          cy.findByLabelText('Label').should('have.value', 'Good!');
          cy.findByLabelText('Helper label').should('have.value', 'This is good.');
        });

        cy.wrap(markers[2]).within(() => {
          cy.findByLabelText('Label').should('have.value', 'Neutral!');
          cy.findByLabelText('Helper label').should('have.value', 'Something is not great.');
        });

        cy.wrap(markers[3]).within(() => {
          cy.findByLabelText('Label').should('have.value', 'Bad');
          cy.findByLabelText('Helper label').should('have.value', 'This is bad.');
        });

        cy.wrap(markers[4]).within(() => {
          cy.findByLabelText('Label').should('have.value', 'Terrible');
          cy.findByLabelText('Helper label').should('have.value', 'This is terrible');
        });
      });
      cy.findByText('Cancel').click();
    });

    // Child question of Slider READ
    cy.findByText(getTopicBuilder.data.customer.dialogue.questions[1].title).as('choiceQuestionTitle').should('exist');
    cy.get('@choiceQuestionTitle').parent().parent().parent().parent().parent().parent().as('choiceQuestion').within(() => {
      cy.findByText('Choice').should('exist');
      cy.findByText('Edit').should('exist').click();
    });

    cy.get('form').within(() => {
      // Display child condition READ
      cy.findByLabelText(/Minimum value./gi).should('have.value', 70);
      cy.findByLabelText(/Maximum value./gi).should('have.value', 100);

      // Display Choice options READA
      cy.findAllByTestId('choiceOption').then((choiceOptions) => {
        cy.wrap(choiceOptions).should('have.length', 4);
        cy.wrap(choiceOptions[0]).within(() => {
          cy.findByText('Facilities').should('exist');
        });
        cy.wrap(choiceOptions[1]).within(() => {
          cy.findByText('Website/Mobile app').should('exist');
        });

        cy.wrap(choiceOptions[2]).within(() => {
          cy.findByText('Product/Services').should('exist');
        });

        cy.wrap(choiceOptions[3]).within(() => {
          cy.findByText('Customer Support').should('exist');
        });
      });
      cy.findByText('Cancel').click();
    })
    // TODO: Child question of Choice READ (Should show a dropdown instead of min/max values)
    // Expand depth 1 choice question
    cy.get('@choiceQuestion').within(() => {
      cy.findByText(/Expand./gi).should('exist').click();
    });

    cy.findByText('What exactly did you like about the facilities?').parent().parent().parent().within(() => {
      cy.get('button').click();
    });

    cy.get('form').within(() => {
      cy.findByLabelText(/Match value*/gi).as('matchText').should('exist')
      cy.get('@matchText').parent().parent().siblings('div').then((div) => {
        cy.wrap(div).should('have.text', 'Facilities');
      })
    })
  });

  it('Update topic builder question', () => {
    cy.login();
    cy.findByText('Lufthansa').should('exist');
    cy.findByTestId('CustomerCard').as('card');
    cy.get('@card').click();
    cy.findByText(getDialoguesOfWorkspace.data.customer.dialogues[0].title).click();
    cy.findByText('Dialogue Builder').should('exist').click();


    // Root question (SLIDER) READ
    cy.findByText(getTopicBuilder.data.customer.dialogue.questions[0].title).as('rootQuestionTitle').should('exist');
    cy.get('@rootQuestionTitle').parent().parent().parent().parent().parent().parent().as('rootQuestion').within(() => {
      cy.findByText('Slider').should('exist');
      cy.findByText('None').should('exist');
      cy.findByText('Edit').should('exist').click();
    });

    cy.window().then((window: any) => {
      // Reference global instances set in "src/mocks.js".
      const { worker, graphql } = window.msw;
      worker.use(
        graphql.query('getTopicBuilder', (req: any, res: any, ctx: any) => {
          return res(ctx.data(getPostUpdateGetTopicBuilder.data));
        }),
      );
    });

    cy.get('form').within(() => {
      cy.get('span[role]').invoke('text', 'New question title');
      // Change from slider to choice
      cy.get('#question-type-select').type('Choice{enter}');

      cy.findByLabelText(/Call-to-Action/gi).as('ctaType').should('exist');
      cy.get('@ctaType').parent().parent().siblings('div').then((div) => {
        cy.wrap(div).should('have.text', 'None');
      });
      // Already found the select normally so do it by dataid now
      // Change from no CTA to a CTA
      cy.get('#cta-type-select').type('come{enter}');
      cy.findByText('Save').should('exist').click()
    });

    cy.findByText('New question title').as('rootQuestionTitle').should('exist');

    cy.get('@rootQuestionTitle').parent().parent().parent().parent().parent().parent().as('rootQuestion').within(() => {
      cy.findByText('Choice').should('exist');
      cy.findByText('Form').should('exist');
    });
  });

  it('Delete topic builder question', () => {
    cy.login();
    cy.findByText('Lufthansa').should('exist');
    cy.findByTestId('CustomerCard').as('card');
    cy.get('@card').click();
    cy.findByText(getDialoguesOfWorkspace.data.customer.dialogues[0].title).click();
    cy.findByText('Dialogue Builder').should('exist').click();


    // Root question (SLIDER) READ
    cy.findByText('What did you like?').as('questionTitle').should('exist');
    cy.get('@questionTitle').parent().parent().parent().parent().parent().parent().as('rootQuestion').within(() => {
      cy.findByText('Edit').should('exist').click();
    });

    cy.window().then((window: any) => {
      // Reference global instances set in "src/mocks.js".
      const { worker, graphql } = window.msw;
      worker.use(
        graphql.query('getTopicBuilder', (req: any, res: any, ctx: any) => {
          return res(ctx.data(getPostDeleteGetTopicBuilder.data));
        }),
      );
    });

    cy.get('form').within(() => {
      cy.findByText('Delete').should('exist').click();
    });

    cy.findByTestId('delete-popover').within(() => {
      cy.get('button').contains('Delete').as('deleteButton').should('exist');
      cy.get('@deleteButton').click();
    })

    cy.findByText('What did you like?').should('not.exist');

  });

  it('Create topic builder question', () => {
    cy.login();

    cy.window().then((window: any) => {
      // Reference global instances set in "src/mocks.js".
      const { worker, graphql } = window.msw;
      worker.use(
        graphql.query('getTopicBuilder', (req: any, res: any, ctx: any) => {
          return res(ctx.data(getPreAddGetTopicBuilder.data));
        }),
      );
    });

    cy.findByText('Lufthansa').should('exist');
    cy.findByTestId('CustomerCard').as('card');
    cy.get('@card').click();
    cy.findByText(getDialoguesOfWorkspace.data.customer.dialogues[0].title).click();
    cy.findByText('Dialogue Builder').should('exist').click();


    // Root question (SLIDER) READ
    cy.findByText('What did you like?').should('not.exist');
    cy.findByText('Add question').should('exist').click();

    cy.window().then((window: any) => {
      // Reference global instances set in "src/mocks.js".
      const { worker, graphql } = window.msw;
      worker.use(
        graphql.query('getTopicBuilder', (req: any, res: any, ctx: any) => {
          return res(ctx.data(getTopicBuilder.data));
        }),
      );
    });

    cy.get('form').within(() => {
      cy.get('.CodeMirror textarea');
      // we use `force: true` below because the textarea is hidden
      // and by default Cypress won't interact with hidden elements
        .type('What did you like?', { force: true });

      cy.findByLabelText(/Minimum value*/).should('exist').type('70');
      cy.findByLabelText(/Maximum value*/).should('exist').type('100');

      // Change from slider to choice
      cy.get('#question-type-select').type('Choice{enter}');

      // Already found the select normally so do it by dataid now
      // Change from no CTA to a CTA
      cy.get('#cta-type-select').type('Instagram{enter}');
      cy.findByText('Add choice').should('exist').click();
      cy.findByText(/Set your choice/).click();
    });

    cy.findByTestId('choice-input-area').should('exist').type('Facilities');

    cy.get('form').within(() => {
      cy.findByText('Save').should('exist').click();
    })
    
    cy.findByText('What did you like?').should('exist');

  });

});