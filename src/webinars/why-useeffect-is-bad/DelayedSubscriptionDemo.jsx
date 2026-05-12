import { useState, useEffect } from "react";
export default function App() {
    const [count, setCount] = useState(0);
    console.log(`Re-rendered count before useEffect: ${count}`);


    useEffect(() => {
        requestIdleCallback(()=> {
          console.log(`Inner useEffect count: ${count}`);
          const now = performance.now();
          while (performance.now() - now < 1000) {
            console.log("222");
          }
        })
    }, [count]);

    console.log(`Re-rendered count after useEffect: ${count}`);
    return (
        <div>
            <h1>Count: {count}</h1>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}
// 60 FPS 1000 16ms