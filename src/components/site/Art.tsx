/**
 * Original abstract "product render" compositions used as card imagery until real
 * photography is supplied: monochrome metal surfaces with a single red accent.
 */
export default function Art({ variant }: { variant: number }) {
  return (
    <div className={`art art--${variant % 6}`} aria-hidden>
      <div className="art__a" />
      <div className="art__b" />
      <div className="art__c" />
      <div className="grain" />
    </div>
  );
}
