import { Timestamp } from '@/models/Timestamp';
import { ChangeEventHandler } from 'react';

interface TranscriptionItemProps {
  item: Timestamp;
  handleStartTimeChange: ChangeEventHandler<HTMLInputElement>;
  handleEndTimeChange: ChangeEventHandler<HTMLInputElement>;
  handleContentChange: ChangeEventHandler<HTMLInputElement>;
}

export default function TranscriptionItem({
  item,
  handleStartTimeChange,
  handleEndTimeChange,
  handleContentChange,
}: TranscriptionItemProps) {
  return (
    <div className='my-1 grid grid-cols-3 gap-1 items-center'>
      <input
        type='text'
        className='bg-white/20 p-1 rounded-md'
        value={item.start}
        onChange={handleStartTimeChange}
      />
      <input
        type='text'
        className='bg-white/20 p-1 rounded-md'
        value={item.end}
        onChange={handleEndTimeChange}
      />
      <input
        type='text'
        className='bg-white/20 p-1 rounded-md'
        value={item.content}
        onChange={handleContentChange}
      />
    </div>
  );
}
