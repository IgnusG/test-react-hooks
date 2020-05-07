import { act } from "preact/test-utils";
import { unmountComponentAtNode } from 'preact/compat';

const TEST_ID = "__useTests_hook_component";

function getTestNodes(): HTMLElement[] {
  const nodes = Array.from(document.querySelectorAll(`#${TEST_ID}`));
  if (nodes.length > 1) {
    console.error(
      "More than one node found in cleanup, ensure cleanup is called after every test"
    );
  }
  return nodes as HTMLElement[];
}

/**
 * Function to be called after your tests to cleanup the container created
 *
 * @export
 */
export function cleanUp() {
  getTestNodes().forEach(n => {
    unmount(n);
    n.remove();
  });
}

export function unmount(node = getContainer()) {
  act(() => {
    unmountComponentAtNode(node);
  });
}

export function getContainer() {
  let [container] = getTestNodes();
  if (container != null) return container;
  container = document.createElement("div");
  container.id = TEST_ID;
  document.body.appendChild(container);
  return container;
}
