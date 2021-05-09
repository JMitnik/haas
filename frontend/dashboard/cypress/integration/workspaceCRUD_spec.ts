import "cypress-localstorage-commands";
import getCustomers from '../../src/mocks/fixtures/mockGetCustomers'
import getQuestionnairesOfCustomer from '../../src/mocks/fixtures/mockAdminUserPostWorkspaceEdit'

const CREATE_WORKSPACE_INPUT = {
  workspaceName: 'Lufthansa',
  workspaceSlug: 'lufthansa',
  primaryColor: '#BEE3F8',
  logoUrl: 'https://www.vakantie-krant.nl/wp-content/uploads/2014/03/lufthansa-logo.jpg'
}

const UPDATE_WORKSPACE_INPUT = {
  workspaceName: 'Starbucks',
  workspaceSlug: 'starbucks',
  primaryColor: '#DC143C',
  logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1024px-Starbucks_Corporation_Logo_2011.svg.png'
}

describe("Workspace DELETE logic", () => {
  beforeEach(() => {
    cy.setLocalStorage("access_token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbTc5ejdmaTAwMDAwMW1oZjhwdzl3a3EiLCJleHAiOjE2MTU4NzI4MzgsImlhdCI6MTYxNTYxMzYzOH0.Zuxda8KPUC7Hw12hcvFgDNtO6AxyZZfiyy0fZ5GhUwc');
    cy.saveLocalStorage();
  });

  it('DELETE workspace data', () => {
    cy.login();
    cy.wait(5000); // Necessary to wait for all animations to settle on laggy computer :') 
    cy.window().then((window: any) => {
      // Reference global instances set in "src/mocks.js".
      const { worker, graphql } = window.msw
      worker.use(
        graphql.query('getCustomers', (req: any, res: any, ctx: any) => {
          return res(ctx.data({
            "user": {
              "customers": [],
              "__typename": "UserType"
            }
          }));
        }),
      );
    }).then(() => {
      cy.findByText(/Delete/gi).click({ force: true });
      cy.findByTestId('DeleteWorkspaceButton').click({ force: true });
      cy.findByTestId('CustomerCard').should('not.exist');
      cy.findByText(/Your session has expired/gi).should('not.exist');
    })
  });
});

describe("Workspace CREATE logic", () => {

  beforeEach(() => {
    cy.setLocalStorage("access_token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbTc5ejdmaTAwMDAwMW1oZjhwdzl3a3EiLCJleHAiOjE2MTU4NzI4MzgsImlhdCI6MTYxNTYxMzYzOH0.Zuxda8KPUC7Hw12hcvFgDNtO6AxyZZfiyy0fZ5GhUwc');
    cy.saveLocalStorage();
  });

  it('CREATE workspace data', () => {
    cy.window().then((window: any) => {
      // Reference global instances set in "src/mocks.js".
      const { worker, graphql } = window.msw;
      worker.use(
        graphql.query('getCustomers', (req: any, res: any, ctx: any) => {
          return res(ctx.data({
            "user": {
              "customers": [],
              "__typename": "UserType"
            }
          }));
        }),
      );

      cy.login();
      cy.findByText('Create workspace').parent().siblings('a').click();
      cy.url().should('eq', 'http://localhost:3002/dashboard/b/add');

      // remove runtime-set getCustomers handler to avoid having no workspaces
      worker.resetHandlers();

      cy.get('form').within(() => {
        cy.findByLabelText(/Name./gi).type(CREATE_WORKSPACE_INPUT.workspaceName);
        cy.findByLabelText(/URL extension./gi).type(CREATE_WORKSPACE_INPUT.workspaceSlug);
        cy.findByLabelText(/Logo: existing URL*/gi).type(CREATE_WORKSPACE_INPUT.logoUrl);
        cy.findByText('Create').click({ force: true });
      })

      cy.findByText(getCustomers.data.user.customers[0].name).should('exist')

    })
  });
});

describe("Workspace READ logic", () => {

  beforeEach(() => {
    cy.setLocalStorage("access_token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbTc5ejdmaTAwMDAwMW1oZjhwdzl3a3EiLCJleHAiOjE2MTU4NzI4MzgsImlhdCI6MTYxNTYxMzYzOH0.Zuxda8KPUC7Hw12hcvFgDNtO6AxyZZfiyy0fZ5GhUwc');
    cy.saveLocalStorage();
  });

  it("READ workspace data", () => {
    cy.login();

    // Test READ workspace
    cy.findByText('Lufthansa').should('exist');

    cy.get('img').should('have.attr', 'src', 'https://www.vakantie-krant.nl/wp-content/uploads/2014/03/lufthansa-logo.jpg');

    cy.findByTestId('CustomerCard').as('card').should('have.css', 'background-color', 'rgb(190, 227, 248)');

    // TEST READ edit workspace form
    cy.get('@card').click();
    cy.findByText('Settings').as('settings').should('exist').click();

    cy.get('form').findByLabelText(/(Name.)/gi).as('nameField').should('exist');
    cy.get('@nameField').should('have.value', 'Lufthansa');

    cy.get('form').findByLabelText(/URL extension./gi).as('slugField').should('exist');
    cy.get('@slugField').should('have.value', 'lufthansa');

    cy.get('form').get('button').findByText(/Primary/gi).should('exist').click();
    cy.findByTestId('colorPicker').as('colorPicker').should('exist');
    cy.get('@colorPicker').within(() => {
      cy.get('input').should('have.value', '#BEE3F8');
    })

    cy.findByLabelText(/Logo: existing URL/gi).as('logoUrl').should('exist');
    cy.get('@logoUrl').should('have.value', 'https://www.vakantie-krant.nl/wp-content/uploads/2014/03/lufthansa-logo.jpg');
  });
});

describe("Workspace UPDATE logic", () => {
  beforeEach(() => {
    cy.setLocalStorage("access_token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbTc5ejdmaTAwMDAwMW1oZjhwdzl3a3EiLCJleHAiOjE2MTU4NzI4MzgsImlhdCI6MTYxNTYxMzYzOH0.Zuxda8KPUC7Hw12hcvFgDNtO6AxyZZfiyy0fZ5GhUwc');
    cy.saveLocalStorage();
  });

  it('UPDATE workspace data', () => {
    cy.login();

    // Access workspace
    cy.findByTestId('CustomerCard').as('card');
    cy.get('@card').click({ force: true });

    // Enter new data
    cy.findByText('Settings').as('settings').should('exist').click();
    cy.get('form').findByLabelText(/(Name.)/gi).as('nameField').should('exist');
    cy.get('@nameField').clear().type(UPDATE_WORKSPACE_INPUT.workspaceName);

    cy.get('form').get('button').findByText(/Primary/gi).should('exist').click();
    cy.findByTestId('colorPicker').as('colorPicker').should('exist');
    cy.get('@colorPicker').within(() => {
      cy.get('input').clear().type(UPDATE_WORKSPACE_INPUT.primaryColor);
    })

    cy.findByLabelText(/Logo: existing URL/gi).as('logoUrl').should('exist');
    cy.get('@logoUrl').clear().type(UPDATE_WORKSPACE_INPUT.logoUrl);
    cy.get('@logoUrl').should('have.value', UPDATE_WORKSPACE_INPUT.logoUrl);

    cy.window().then((window: any) => {
      // Reference global instances set in "src/mocks.js".
      const { worker, graphql } = window.msw
      worker.use(
        graphql.query('getCustomers', (req: any, res: any, ctx: any) => {
          return res(ctx.data({
              "user": {
                "customers": [
                  {
                    "id": "ckm7af2gj0050yfr5ykrvzyvf",
                    "name": "Starbucks",
                    "slug": "starbucks",
                    "settings": {
                      "logoUrl": UPDATE_WORKSPACE_INPUT.logoUrl,
                      "colourSettings": {
                        "primary": UPDATE_WORKSPACE_INPUT.primaryColor,
                        "secondary": null,
                        "__typename": "ColourSettings"
                      },
                      "__typename": "CustomerSettings"
                    },
                    "dialogues": [],
                    "__typename": "Customer"
                  }
                ],
                "__typename": "UserType"
              }
          }));
        },
        graphql.query('getQuestionnairesOfCustomer', (req, res, ctx) => {
          return res(ctx.data(getQuestionnairesOfCustomer.data));
        }),)
      );
    }).then(() => {
      cy.findByText('Edit').click();
      cy.findByText('DH').click();
      cy.findByText('Switch workspace').click();
      cy.findByText(UPDATE_WORKSPACE_INPUT.workspaceName).should('exist');
      cy.get('img').should('have.attr', 'src', UPDATE_WORKSPACE_INPUT.logoUrl);
      cy.findByTestId('CustomerCard').as('card').should('have.css', 'background-color', 'rgb(220, 20, 60)');
    });
  })
});