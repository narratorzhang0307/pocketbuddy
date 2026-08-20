import { useEffect, useState, type CSSProperties } from 'react';
import {
  getAgentWorldPocketBuddyBlueprint,
  getPocketBuddyPortraitUrl,
  type PocketBuddy,
} from '../lib/pocket-buddy';
import AgentWorldPocketBuddyPortrait from './AgentWorldPocketBuddyPortrait';

export default function PocketBuddyPortrait({
  buddy,
  className = '',
  animated = true,
  style,
}: {
  buddy: PocketBuddy;
  className?: string;
  animated?: boolean;
  style?: CSSProperties;
}) {
  const catalogBlueprint = getAgentWorldPocketBuddyBlueprint(
    buddy.visual.catalogId,
  );
  const [url, setUrl] = useState(buddy.visual.thumbnailUrl);

  useEffect(() => {
    let active = true;
    if (catalogBlueprint) {
      setUrl(catalogBlueprint.assetUrl ?? '');
      return () => {
        active = false;
      };
    }
    const id = buddy.visual.portraitBlobId;
    if (!id) {
      setUrl(buddy.visual.thumbnailUrl);
      return () => {
        active = false;
      };
    }
    void getPocketBuddyPortraitUrl(id).then((next) => {
      if (active && next) setUrl(next);
    });
    return () => {
      active = false;
    };
  }, [buddy.visual.portraitBlobId, buddy.visual.thumbnailUrl, catalogBlueprint]);

  if (catalogBlueprint) {
    return (
      <AgentWorldPocketBuddyPortrait
        blueprint={catalogBlueprint}
        className={className}
        animated={animated}
        style={style}
      />
    );
  }
  if (url) {
    return (
      <img
        className={className}
        style={style}
        src={url}
        alt={`${buddy.name}的口袋形象`}
      />
    );
  }
  return (
    <span
      className={`pbf-portrait-fallback ${className}`}
      style={style}
      aria-label={`${buddy.name}的形象占位`}
    >
      {buddy.name.slice(0, 1)}
    </span>
  );
}
