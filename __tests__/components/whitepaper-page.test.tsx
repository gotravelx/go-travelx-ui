import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import WhitepaperPage from "@/components/whitepaper-page"

describe("WhitepaperPage", () => {
  it("renders hero section with title and buttons", () => {
    render(<WhitepaperPage />)

    expect(
      screen.getByRole("heading", {
        name: /technical documentation & vision/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", { name: /download pdf/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", { name: /try the platform/i })
    ).toBeInTheDocument()
  })

  it("renders table of contents with all sections", () => {
    render(<WhitepaperPage />)

    const tocItems = [
      /introduction/i,
      /technical architecture/i,
      /blockchain integration/i,
      /security & privacy/i,
      /use cases/i,
      /future roadmap/i,
      /conclusion/i,
    ]

    tocItems.forEach((item) => {
      expect(screen.getByRole("link", { name: item })).toBeInTheDocument()
    })
  })

  it("renders introduction and architecture sections", () => {
    render(<WhitepaperPage />)

    expect(
      screen.getByRole("heading", { name: /1\. introduction/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("heading", { name: /2\. technical architecture/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("heading", { name: /3\. blockchain integration/i })
    ).toBeInTheDocument()
  })

  it("includes footer component", () => {
    render(<WhitepaperPage />)

    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
  })
})
