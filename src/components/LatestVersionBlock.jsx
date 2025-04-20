import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import PropTypes from 'prop-types';
import LatestVersion from './LatestVersion';

export default function LatestVersionBlock({ owner, repo, group, id }) {
  const versionProps = { owner, repo };

  return (
    <Tabs>
      <TabItem value="maven" label="Maven">
        <CodeBlock language="xml">
          {`<dependency>
  <groupId>${group}</groupId>
  <artifactId>${id}</artifactId>
  <version><LatestVersion {...versionProps} /></version>
</dependency>`}
        </CodeBlock>
      </TabItem>

      <TabItem value="gradle-groovy" label="Gradle (Groovy)">
        <CodeBlock language="groovy">
          {`implementation '${group}:${id}:<LatestVersion {...versionProps} />'`}
        </CodeBlock>
      </TabItem>

      <TabItem value="gradle-kotlin" label="Gradle (Kotlin)">
        <CodeBlock language="kotlin">
          {`implementation("${group}:${id}:<LatestVersion {...versionProps} />")`}
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
