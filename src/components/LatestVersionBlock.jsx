import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import PropTypes from 'prop-types';
import LatestVersion from './LatestVersion';

export default function LatestVersionBlock({ owner, repo, group, id }) {
  return (
    <LatestVersion owner={owner} repo={repo}>
      {(v) => {
        const maven = `<dependency>
  <groupId>${group}</groupId>
  <artifactId>${id}</artifactId>
  <version>${v}</version>
</dependency>`;

        const groovy = `implementation '${group}:${id}:${v}'`;
        const kotlin = `implementation("${group}:${id}:${v}")`;

        return (
          <Tabs>
            <TabItem value="maven" label="Maven">
              <CodeBlock language="xml">{maven}</CodeBlock>
            </TabItem>
            <TabItem value="gradle-groovy" label="Gradle (Groovy)">
              <CodeBlock language="groovy">{groovy}</CodeBlock>
            </TabItem>
            <TabItem value="gradle-kotlin" label="Gradle (Kotlin)">
              <CodeBlock language="kotlin">{kotlin}</CodeBlock>
            </TabItem>
          </Tabs>
        );
      }}
    </LatestVersion>
  );
}

LatestVersionBlock.propTypes = {
  owner: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
