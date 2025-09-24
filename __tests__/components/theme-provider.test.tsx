import { render, screen, waitFor, act, fireEvent } from "@testing-library/react"
import { useTheme } from "next-themes"
import { ThemeProvider } from "@/components/theme-provider"

function TestChild() {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme("dark")}>Dark</button>
    </div>
  )
}

describe("ThemeProvider", () => {
  it("renders children", () => {
    render(
      <ThemeProvider attribute="class">
        <div data-testid="child">Hello</div>
      </ThemeProvider>
    )
    expect(screen.getByTestId("child")).toHaveTextContent("Hello")
  })

  it("provides theme context and updates theme", async () => {
    render(
      <ThemeProvider attribute="class">
        <TestChild />
      </ThemeProvider>
    )

    // initial theme
    expect(screen.getByTestId("theme")).toBeInTheDocument()

    // trigger update inside act
    await act(async () => {
      fireEvent.click(screen.getByText("Dark"))
    })

    // wait for theme update to propagate
    await waitFor(() =>
      expect(screen.getByTestId("theme")).toHaveTextContent("dark")
    )
  })
})
