import { HeroVideoDialog, HeroVideoPlayer } from "@/components/hero-video-dialog"
import { render, screen, fireEvent } from "@testing-library/react"

jest.mock("framer-motion", () => {
  const React = require("react")
  return {
    motion: {
      div: React.forwardRef((props: any, ref:any) => <div ref={ref} {...props} />),
      button: React.forwardRef((props: any, ref:any) => <button ref={ref} {...props} />),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  }
})

describe("HeroVideoPlayer", () => {
  it("renders with provided thumbnail", () => {
    render(
      <HeroVideoPlayer
        videoSrc="https://example.com/video"
        thumbnailSrc="https://example.com/thumb.jpg"
        thumbnailAlt="Custom Thumbnail"
      />
    )
    expect(screen.getByAltText("Custom Thumbnail")).toBeInTheDocument()
  })

  it("renders fallback thumbnail if none provided", () => {
    render(<HeroVideoPlayer videoSrc="https://example.com/video" thumbnailSrc="" />)
    expect(screen.getByAltText("Video thumbnail")).toHaveAttribute("src", "/placeholder.svg")
  })

  it("opens video on thumbnail click and closes on backdrop click", () => {
    render(
      <HeroVideoPlayer
        videoSrc="https://example.com/video"
        thumbnailSrc="https://example.com/thumb.jpg"
      />
    )

    fireEvent.click(screen.getByAltText("Video thumbnail"))

    // iframe should be visible (using testId)
    expect(screen.getByTestId("video-iframe")).toBeInTheDocument()

    // Close by clicking backdrop
    fireEvent.click(screen.getByRole("button").parentElement!.parentElement!)
    expect(screen.queryByTestId("video-iframe")).not.toBeInTheDocument()
  })

  it("supports all animation styles without crashing", () => {
    const styles = [
      "from-bottom",
      "from-center",
      "from-top",
      "from-left",
      "from-right",
      "fade",
      "top-in-bottom-out",
      "left-in-right-out",
    ] as const

    styles.forEach((style) => {
      const { container } = render(
        <HeroVideoPlayer
          animationStyle={style}
          videoSrc="https://example.com/video"
          thumbnailSrc="https://example.com/thumb.jpg"
        />
      )
      expect(screen.getAllByAltText("Video thumbnail").length).toBeGreaterThan(0)

      // cleanup between renders
      container.remove()
    })
  })
})

describe("HeroVideoDialog", () => {
  it("renders both light and dark video players", () => {
    render(<HeroVideoDialog />)
    expect(screen.getAllByAltText("Hero Video")).toHaveLength(2)
  })
})
