import Loading from "@/app/flifo/loading";
import { render } from "@testing-library/react";

describe("Loading Component", () => {
  it("renders nothing", () => {
    const { container } = render(<Loading />);
    expect(container).toBeEmptyDOMElement();
  });
});
