/// <reference types="cypress" />

describe("Sign up to mypaymash", () => {
  before(() => {
    cy.request("https://api.namefake.com/").then((response) => {
      const body = JSON.parse(response.body);
      const pattern = /\b(?:Prof\.? *|Dr\. *|Mr\. *|Mrs\. *|Ms\. *|Miss *|, Phd| Sr.| Jr.)\b/g; //remove titles
      body.firstName = body.name.replace(pattern, '').split(' ')[0].trim();
      body.lastName = body.name.replace(pattern, '').replace(body.firstName, '').trim();
      body.phone_w = body.phone_w.slice(0, body.phone_w.length - 1); //data doesn't fit for happy path
      cy.writeFile("cypress/fixtures/profile.json", body);
    });
  });

  beforeEach(() => {
    cy.visit("https://app.test.mypaymash.com/signup");
  });

  it("Positive scenario where user is able to register to the application", () => {
    cy.fixture("profile.json").then((profile) => {
      cy.get('input[name="company"]').type(profile.company);
      cy.get('input[name="firstName"]').type(profile.firstName);
      cy.get('input[name="lastName"]').type(profile.lastName);
      cy.get('input[name="email"]').type(
        profile.email_u + "@" + profile.email_d
      );
      cy.get('input[name="password"]').type(profile.password);
      cy.get('input[name="phone"]').type(profile.phone_w);
      cy.get("select").select("United States of America");
      cy.get('input[name="terms"]').check({ force: true });
      cy.get('button[type="submit"]').click();
    });
    cy.url().should("include", "/dashboard");
  });
  it("Negative scenario where user types invalid email and we see notification", () => {
    cy.fixture("profile.json").then((profile) => {
      cy.get('input[name="company"]').type(profile.company);
      cy.get('input[name="firstName"]').type(profile.firstName);
      cy.get('input[name="lastName"]').type(profile.lastName);
      cy.get('input[name="email"]').type(profile.email_u);
      cy.get('input[name="password"]').type(profile.password);
      cy.get('input[name="phone"]').type(profile.phone_w);
      cy.get("select").select("United States of America");
      cy.get('input[name="terms"]').check({ force: true });
      cy.get('button[type="submit"]').click();
    });
    cy.get('[ng-class="getCssClasses(signupForm.email, signupForm)"]').should(
      'have.class', 'has-error'
    );
    cy.get('.has-error>span').should('contain', 'Email is required')
  });
});