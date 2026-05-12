import { useState } from 'react'
import './SearchScratchPage.css'
import { Suspense } from 'react'
import useNetwork from './useNetwork'
import { useCallback } from 'react'

const ITEMS = [
  'iPhone 15 Pro',
  'iPad Air',
  'MacBook Pro 16"',
  'AirPods Pro',
  'Apple Watch Ultra',
  'Samsung Galaxy S24',
  'Sony WH-1000XM5',
  'Kindle Paperwhite',
  'Nintendo Switch OLED',
  'PlayStation 5',
  'Xbox Series X',
  'Logitech MX Master 3S',
  'Dell XPS 15',
  'Surface Laptop Studio',
  'Bose QuietComfort Ultra',
]

function debounce(fn, delay) {
   let id = '';
  return function(...args){
    let self = this;
      clearTimeout(id);
      id = setTimeout(()=> {
        console.log('dsd');
        fn.call(self, ...args);
      },delay);
  }
}

function throttle(fn, delay) { 

  let waiting = false;
   return function(...args) {

      if(waiting) return;

       waiting = true;
       fn.call(this, ...args)
       setTimeout(()=> {waiting = false}, delay);

   }

}

export default function SearchScratchPage() {
  const [query, setQuery] = useState('')


  const { data, isLoading, getFilteredProducts, abort } = useNetwork();
  console.log(data);


  const debouncedQuery = useCallback(throttle(getFilteredProducts, 1000), []);

  const handleChange = (e) => {
    setQuery(e.target.value);
    // abort();
    getFilteredProducts(e.target.value);
    //debouncedQuery(e.target.value);
  };


  return (
    <div className="scratch-page">
      <div className="scratch-card">
        <h1 className="scratch-title">Search (from scratch)</h1>
        <p className="scratch-sub">
          Starter shell — input + hardcoded dropdown. We'll evolve this into the
          debounced and immediate versions step by step.
        </p>

        <div className="scratch-search">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            placeholder="Search products…"
            className="scratch-input"
            autoComplete="off"
            spellCheck="false"
          />

          <Suspense fallback="loading list">
            <DropDown query={query} data={data} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}



function DropDown({  query, data }) {

   

    const showDropdown = query && data?.length > 0;


  if (!showDropdown) {
    return null;
  }

  return (
    <ul className="scratch-dropdown" role="listbox">
      {data.map((item, i) => (
        <li
          key={item.id}
          className="scratch-option"
          style={{ "--i": i }}
          role="option"
          aria-selected="false"
          onMouseDown={() => {
            setQuery(item);
            setOpen(false);
          }}
        >
          {item.title}
        </li>
      ))}
    </ul>
  );
}