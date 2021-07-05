import {INITIAL_VIEWPORTS} from "@storybook/addon-viewport"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS
  }
}

const withStore = () => StoryComponent => {
  return (
      <div>
        <div>Hello world</div>
        <StoryComponent />
      </div>
  )
}

export const decorators = [withStore()];
