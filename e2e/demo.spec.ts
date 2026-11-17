import { expect, test } from "@playwright/test";

// Démo du cas passant, de bout en bout. Chaque itération ajoute ses étapes (test.step).
test("Démo : le cas passant", async ({ page }) => {
  await test.step("J'ouvre l'application", async () => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  await test.step("Je vois la situation de la famille Martin", async () => {
    await expect(page.getByRole("heading", { name: "Famille Martin" })).toBeVisible();
    await expect(page.getByText("Capturer ce que j'entends")).toBeVisible();
  });

  await test.step("Je capture une note pendant l'intervention", async () => {
    await page.getByText("Capturer ce que j'entends").click();
    await page.getByPlaceholder("Ce que j'entends pendant l'intervention…").fill("Léa semble sereine");
    await page.getByRole("button", { name: "Enregistrer la note" }).click();
    await expect(page.getByText("Léa semble sereine")).toBeVisible();
  });

  await test.step("Je vois le rapport pré-rédigé puis je l'envoie au magistrat", async () => {
    await page.getByText("Rédiger le rapport d'intervention").click();
    await expect(page.getByText("Rédigé par l'assistant")).toBeVisible();
    await expect(page.getByText("Léa semble sereine")).toBeVisible();
    await page.getByRole("button", { name: "Envoyer au magistrat" }).click();
    await expect(page.getByText("Envoyé au magistrat")).toBeVisible();
  });
});
