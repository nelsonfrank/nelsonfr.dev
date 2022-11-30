export default function YouTube({ id }: { id: string }) {
  return (
    <div className="nf-relative nf-pb-56.25% nf-h-0 nf-overflow-hidden nf-max-w-full nf-my-4">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        allow="autoplay; encrypted-media"
        title="Embedded YouTube video"
        className="nf-absolute nf-top-0 nf-left-0 nf-w-full nf-h-full nf-border-0"
      />
    </div>
  );
}
