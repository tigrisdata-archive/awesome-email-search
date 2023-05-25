'use client';

import { Fragment, useEffect, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

type MultiSelectProps = {
  options: string[];
  onChange?: (value: string[]) => void;
};

export default function MultiSelect(props: MultiSelectProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  const sortValues = (values: string[]) => {
    return values.filter((value) => props.options.includes(value));
  };

  useEffect(() => {
    if (props.onChange) {
      props.onChange(selected);
    }
  }, [props, selected]);

  const handleOnChange = (value: string[]) => {
    setSelected(value);
  };

  const filtered =
    query === ''
      ? props.options
      : props.options.filter((option) =>
          option
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div className="flex justify-center items-center z-10">
      <div className="top-16 w-full">
        <Combobox value={selected} onChange={handleOnChange} multiple>
          <div className="relative">
            <div className="relative w-full cursor-default text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-teal-300 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm rounded-lg">
              <Combobox.Input
                className="w-full pr-10 rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-teal-300 sm:text-sm text-slate-950 font-sans"
                displayValue={(values: string[]) => {
                  return values.length == 0
                    ? 'All'
                    : sortValues(values).join(', ');
                }}
                onKeyUp={(e) => {
                  setQuery(e.currentTarget.value);
                }}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filtered.length === 0 && query !== '' ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filtered.map((status) => (
                    <Combobox.Option
                      key={status}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-slate-600 text-white' : 'text-gray-900'
                        }`
                      }
                      value={status}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {status}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-slate-600'
                              }`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    </div>
  );
}
