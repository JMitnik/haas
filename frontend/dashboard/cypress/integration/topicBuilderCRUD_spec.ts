import "cypress-localstorage-commands";
import getTopicBuilder from '../../src/mocks/fixtures/topic-builder/mockGetTopicBuilder';
import getDialoguesOfWorkspace from '../../src/mocks/fixtures/mockGetDialoguesOfWorkspace';

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

});