import FireIcon from './icons/FireIcon';

export default function DemoSection() {
  return (
    <section className='flex justify-around mt-8 sm:mt-12 items-center'>
      <div className='hidden sm:block bg-gray-800/50 w-[240px] h-[480px] rounded-xl'>Hola hola caracola</div>
      <div className='hidden sm:block'>
        <FireIcon />
      </div>
      <div className='bg-gray-800/50 w-[240px] h-[480px] rounded-xl'>a</div>
    </section>
  );
}
