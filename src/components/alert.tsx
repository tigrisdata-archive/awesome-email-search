import { InformationCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

export type AlertProps = {
  title: string;
  text?: string;
  type: 'SUCCESS' | 'ERROR';
  className?: string;
};

const errorCss = 'text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400';
const successCss =
  'text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400';

export const Alert = (props: AlertProps) => {
  const [closed, setClosed] = useState<boolean>(false);
  if (closed) return <></>;

  return (
    <div
      className={`fixed top-10 flex p-4 text-sm rounded-lg ${
        props.type === 'SUCCESS' ? successCss : errorCss
      } ${props.className}`}
      role="alert"
    >
      <InformationCircleIcon className="w-5 h-5 mr-4" />
      <span className="sr-only">Info</span>
      <div className="pr-5">
        <span className="font-medium">{props.title}</span> {props.text}
      </div>
      <div className="absolute top-1 right-1 w-4 h-4 text-gray-600 text-opacity-50 cursor-pointer hover:text-opacity-100">
        <XCircleIcon
          onClick={() => {
            setClosed(true);
          }}
        />
      </div>
    </div>
  );
};
