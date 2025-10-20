/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Manual sidebar configuration for explicit ordering
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Imperat',
      link: {
        type: 'doc',
        id: 'Imperat/Introduction',
      },
      items: [
        {
          type: 'category',
          label: 'Basics',
          link: {
            type: 'doc',
            id: 'Imperat/basics/Command Creation',
          },
          items: [
            'Imperat/basics/Command Creation',
            'Imperat/basics/Subcommands',
            'Imperat/basics/Error-Handler',
            'Imperat/basics/Suggestions',
            'Imperat/basics/Parameter-Type',
            'Imperat/basics/Annotations Deep Dive',
            'Imperat/basics/Dependency Injection',
          ],
        },
        {
          type: 'category',
          label: 'Advanced',
          link: {
            type: 'doc',
            id: 'Imperat/advanced/Classic Commands',
          },
          items: [
            'Imperat/advanced/Classic Commands',
            'Imperat/advanced/Context Resolver',
            'Imperat/advanced/Source Resolver',
            'Imperat/advanced/Command Help',
            'Imperat/advanced/Processors',
            'Imperat/advanced/Return Resolvers',
            'Imperat/advanced/Customizing Imperat',
          ],
        },
        {
          type: 'category',
          label: 'Examples',
          link: {
            type: 'doc',
            id: 'Imperat/examples/examples-index',
          },
          items: [
            'Imperat/examples/examples-index',
            'Imperat/examples/GameModeCommand',
            'Imperat/examples/KillCommand',
            'Imperat/examples/Ranks',
          ],
        },
        {
          type: 'category',
          label: 'Extra',
          link: {
            type: 'doc',
            id: 'Imperat/extra/CommandTree',
          },
          items: [
            'Imperat/extra/CommandTree',
          ],
        }
      ],
    },

    {
      type: 'category',
      label: 'Scofi',
      link: {
        type: 'doc',
        id: 'Scofi/Introduction',
      },
      items: [
        'Scofi/Animations'
      ],
    },

    {
      type: 'category',
      label: 'Synapse',
      link: {
        type: 'doc',
        id: 'Synapse/Introduction',
      },
      items: [
        'Synapse/Translation',
        'Synapse/Creating-Neurons',
        {
          type: 'category',
          label: 'Placeholders',
          items: [
            'Synapse/Placeholders/Static-Placeholders',
            'Synapse/Placeholders/Contextual-Placeholders',
            'Synapse/Placeholders/Relational-Placeholders',
          ],
        },
        'Synapse/Examples',
        'Synapse/Troubleshooting',
      ],
    }
  ],
};

export default sidebars;
