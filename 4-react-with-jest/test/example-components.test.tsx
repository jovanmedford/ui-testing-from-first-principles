import { describe, expect, it } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DanishComposersTabs } from "../component/example-components.js"

describe("DanishComposersTabs", () => {
    it("renders the Danish composers tablist", () => {
        render(<DanishComposersTabs />)

        screen.getByRole("tablist", { name: "Danish Composers" })
        expect(screen.getAllByRole("tab")).toHaveLength(4)
    })

    it("identifies Maria Ahlefeldt as the selected tab", () => {
        render(<DanishComposersTabs />)

        screen.getByRole("tab", {
            name: "Maria Ahlefeldt",
            selected: true,
        })
        expect(screen.getAllByRole("tab", { selected: false })).toHaveLength(3)
    })

    it("connects each tab to its panel", () => {
        render(<DanishComposersTabs />)

        const tab = screen.getByRole("tab", { name: "Maria Ahlefeldt" })
        const panel = screen.getByRole("tabpanel", { name: "Maria Ahlefeldt" })

        expect(tab.getAttribute("aria-controls")).toBe(panel.id)
        expect(panel.getAttribute("aria-labelledby")).toBe(tab.id)
    })

    it("selects a tab when it is clicked", async () => {
        const user = userEvent.setup()
        render(<DanishComposersTabs />)

        await user.click(screen.getByRole("tab", { name: "Carl Andersen" }))

        screen.getByRole("tab", {
            name: "Carl Andersen",
            selected: true,
        })
        screen.getByRole("tabpanel", { name: "Carl Andersen" })
        expect(screen.queryByRole("tabpanel", { name: "Maria Ahlefeldt" })).toBeNull()
    })
})
