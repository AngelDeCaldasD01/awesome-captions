import { Timestamp } from '@/models/Timestamp';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import TranscriptionItem from './TranscriptionItem';

interface TranscriptionEditorProps {
  transcriptionData: Timestamp[];
  setTranscriptionData: Dispatch<SetStateAction<Timestamp[]>>;
}

export default function TranscriptionEditor({
  transcriptionData: data,
  setTranscriptionData,
}: TranscriptionEditorProps) {
  const updateTranscriptionItem = (
    index: number,
    prop: keyof Timestamp,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const newData = [...data];
    const newItem = { ...newData[index] };
    newItem[prop] = e.target.value;
    newData[index] = newItem;
    setTranscriptionData(newData);
  };

  return (
    <>
      <div className='grid grid-cols-3 sticky top-0 bg-violet-800/80 p-2 rounded-md'>
        <span>From</span>
        <span>End</span>
        <span>Content</span>
      </div>
      {data.length > 0 &&
        data.map((item, index) => (
          <div key={index}>
            <TranscriptionItem
              key={index}
              item={item}
              handleStartTimeChange={(e) =>
                updateTranscriptionItem(index, 'start', e)
              }
              handleEndTimeChange={(e) =>
                updateTranscriptionItem(index, 'end', e)
              }
              handleContentChange={(e) =>
                updateTranscriptionItem(index, 'content', e)
              }
            />
          </div>
        ))}
    </>
  );
}
