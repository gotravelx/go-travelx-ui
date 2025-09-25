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
    expect(screen.getByAltText("thumbnail")).toBeInTheDocument()

  })




})

