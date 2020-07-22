describe('Creating a customer', () => {
  it('Visits the dashboard page', () => {
    expect(true).to.equal(true);
    cy.visit('localhost:3002');

    // Find something to add
    cy.get('a[href*="add"]').click();

    // Register form and submit
    const form = cy.get('form');
    form.within(() => {
      cy.get('input[name="name"]').type('Starbucks');
      cy.get('input[name="logo"]').type('https://www.vanatotzekerheid.nl/wp-content/uploads/2016/09/Starbucks-Logo-051711-600x566.gif');
      cy.get('input[name="slug"]').type('starbucks');
      cy.get('input[name="primaryColour"]').type('#ffffff');
    });

    cy.get('form').submit();
  });
});
