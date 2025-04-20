import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import PropTypes from 'prop-types';
import LatestVersion from './LatestVersion';

export default function LatestVersionBlock({ owner, repo, group, id }) {
  return (
    <Tabs>
      <TabItem value="maven" label="Maven">
        <CodeBlock language="xml">
          {[
            `<dependency>\n`,
            `  <groupId>${group}</groupId>\n`,
            `  <artifactId>${id}</artifactId>\n`,
            `  <version>`,
            <LatestVersion key="maven-version" owner={owner} repo={repo} />,
            `</version>\n`,
            `</dependency>`
          ]}
        </CodeBlock>
      </TabItem>

      <TabItem value="gradle-groovy" label="Gradle (Groovy)">
        <CodeBlock language="groovy">
          {[
            `implementation '`,
            `${group}:${id}:`,
            <LatestVersion key="groovy-version" owner={owner} repo={repo} />,
            `'`
          ]}
        </CodeBlock>
      </TabItem>

      <TabItem value="gradle-kotlin" label="Gradle (Kotlin)">
        <CodeBlock language="kotlin">
          {[
            `implementation("`,
            `${group}:${id}:`,
            <LatestVersion key="kotlin-version" owner={owner} repo={repo} />,
            `")`
          ]}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
}

LatestVersionBlock.propTypes = {
  owner: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
