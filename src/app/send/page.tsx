import Header from '@/components/header';
import Row from '@/components/row';
import Image from 'next/image';

export default function Send() {
  return (
    <Row>
      <h1 className="text-lg pb-4">Send an email</h1>
      <form
        action="/api/email"
        method="POST"
        className="grid grid-cols-1 gap-6 w-2/6"
      >
        <label className="block">
          <span>Full name</span>
          <input
            className="mt-1 block w-full form-input text-slate-950 font-sans"
            type="text"
            name="firstName"
          />
        </label>
        <label className="block">
          <span>Email template</span>
          <select
            className="mt-1 block w-full form-select text-slate-950 font-sans"
            name="product"
          >
            <option selected value="Tigris Database">
              Tigris Database Welcome
            </option>
            <option value="Tigris Search">Tigris Search Welcome</option>
            <option value="Resend">Resend Welcome</option>
          </select>
        </label>
        <label className="flex justify-end">
          <button className="px-4 py-2 font-semibold text-sm bg-teal-500 text-white rounded-md shadow-sm opacity-100">
            Send
          </button>
        </label>
      </form>
    </Row>
  );
}
