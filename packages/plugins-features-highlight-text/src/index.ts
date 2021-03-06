import Register from "@vericus/slate-kit-utils-register-helpers";
import Options, { TypeOptions } from "./options";
import createProps from "./props";
import createCommands from "./commands";
import createQueries from "./queries";

export default function createPlugin(pluginOptions: Partial<TypeOptions> = {}) {
  const options = Options.create(pluginOptions);
  const { marks, renderer } = options;
  const commands = createCommands(options);
  const queries = createQueries(options);
  const props = createProps(options);

  let plugins: any = [
    Register({
      options,
      marks,
      props
    }),
    {
      commands,
      queries
    }
  ];
  if (renderer) {
    const rendererPlugins = renderer(options);
    if (Array.isArray(rendererPlugins)) {
      plugins = [...plugins, ...rendererPlugins];
    } else {
      plugins = [...plugins, rendererPlugins];
    }
  }

  return plugins;
}
