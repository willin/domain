export default function AdSlot() {
  return (
    <div
      id={`i${Math.random().toString()}`}
      className='ads mx-auto text-center mb-4'>
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client='ca-pub-5059418763237956'
        data-ad-slot='9518721243'
        data-ad-format='auto'
        data-full-width-responsive='true'></ins>
    </div>
  );
}
