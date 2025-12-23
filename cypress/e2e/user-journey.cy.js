describe('DevProfile Hub - Complete User Journey', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', '**/api/users/profile/**', { fixture: 'user-profile.json' }).as('getProfile');
    cy.intercept('GET', '**/api/users/stats/github**', { fixture: 'github-stats.json' }).as('getGitHubStats');
    cy.intercept('GET', '**/api/users/stats/leetcode**', { fixture: 'leetcode-stats.json' }).as('getLeetCodeStats');
    cy.intercept('POST', '**/api/users/profile', { statusCode: 200, body: { success: true } }).as('saveProfile');
  });

  it('should complete full user registration and profile setup', () => {
    // Visit the app
    cy.visit('/');
    
    // Should show login page initially
    cy.get('[data-testid="login-component"]').should('be.visible');
    
    // Mock successful authentication
    cy.window().then((win) => {
      // Simulate Firebase auth state change
      win.firebase = {
        auth: {
          currentUser: { uid: 'test-uid', email: 'test@example.com' }
        }
      };
    });

    // Should show platform form for new user
    cy.get('[data-testid="platform-form"]').should('be.visible');
    
    // Fill out the form
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="username"]').type('johndoe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('input[name="contact"]').type('1234567890');
    cy.get('input[name="address"]').type('123 Main St');
    cy.get('input[name="linkedin"]').type('https://linkedin.com/in/johndoe');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Should show dashboard after successful registration
    cy.get('[data-testid="dashboard-component"]').should('be.visible');
    cy.contains('John Doe').should('be.visible');
  });

  it('should display GitHub and LeetCode stats correctly', () => {
    // Mock authenticated user with profile
    cy.visit('/');
    
    // Wait for dashboard to load
    cy.get('[data-testid="dashboard-component"]').should('be.visible');
    
    // Check GitHub stats
    cy.contains('GitHub').should('be.visible');
    cy.contains('Repositories').should('be.visible');
    cy.contains('Followers').should('be.visible');
    
    // Check LeetCode stats
    cy.contains('LeetCode').should('be.visible');
    cy.contains('Problems Solved').should('be.visible');
    
    // Check heatmaps are rendered
    cy.get('[data-testid="github-heatmap"]').should('be.visible');
    cy.get('[data-testid="leetcode-heatmap"]').should('be.visible');
  });

  it('should handle profile editing', () => {
    cy.visit('/');
    
    // Click on user menu
    cy.get('button').contains('☰').click();
    
    // Click on "Your Account"
    cy.contains('Your Account').click();
    
    // Should show edit profile form
    cy.contains('Your Account').should('be.visible');
    cy.get('input[name="firstName"]').should('have.value', 'John');
    
    // Update profile
    cy.get('input[name="firstName"]').clear().type('Jane');
    cy.get('button[type="submit"]').click();
    
    // Should show success message
    cy.contains('Account updated successfully').should('be.visible');
  });

  it('should handle dark mode toggle', () => {
    cy.visit('/');
    
    // Toggle dark mode
    cy.get('button[aria-label="Toggle dark mode"]').click();
    
    // Check if dark mode is applied
    cy.get('body').should('have.class', 'dark');
    
    // Toggle back to light mode
    cy.get('button[aria-label="Toggle dark mode"]').click();
    cy.get('body').should('not.have.class', 'dark');
  });

  it('should handle responsive design', () => {
    // Test mobile viewport
    cy.viewport(375, 667);
    cy.visit('/');
    
    // Check if mobile layout is applied
    cy.get('[data-testid="dashboard-component"]').should('be.visible');
    
    // Test tablet viewport
    cy.viewport(768, 1024);
    cy.reload();
    
    // Check if tablet layout is applied
    cy.get('[data-testid="dashboard-component"]').should('be.visible');
  });
});
