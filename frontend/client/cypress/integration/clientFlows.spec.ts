describe('Client traverses the various flows', () => {
  it('Client traverses a neutral flow well', () => {
    cy.visit('http://localhost:3000');

    // TODO: Consider how we can always test a customer with a standard flow. Maybe a Before?

    // Click the select and select first to start the dialogue
    cy.get('[class*="-control"]')
      .eq(0)
      .click(0, 0, { force: true })
      .get('[class*="-menu"]')
      .find('[class*="-option"]')
      .eq(0)
      .click(0, 0, { force: true });

    // Check we have a dialogue with this start (naive assumption)
    cy.contains('How do you feel about');

    // TODO: Figure out how to make bunny move
    cy.get('[name="slider"]')
      .invoke('val', 60.2)
      .trigger('change', { force: true })
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', { clientX: 100, force: true })
      .trigger('mouseup', { force: true });

    // Assertion of the path taken
    cy.contains('What would you like');
    cy.contains('Facilities').click();
    cy.contains('Other').click();
    cy.contains('Do not').click();

    // Assertion that it is over
    cy.contains('Thank you');
    cy.wait(5000);
  });

  it('Client traverses a positive flow well', () => {
    cy.visit('http://localhost:3000');

    // TODO: Consider how we can always test a customer with a standard flow. Maybe a Before?

    // Click the select and select first to start the dialogue
    cy.get('[class*="-control"]')
      .eq(0)
      .click(0, 0, { force: true })
      .get('[class*="-menu"]')
      .find('[class*="-option"]')
      .eq(0)
      .click(0, 0, { force: true });

    // Check we have a dialogue with this start (naive assumption)
    cy.contains('How do you feel about');

    // TODO: Figure out how to make bunny move
    cy.get('[name="slider"]')
      .invoke('val', 81)
      .trigger('change', { force: true })
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', { clientX: 100, force: true })
      .trigger('mouseup', { force: true });

    // Assertion of the path taken
    cy.contains('What did you like');
    cy.contains('Product').click();
    cy.contains('Price').click();

    // Call to action should have social media
    cy.get('[href="https://facebook.com"]');
  });

  it('Client traverses a negative flow well', () => {
    cy.visit('http://localhost:3000');

    // TODO: Consider how we can always test a customer with a standard flow. Maybe a Before?

    // Click the select and select first to start the dialogue
    cy.get('[class*="-control"]')
      .eq(0)
      .click(0, 0, { force: true })
      .get('[class*="-menu"]')
      .find('[class*="-option"]')
      .eq(0)
      .click(0, 0, { force: true });

    // Check we have a dialogue with this start (naive assumption)
    cy.contains('How do you feel about');

    // TODO: Figure out how to make bunny move
    cy.get('[name="slider"]')
      .invoke('val', 21)
      .trigger('change', { force: true })
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', { clientX: 100, force: true })
      .trigger('mouseup', { force: true });

    // Assertion of the path taken
    cy.contains('We are sorry');
    cy.contains('Product').click();
    cy.contains('Price').click();
    cy.contains('Do not').click();

    // Call to action should have social media
    cy.contains('Thank you');
  });
});
