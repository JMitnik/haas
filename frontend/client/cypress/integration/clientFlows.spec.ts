describe('Client traverses the various flows', () => {
  it('Client traverses a neutral flow well', () => {
    cy.visit('http://localhost:3000/test/test');

    // Click the select and select first to start the dialogue
    cy.get('[name="slider"]')
      .invoke('val', 60.2)
      .trigger('change', { force: true })
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', { clientX: 100, force: true })
      .trigger('mouseup', { force: true });
  });
});
