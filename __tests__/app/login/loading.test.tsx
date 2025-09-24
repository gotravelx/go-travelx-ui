import Loading from "@/app/login/loading";
import { render } from "@testing-library/react";

describe("Loading Component", () => {
  it("renders nothing", () => {
    const { container } = render(<Loading />);
    expect(container).toBeEmptyDOMElement();
  });
});
