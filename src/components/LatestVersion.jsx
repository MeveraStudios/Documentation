import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function LatestVersion({ owner, repo, stripV = true, codeBlock = false, children }) {
  const [version, setVersion] = useState('loading...');
  const cacheKey = `${owner}/${repo}-version`;

  useEffect(() => {
    const cachedVersion = sessionStorage.getItem(cacheKey);
    if (cachedVersion) {
      setVersion(cachedVersion);
    } else {
      const url = `https://api.github.com/repos/${owner}/${repo}/tags`;

      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error('API error');
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            let tag = data[0].name;
            if (stripV && tag.startsWith('v')) {
              tag = tag.slice(1);
            }
            setVersion(tag);
            sessionStorage.setItem(cacheKey, tag);
          } else {
            setVersion('unknown');
          }
        })
        .catch(() => setVersion('error'));
    }
  }, [owner, repo, stripV]);

  if (typeof children === 'function') {
    return children(version);
  }

  return codeBlock ? <code>{version}</code> : version;
}

LatestVersion.propTypes = {
  owner: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  stripV: PropTypes.bool,
  codeBlock: PropTypes.bool,
  children: PropTypes.func,
};
