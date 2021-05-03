import "cypress-localstorage-commands";

const UPDATE_WORKSPACE_INPUT = {
  workspaceName: 'Starbucks',
  workspaceSlug: 'starbucks',
  primaryColor: '#DC143C',
  logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1024px-Starbucks_Corporation_Logo_2011.svg.png'
}

describe("Login logic", () => {

  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body.operationName === 'getQuestionnairesOfCustomer') {
        req.reply({ fixture: 'mockGetDialoguesOfWorkspace.json' })
      }
    }).as('getQuestionnairesOfCustomer');

    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body.operationName === 'getCustomerOfUser') {
        req.reply({ fixture: 'mockWorkspaceOfUserWithAdminRights.json' })
      }
    }).as('getCustomerOfUser');

    cy.graphql('me', (req) => {
      req.reply({ fixture: 'mockAdminUser.json' });
    }, 'me');

    cy.graphql('refreshAccessToken', (req) => {
      req.reply({ fixture: 'mockRefreshActionToken.json' });
    }, 'refreshAccessToken');


    cy.graphql('editWorkspace', (req) => {
      req.reply({ fixture: 'mockEditWorkspace.json' })
    }, 'editWorkspace')

  });

  beforeEach(() => {
    cy.setLocalStorage("access_token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbTc5ejdmaTAwMDAwMW1oZjhwdzl3a3EiLCJleHAiOjE2MTU4NzI4MzgsImlhdCI6MTYxNTYxMzYzOH0.Zuxda8KPUC7Hw12hcvFgDNtO6AxyZZfiyy0fZ5GhUwc');
    cy.saveLocalStorage();
  });

  before(() => {
    cy.graphql('getCustomers', (req) => {
      console.log('BODY: ', req)
      req.reply({ fixture: 'mockGetCustomers.json' });
    }, 'getCustomers');
  })

  it("READ workspace data", () => {
    cy.login();
    cy.wait('@getCustomers');

    // Test READ workspace
    cy.findByText('Lufthansa').should('exist');

    // Test logo is displayed on workspace card
    cy.get('img').should('have.attr', 'src', 'https://www.vakantie-krant.nl/wp-content/uploads/2014/03/lufthansa-logo.jpg');

    cy.findByTestId('CustomerCard').as('card').should('have.css', 'background-color', 'rgb(190, 227, 248)');

    // TEST READ edit workspace form
    cy.get('@card').click();
    cy.wait('@getCustomerOfUser')
    cy.wait('@getQuestionnairesOfCustomer');
    cy.findByText('Settings').as('settings').should('exist').click();
    cy.wait('@me')
    cy.wait('@refreshAccessToken')

    cy.get('form').findByLabelText(/(Name.)/gi).as('nameField').should('exist')
    cy.get('@nameField').should('have.value', 'Lufthansa')

    cy.get('form').findByLabelText(/URL extension./gi).as('slugField').should('exist')
    cy.get('@slugField').should('have.value', 'lufthansa')

    cy.get('form').get('button').findByText(/Primary/gi).should('exist').click()
    cy.findByTestId('colorPicker').as('colorPicker').should('exist')
    cy.get('@colorPicker').within(() => {
      cy.get('input').should('have.value', '#BEE3F8')
    })

    cy.findByLabelText(/Logo: existing URL/gi).as('logoUrl').should('exist')
    cy.get('@logoUrl').should('have.value', 'https://www.vakantie-krant.nl/wp-content/uploads/2014/03/lufthansa-logo.jpg')
  });

  it('UPDATE workspace data', () => {
    cy.login();

    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body.operationName === 'getQuestionnairesOfCustomer') {
        req.reply({ fixture: 'mockGetDialoguesOfWorkspace.json' })
      }
    }).as('getQuestionnairesOfCustomer');

    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body.operationName === 'getCustomerOfUser') {
        req.reply({ fixture: 'mockWorkspaceOfUserWithAdminRights.json' })
      }
    }).as('getCustomerOfUser');

    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body.operationName === 'getCustomers') {
        req.reply({ fixture: 'mockGetCustomers.json' })
      }
    }).as('getCustomers');


    cy.wait('@getCustomers')
    // Access workspace
    cy.findByTestId('CustomerCard').as('card')
    cy.get('@card').click({ force: true });
    cy.wait(['@getCustomerOfUser', '@getQuestionnairesOfCustomer'])

    // Enter new data
    cy.findByText('Settings').as('settings').should('exist').click();
    // cy.wait('@me')
    cy.wait('@refreshAccessToken')
    cy.wait(1000)
    cy.get('form').findByLabelText(/(Name.)/gi).as('nameField').should('exist')
    cy.get('@nameField').clear().type(UPDATE_WORKSPACE_INPUT.workspaceName)

    cy.get('form').get('button').findByText(/Primary/gi).should('exist').click()
    cy.findByTestId('colorPicker').as('colorPicker').should('exist')
    cy.get('@colorPicker').within(() => {
      cy.get('input').clear().type(UPDATE_WORKSPACE_INPUT.primaryColor)
    })

    cy.findByLabelText(/Logo: existing URL/gi).as('logoUrl').should('exist')
    cy.get('@logoUrl').clear().type(UPDATE_WORKSPACE_INPUT.logoUrl)
    cy.get('@logoUrl').should('have.value', UPDATE_WORKSPACE_INPUT.logoUrl)

    cy.findByText('Edit').click();

    cy.graphql('editWorkspace', (req) => {
      req.reply({ fixture: 'mockEditWorkspace.json' })
    }, 'editWorkspace')

    cy.wait('@editWorkspace', { log: true })
      .its('request.body.variables.input').then((input) => {
        // cy.wrap(input.slug).should('equal', UPDATE_WORKSPACE_INPUT.workspaceSlug);
        cy.wrap(input.name).should('equal', UPDATE_WORKSPACE_INPUT.workspaceName);
        cy.wrap(input.logo).should('equal', UPDATE_WORKSPACE_INPUT.logoUrl);
        cy.wrap(input.primaryColour).should('equal', UPDATE_WORKSPACE_INPUT.primaryColor.toLowerCase());
      })

    cy.wait(['@me', '@refreshAccessToken']);

    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body.operationName === 'getCustomers') {
        req.reply({ fixture: 'mockPostEditGetCustomers.json' })
      }
    }).as('getEditedCustomers');

    cy.visit('http://localhost:3002/dashboard/b')

    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body.operationName === 'getCustomers') {
        req.reply({ fixture: 'mockPostEditGetCustomers.json' })
      }
    }).as('getEditedCustomers');

    cy.wait('@getEditedCustomers', { log: true })

    cy.findByText('Starbucks').should('exist');
    cy.get('img').should('have.attr', 'src', UPDATE_WORKSPACE_INPUT.logoUrl);
    cy.findByTestId('CustomerCard').as('card').should('have.css', 'background-color', 'rgb(220, 20, 60)');

  })
});