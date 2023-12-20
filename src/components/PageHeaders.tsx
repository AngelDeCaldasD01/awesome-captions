export default function PageHeaders({ h1Text = 'Hello', h2Text = 'Subheader' }) {
  return (
    <section className='text-center mt-12 sm:mt-24 mb-4 sm:mb-8'>
      <h1 className='text:xl sm:text-3xl drop-shadow-xl'>{h1Text}</h1>
      <h2 className='text-white/75 text-sm sm:text-base'>{h2Text}</h2>
    </section>
  );
}
