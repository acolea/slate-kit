import Register from "@vericus/slate-kit-utils-register-helpers";
import AutoReplace from "@vericus/slate-kit-utils-auto-replace";
import createProps from "./props";
import Options, { TypeOptions } from "./options";
import createQueries from "./queries";
import createCommands from "./commands";
import createOnKeyDown from "./onKeyDown";
import createSchema from "./schemas";
import createRule from "./rules";

export function createPlugin(pluginOptions: Partial<TypeOptions> = {}) {
  const options = new Options(pluginOptions);
  const { blockTypes, renderer } = options;
  const { orderedlist, unorderedlist, checklist } = blockTypes;
  const queries = createQueries(options);
  const commands = createCommands(options);
  const schema = createSchema(options);
  const props = createProps(options);
  const onKeyDown = createOnKeyDown(options);

  let plugins: any[] = [
    Register({ nodes: blockTypes, props, createRule, options }),
    {
      queries,
      commands,
      onKeyDown: options.withHandlers ? onKeyDown : undefined,
      schema
    },
    ...(options.withHandlers
      ? [
          AutoReplace({
            trigger: " ",
            before: /^(\d+\.)$/,
            command: (editor, matches, next) => {
              if (
                matches &&
                matches.beforeMatches &&
                matches.beforeMatches[0]
              ) {
                const numMatch = matches.beforeMatches[0].match(/(^\d+)/);
                if (numMatch && numMatch[0]) {
                  editor.createListWithType(orderedlist, numMatch[0]);
                }
                return;
              }
              return next();
            }
          }),
          AutoReplace({
            trigger: " ",
            before: /^(-)$/,
            command: (editor, matches, next) =>
              editor.createListWithType(unorderedlist)
          }),
          AutoReplace({
            trigger: " ",
            before: /^(\[\])$/,
            command: (editor, matches, next) =>
              editor.createListWithType(checklist)
          })
        ]
      : [])
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

export default createPlugin;
