import React from 'react';

const SkeletonTable = () => {
  const skeletonRows = Array.from({ length: 16 }).map((_, index) => index + 1);

  return (
    <>
      <table className='min-w-full shadow-md rounded'>
        <thead className='bg-transparent p-2 rounded-md'>
          <tr className='bg-violet-800/80 p-2 rounded-md'>
            <th className='py-2 px-2 font-400 text-left rounded-tl-md rounded-bl-md'>From</th>
            <th className='py-2 px-2 font-400 text-left'>End</th>
            <th className='py-2 px-4 font-400 text-left rounded-tr-md rounded-br-md'>Content</th>
          </tr>
        </thead>
        <tbody className=' sm:h-48 h-24 bg-white rounded-md'>
          {skeletonRows.map((item, index) => (
            <tr key={item} className='rounded-md'>
              <td className={`py-1 px-2 ${index === 0 && 'rounded-tl-md'} ${index === skeletonRows.length - 1 && 'rounded-bl-md'}`}>
                <div className='animate-pulse w-full bg-gray-300 h-4 rounded'></div>
              </td>
              <td className='py-1 px-2'>
                <div className='animate-pulse w-full bg-gray-300 h-4 rounded'></div>
              </td>
              <td className={`py-1 px-4 ${index === 0 && 'rounded-tr-md'} ${index === skeletonRows.length - 1 && 'rounded-br-md'}`}>
                <div className='animate-pulse w-full bg-gray-300 h-4 rounded'></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default SkeletonTable;
