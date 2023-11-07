import FireIcon from './icons/FireIcon';

export default function DemoSection() {
  return (
    <section className='flex justify-around mt-12 items-center'>
      <div className='bg-gray-800/50 w-[240px] h-[480px] rounded-xl'>
        Hola hola caracola
      </div>
      <FireIcon />
      <div className='bg-gray-800/50 w-[240px] h-[480px] rounded-xl'>a</div>
    </section>
  );
}
