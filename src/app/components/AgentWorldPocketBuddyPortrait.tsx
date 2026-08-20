import type { CSSProperties } from 'react';
import type { AgentWorldPocketBuddyBlueprint } from '../lib/pocket-buddy';
import ProgressiveImage from './ProgressiveImage';

type AgentShapeProps = {
  accent: string;
  animated: boolean;
  scale: number;
};

const motionClass = (animated: boolean, motion: 'idle' | 'float' | 'bounce' | 'hop') =>
  animated ? `pbf-agent-art--${motion}` : undefined;

function MugAgent({ accent, animated, scale: s }: AgentShapeProps) {
  return (
    <g className={motionClass(animated, 'idle')}>
      <rect x={-9*s} y={-17*s} width={18*s} height={21*s} rx={3*s} fill={accent} stroke="#1C1911" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d={`M${9*s},${-9*s} Q${16*s},${-9*s} ${16*s},${-3*s} Q${16*s},${3*s} ${9*s},${3*s}`} fill="none" stroke="#1C1911" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx={-3.5*s} cy={-9*s} r={2.8*s} fill="white" stroke="#1C1911" strokeWidth="0.8"/>
      <circle cx={3.5*s} cy={-9*s} r={2.8*s} fill="white" stroke="#1C1911" strokeWidth="0.8"/>
      <circle cx={-3*s} cy={-9*s} r={1.3*s} fill="#1C1911"/>
      <circle cx={4*s} cy={-9*s} r={1.3*s} fill="#1C1911"/>
      <circle cx={-2.2*s} cy={-9.8*s} r={0.55*s} fill="white"/>
      <circle cx={4.8*s} cy={-9.8*s} r={0.55*s} fill="white"/>
      <path d={`M${-3*s},${-3*s} Q0,0 ${3*s},${-3*s}`} fill="none" stroke="#1C1911" strokeWidth="1" strokeLinecap="round"/>
      <line x1={-5*s} y1={4*s} x2={-6*s} y2={9*s} stroke="#1C1911" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1={5*s} y1={4*s} x2={6*s} y2={9*s} stroke="#1C1911" strokeWidth="1.8" strokeLinecap="round"/>
      <ellipse cx={-6*s} cy={10*s} rx={3.5*s} ry={1.8*s} fill="#1C1911"/>
      <ellipse cx={6*s} cy={10*s} rx={3.5*s} ry={1.8*s} fill="#1C1911"/>
      <path d={`M${-3*s},${-19*s} Q${-1*s},${-23*s} ${-3*s},${-27*s}`} fill="none" stroke="#1C191160" strokeWidth="1" strokeLinecap="round"/>
      <path d={`M${2*s},${-19*s} Q${4*s},${-23*s} ${2*s},${-27*s}`} fill="none" stroke="#1C191160" strokeWidth="1" strokeLinecap="round"/>
    </g>
  );
}

function CameraAgent({ accent, animated, scale: s }: AgentShapeProps) {
  return (
    <g className={motionClass(animated, 'idle')}>
      <rect x={-12*s} y={-13*s} width={24*s} height={18*s} rx={2.5*s} fill={accent} stroke="#1C1911" strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x={-4*s} y={-18*s} width={9*s} height={6*s} rx={1.5*s} fill={accent} stroke="#1C1911" strokeWidth="1.2"/>
      <circle cx="0" cy={-5*s} r={7*s} fill="#D8E8F0" stroke="#1C1911" strokeWidth="1.5"/>
      <circle cx="0" cy={-5*s} r={4.5*s} fill="#1A2A3A" stroke="#1C1911" strokeWidth="1"/>
      <circle cx="0" cy={-5*s} r={2.2*s} fill="#0A0A18"/>
      <circle cx={1.8*s} cy={-7*s} r={1.2*s} fill="white"/>
      <path d={`M${-12*s},${-7*s} Q${-19*s},${-5*s} ${-17*s},${2*s}`} fill="none" stroke="#1C1911" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1={12*s} y1={-6*s} x2={18*s} y2={-2*s} stroke="#1C1911" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1={-5*s} y1={5*s} x2={-6*s} y2={10*s} stroke="#1C1911" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1={5*s} y1={5*s} x2={6*s} y2={10*s} stroke="#1C1911" strokeWidth="1.8" strokeLinecap="round"/>
      <ellipse cx={-6*s} cy={11*s} rx={3.5*s} ry={1.8*s} fill="#1C1911"/>
      <ellipse cx={6*s} cy={11*s} rx={3.5*s} ry={1.8*s} fill="#1C1911"/>
      <circle cx={8*s} cy={-11*s} r={1.5*s} fill="#FFF8D0" stroke="#1C1911" strokeWidth="0.7"/>
    </g>
  );
}

function BookAgent({ accent, animated, scale: s }: AgentShapeProps) {
  return (
    <g className={motionClass(animated, 'float')}>
      <rect x={-8*s} y={-20*s} width={16*s} height={24*s} rx={1.5*s} fill={accent} stroke="#1C1911" strokeWidth="1.5"/>
      <line x1={-8*s} y1={-20*s} x2={-8*s} y2={4*s} stroke="#1C191140" strokeWidth="1"/>
      {[-14,-10,-6,-2].map((dy) => <line key={dy} x1={-5*s} y1={dy*s} x2={6*s} y2={dy*s} stroke="#1C191130" strokeWidth="0.7"/>)}
      <circle cx={-2.5*s} cy={-2*s} r={3*s} fill="white" stroke="#1C1911" strokeWidth="0.8"/>
      <circle cx={3.5*s} cy={-2*s} r={3*s} fill="white" stroke="#1C1911" strokeWidth="0.8"/>
      <circle cx={-2*s} cy={-2*s} r={1.4*s} fill="#1C1911"/>
      <circle cx={4*s} cy={-2*s} r={1.4*s} fill="#1C1911"/>
      <circle cx={-1.2*s} cy={-2.8*s} r={0.55*s} fill="white"/>
      <circle cx={4.8*s} cy={-2.8*s} r={0.55*s} fill="white"/>
      <path d={`M${8*s},${-14*s} Q${17*s},${-16*s} ${19*s},${-9*s}`} fill="none" stroke="#1C1911" strokeWidth="1.5" strokeLinecap="round"/>
      <path d={`M${-8*s},${-14*s} Q${-17*s},${-16*s} ${-19*s},${-9*s}`} fill="none" stroke="#1C1911" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1={-4*s} y1={4*s} x2={-5*s} y2={9*s} stroke="#1C1911" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1={4*s} y1={4*s} x2={5*s} y2={9*s} stroke="#1C1911" strokeWidth="1.8" strokeLinecap="round"/>
      <ellipse cx={-5*s} cy={10*s} rx={3.2*s} ry={1.7*s} fill="#1C1911"/>
      <ellipse cx={5*s} cy={10*s} rx={3.2*s} ry={1.7*s} fill="#1C1911"/>
    </g>
  );
}

function PlushAgent({ accent, animated, scale: s }: AgentShapeProps) {
  return (
    <g className={motionClass(animated, 'bounce')}>
      <ellipse cx="0" cy={-5*s} rx={12*s} ry={13*s} fill={accent} stroke="#1C1911" strokeWidth="1.5"/>
      <circle cx={-9*s} cy={-16*s} r={5.5*s} fill={accent} stroke="#1C1911" strokeWidth="1.2"/>
      <circle cx={9*s} cy={-16*s} r={5.5*s} fill={accent} stroke="#1C1911" strokeWidth="1.2"/>
      <circle cx={-9*s} cy={-16*s} r={2.8*s} fill="#E8A8D8"/>
      <circle cx={9*s} cy={-16*s} r={2.8*s} fill="#E8A8D8"/>
      <circle cx={-4.5*s} cy={-7*s} r={4.5*s} fill="white" stroke="#1C1911" strokeWidth="1"/>
      <circle cx={4.5*s} cy={-7*s} r={4.5*s} fill="white" stroke="#1C1911" strokeWidth="1"/>
      <circle cx={-4*s} cy={-7*s} r={2.5*s} fill="#1C1911"/>
      <circle cx={5*s} cy={-7*s} r={2.5*s} fill="#1C1911"/>
      <circle cx={-3*s} cy={-8*s} r={1*s} fill="white"/>
      <circle cx={6*s} cy={-8*s} r={1*s} fill="white"/>
      <ellipse cx="0" cy={-2*s} rx={1.8*s} ry={1.2*s} fill="#1C1911"/>
      <path d={`M${-2.5*s},0 Q0,${3*s} ${2.5*s},0`} fill="none" stroke="#1C1911" strokeWidth="1" strokeLinecap="round"/>
      <ellipse cx={-14*s} cy={-3*s} rx={4.5*s} ry={3*s} fill={accent} stroke="#1C1911" strokeWidth="1.2" transform={`rotate(-15,${-14*s},${-3*s})`}/>
      <ellipse cx={14*s} cy={-3*s} rx={4.5*s} ry={3*s} fill={accent} stroke="#1C1911" strokeWidth="1.2" transform={`rotate(15,${14*s},${-3*s})`}/>
      <ellipse cx={-6*s} cy={7*s} rx={6*s} ry={4*s} fill={accent} stroke="#1C1911" strokeWidth="1.2"/>
      <ellipse cx={6*s} cy={7*s} rx={6*s} ry={4*s} fill={accent} stroke="#1C1911" strokeWidth="1.2"/>
    </g>
  );
}

function LampAgent({ accent, animated, scale: s }: AgentShapeProps) {
  return (
    <g className={motionClass(animated, 'idle')}>
      <ellipse cx="0" cy={9*s} rx={7*s} ry={2.5*s} fill="#8B7040" stroke="#1C1911" strokeWidth="1.2"/>
      <line x1={-2*s} y1={9*s} x2={-3*s} y2={-12*s} stroke="#1C1911" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1={2*s} y1={9*s} x2={3*s} y2={-12*s} stroke="#1C1911" strokeWidth="2.5" strokeLinecap="round"/>
      <path d={`M${-13*s},${-12*s} Q${-11*s},${-22*s} 0,${-24*s} Q${11*s},${-22*s} ${13*s},${-12*s} Z`} fill={accent} stroke="#1C1911" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d={`M${-13*s},${-12*s} Q0,${-9*s} ${13*s},${-12*s}`} fill="none" stroke="#1C1911" strokeWidth="1"/>
      <ellipse cx="0" cy={-9*s} rx={9*s} ry={6*s} fill="#FFF8D030"/>
      <circle cx="0" cy={-13*s} r={4.5*s} fill="#FFF8D0" stroke="#1C1911" strokeWidth="1"/>
      <circle cx="0" cy={-13*s} r={2*s} fill={accent}/>
      <circle cx={0.8*s} cy={-13.8*s} r={0.7*s} fill="white"/>
      <path d={`M${-3*s},${-12*s} Q${-11*s},${-9*s} ${-14*s},${-4*s}`} fill="none" stroke="#1C1911" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  );
}

function HeadphonesAgent({ accent, animated, scale: s }: AgentShapeProps) {
  return (
    <g className={motionClass(animated, 'hop')}>
      <path d={`M${-12*s},${-1*s} Q${-12*s},${-22*s} 0,${-24*s} Q${12*s},${-22*s} ${12*s},${-1*s}`} fill="none" stroke="#1C1911" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx={-13*s} cy={-1*s} r={7.5*s} fill="#2A2A3A" stroke="#1C1911" strokeWidth="1.5"/>
      <circle cx={-13*s} cy={-1*s} r={4.5*s} fill={accent} stroke="#1C1911" strokeWidth="1"/>
      <circle cx={13*s} cy={-1*s} r={7.5*s} fill="#2A2A3A" stroke="#1C1911" strokeWidth="1.5"/>
      <circle cx={13*s} cy={-1*s} r={4.5*s} fill={accent} stroke="#1C1911" strokeWidth="1"/>
      <circle cx={-13*s} cy={-1*s} r={2.2*s} fill="white"/>
      <circle cx={-12.3*s} cy={-1.7*s} r={1.1*s} fill="#1C1911"/>
      <circle cx={13*s} cy={-1*s} r={2.2*s} fill="white"/>
      <circle cx={13.7*s} cy={-1.7*s} r={1.1*s} fill="#1C1911"/>
      <rect x={-16*s} y={6*s} width={7*s} height={3*s} rx={1.5*s} fill="#1C1911"/>
      <rect x={9*s} y={6*s} width={7*s} height={3*s} rx={1.5*s} fill="#1C1911"/>
      <text x={-20*s} y={-14*s} fontSize={7*s} fill="#6B9E7A" fontFamily="serif">♪</text>
      <text x={14*s} y={-12*s} fontSize={5*s} fill={accent} fontFamily="serif">♫</text>
    </g>
  );
}

type CurioKind = 'plant' | 'clock' | 'key' | 'globe' | 'controller' | 'umbrella';

function CurioAgent({ accent, animated, scale: s, kind }: AgentShapeProps & { kind: CurioKind }) {
  const motion = kind === 'globe' ? 'float' : kind === 'controller' ? 'hop' : 'idle';
  const eyes = (eyeY: number, gap = 4) => (
    <>
      <circle cx={-gap*s} cy={eyeY*s} r={2.5*s} fill="white" stroke="#1C1911" strokeWidth="0.8"/>
      <circle cx={gap*s} cy={eyeY*s} r={2.5*s} fill="white" stroke="#1C1911" strokeWidth="0.8"/>
      <circle cx={(-gap+0.5)*s} cy={eyeY*s} r={1.15*s} fill="#1C1911"/>
      <circle cx={(gap+0.5)*s} cy={eyeY*s} r={1.15*s} fill="#1C1911"/>
    </>
  );
  const feet = (footY = 10, gap = 6) => (
    <>
      <line x1={-gap*s} y1={(footY-5)*s} x2={-gap*s} y2={footY*s} stroke="#1C1911" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1={gap*s} y1={(footY-5)*s} x2={gap*s} y2={footY*s} stroke="#1C1911" strokeWidth="1.6" strokeLinecap="round"/>
      <ellipse cx={-gap*s} cy={(footY+1)*s} rx={3.4*s} ry={1.7*s} fill="#1C1911"/>
      <ellipse cx={gap*s} cy={(footY+1)*s} rx={3.4*s} ry={1.7*s} fill="#1C1911"/>
    </>
  );
  return (
    <g className={motionClass(animated, motion)}>
      {kind === 'plant' && <>
        <path d={`M0,${-14*s} Q${-13*s},${-28*s} ${-15*s},${-12*s} Q${-6*s},${-7*s} 0,${-12*s}`} fill="#8FCB72" stroke="#1C1911" strokeWidth="1.3"/>
        <path d={`M0,${-14*s} Q${13*s},${-29*s} ${15*s},${-12*s} Q${7*s},${-7*s} 0,${-12*s}`} fill="#6B9E7A" stroke="#1C1911" strokeWidth="1.3"/>
        <path d={`M0,${-14*s} Q0,${-31*s} ${7*s},${-30*s} Q${10*s},${-18*s} 0,${-14*s}`} fill="#B8D4A0" stroke="#1C1911" strokeWidth="1.3"/>
        <path d={`M${-11*s},${-10*s} L${11*s},${-10*s} L${8*s},${7*s} L${-8*s},${7*s} Z`} fill={accent} stroke="#1C1911" strokeWidth="1.5" strokeLinejoin="round"/>
        {eyes(-4, 3.8)}<path d={`M${-2*s},${1*s} Q0,${3*s} ${2*s},${1*s}`} fill="none" stroke="#1C1911" strokeWidth="0.9"/>{feet(12, 5)}
      </>}
      {kind === 'clock' && <>
        <path d={`M${-12*s},${-19*s} Q${-17*s},${-27*s} ${-22*s},${-18*s}`} fill={accent} stroke="#1C1911" strokeWidth="1.4"/>
        <path d={`M${12*s},${-19*s} Q${17*s},${-27*s} ${22*s},${-18*s}`} fill={accent} stroke="#1C1911" strokeWidth="1.4"/>
        <line x1="0" y1={-25*s} x2="0" y2={-29*s} stroke="#1C1911" strokeWidth="1.4"/><circle cx="0" cy={-9*s} r={16*s} fill={accent} stroke="#1C1911" strokeWidth="1.6"/><circle cx="0" cy={-9*s} r={12*s} fill="#FFF8E8" stroke="#1C1911" strokeWidth="1"/>
        {eyes(-8, 4)}<line x1="0" y1={-9*s} x2="0" y2={-17*s} stroke="#1C1911" strokeWidth="1.2"/><line x1="0" y1={-9*s} x2={6*s} y2={-5*s} stroke="#1C1911" strokeWidth="1.2"/>{feet(12, 7)}
      </>}
      {kind === 'key' && <>
        <circle cx={-6*s} cy={-12*s} r={11*s} fill={accent} stroke="#1C1911" strokeWidth="1.6"/><circle cx={-6*s} cy={-12*s} r={5*s} fill="#FFF8E8" stroke="#1C1911" strokeWidth="1"/>
        <rect x={3*s} y={-15*s} width={19*s} height={6*s} rx={2*s} fill={accent} stroke="#1C1911" strokeWidth="1.5"/><path d={`M${15*s},${-9*s} V${-3*s} H${21*s} V${-9*s}`} fill={accent} stroke="#1C1911" strokeWidth="1.5" strokeLinejoin="round"/>
        {eyes(-12, 3.3)}<path d={`M${-9*s},${-6*s} Q${-6*s},${-3*s} ${-3*s},${-6*s}`} fill="none" stroke="#1C1911" strokeWidth="0.9"/>{feet(7, 5)}
      </>}
      {kind === 'globe' && <>
        <circle cx="0" cy={-10*s} r={16*s} fill="#DDF4FA" stroke="#1C1911" strokeWidth="1.6"/><path d={`M${-13*s},${-5*s} Q0,${3*s} ${13*s},${-5*s}`} fill="#A8D8E8" opacity="0.9"/>
        <circle cx={-7*s} cy={-16*s} r={2*s} fill="white"/><circle cx={7*s} cy={-20*s} r={1.5*s} fill="white"/><path d={`M0,${-23*s} L${2*s},${-18*s} L${7*s},${-18*s} L${3*s},${-15*s} L${5*s},${-10*s} L0,${-13*s} L${-5*s},${-10*s} L${-3*s},${-15*s} L${-7*s},${-18*s} L${-2*s},${-18*s} Z`} fill={accent} opacity="0.8"/>
        {eyes(-7, 4)}<rect x={-13*s} y={5*s} width={26*s} height={7*s} rx={2*s} fill={accent} stroke="#1C1911" strokeWidth="1.4"/>{feet(17, 6)}
      </>}
      {kind === 'controller' && <>
        <path d={`M${-19*s},${-10*s} Q${-17*s},${-22*s} ${-7*s},${-20*s} H${7*s} Q${17*s},${-22*s} ${19*s},${-10*s} L${16*s},${5*s} Q${14*s},${12*s} ${8*s},${6*s} L${4*s},${2*s} H${-4*s} L${-8*s},${6*s} Q${-14*s},${12*s} ${-16*s},${5*s} Z`} fill={accent} stroke="#1C1911" strokeWidth="1.6" strokeLinejoin="round"/>
        {eyes(-12, 4)}<path d={`M${-10*s},${-4*s} H${-3*s} M${-6.5*s},${-7.5*s} V${-0.5*s}`} stroke="#1C1911" strokeWidth="2" strokeLinecap="round"/><circle cx={8*s} cy={-5*s} r={2*s} fill="#E8634A" stroke="#1C1911" strokeWidth="0.7"/><circle cx={13*s} cy={-1*s} r={2*s} fill="#D4A800" stroke="#1C1911" strokeWidth="0.7"/>{feet(13, 7)}
      </>}
      {kind === 'umbrella' && <>
        <path d={`M${-21*s},${-10*s} Q${-16*s},${-28*s} 0,${-29*s} Q${16*s},${-28*s} ${21*s},${-10*s} Q${14*s},${-15*s} ${7*s},${-10*s} Q0,${-15*s} ${-7*s},${-10*s} Q${-14*s},${-15*s} ${-21*s},${-10*s} Z`} fill={accent} stroke="#1C1911" strokeWidth="1.6" strokeLinejoin="round"/>
        <line x1="0" y1={-28*s} x2="0" y2={6*s} stroke="#1C1911" strokeWidth="1.8"/><path d={`M0,${6*s} Q0,${14*s} ${7*s},${13*s}`} fill="none" stroke="#1C1911" strokeWidth="2" strokeLinecap="round"/>{eyes(-4, 4)}<path d={`M${-3*s},${2*s} Q0,${4*s} ${3*s},${2*s}`} fill="none" stroke="#1C1911" strokeWidth="0.9"/><line x1={-7*s} y1={7*s} x2={-7*s} y2={12*s} stroke="#1C1911" strokeWidth="1.6"/><ellipse cx={-7*s} cy={13*s} rx={3.4*s} ry={1.7*s} fill="#1C1911"/>
      </>}
    </g>
  );
}

const curioKinds: Partial<Record<AgentWorldPocketBuddyBlueprint['icon'], CurioKind>> = {
  'seed-tin': 'plant', clock: 'clock', key: 'key', planet: 'globe', controller: 'controller', umbrella: 'umbrella',
};

export function pocketBuddyPreviewUrl(sourceAssetUrl: string) {
  return sourceAssetUrl.includes('/assets/pocket-buddy/packages/')
    || sourceAssetUrl.includes('/assets/pocket-buddy/pet-materials-v1/')
    || sourceAssetUrl.includes('/assets/pocket-buddy/agent-world-original-v2/')
    ? sourceAssetUrl
    : sourceAssetUrl.replace(/\.png$/, '-thumb.png');
}

export default function AgentWorldPocketBuddyPortrait({
  blueprint,
  className = '',
  animated = true,
  style,
}: {
  blueprint: AgentWorldPocketBuddyBlueprint;
  className?: string;
  animated?: boolean;
  style?: CSSProperties;
  motionPackageId?: string;
}) {
  const sourceAssetUrl = blueprint.assetUrl;

  if (sourceAssetUrl) {
    const previewAssetUrl = pocketBuddyPreviewUrl(sourceAssetUrl);
    const isPetMaterial = sourceAssetUrl.startsWith('/assets/pocket-buddy/pet-materials-v1/');
    const isPetMaterialV2 = sourceAssetUrl.startsWith('/assets/pocket-buddy/pet-materials-v2/');
    const isAlienMaterial = sourceAssetUrl.startsWith('/assets/pocket-buddy/alien-materials-');
    const isLargeCatalogPet = ['puff', 'pip', 'mossback'].includes(blueprint.id);
    const sharedClassName = `pbf-catalog-portrait pbf-agent-world-sprite ${isPetMaterial ? 'is-pet-material' : ''} ${isPetMaterialV2 ? 'is-pet-material-v2' : ''} ${isAlienMaterial ? 'is-alien-material' : ''} ${isLargeCatalogPet ? 'is-large-catalog-pet' : ''} ${animated ? 'is-animated' : ''} ${className}`;
    return (
      <ProgressiveImage
        className={sharedClassName}
        style={style}
        src={sourceAssetUrl}
        previewSrc={previewAssetUrl}
        eager={blueprint.id === 'holiday-christmas-dachshund'}
        alt={`${blueprint.name}的图鉴形象`}
        draggable={false}
      />
    );
  }
  const props = { accent: blueprint.accent, animated, scale: 1.32 };
  const curioKind = curioKinds[blueprint.icon];
  return (
    <svg className={`pbf-catalog-portrait pbf-agent-world-vector ${className}`} style={style} viewBox="-48 -48 96 96" role="img" aria-label={`${blueprint.name}的图鉴形象`}>
      <title>{blueprint.name}</title>
      <g transform="translate(0 7)">
        {blueprint.icon === 'mug' && <MugAgent {...props} />}
        {blueprint.icon === 'camera' && <CameraAgent {...props} />}
        {blueprint.icon === 'plush' && <PlushAgent {...props} scale={1.4} />}
        {blueprint.icon === 'book' && <BookAgent {...props} />}
        {blueprint.icon === 'lamp' && <LampAgent {...props} />}
        {blueprint.icon === 'headphones' && <HeadphonesAgent {...props} />}
        {curioKind && <CurioAgent {...props} kind={curioKind} />}
      </g>
    </svg>
  );
}
