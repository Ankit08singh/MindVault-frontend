import { useState } from "react";

export default function assign() {
  const persons: string[] = [
    "Ankit Singh",
    "rohit Sharma",
    "Yash garg",
    "punit",
    "ankit tiwari",
    "virat singh",
  ];

  const [query, setQuery] = useState<string>("");
  const [people, setPeople] = useState<string[]>([]);

  const handleSelect = (person: string) => {
    setPeople((p) => [...p, person]);
  };

  const handleRemove = (person: string) => {
    setPeople((p) => p.filter((p) => p !== person));
  };

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuery(e.target.value);
  };

  const handleFilter = persons.filter(
    (p) => p.toLowerCase().includes(query.toLowerCase()) && !people.includes(p)
  );

  const handleBack = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && query.length === 0 && people.length > 0) {
      const last = people[people.length - 1];
      handleRemove(last);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className='w-[400px]'>
          <div className="rounded-md grid grid-cols-1 gap-2 mb-3 bg-gray-400">
          {people.map((p) => (
            <div key={p} className="text-black">
              {p}
              <button onClick={() => handleRemove(p)}> X</button>
            </div>
          ))}
        </div>
        <div className="fixed">
          <input
            type="text"
            placeholder="enter name"
            value={query}
            onChange={handleQuery}
            onKeyDown={handleBack}
            
          />
          {query.length > 0 && handleFilter.length > 0 && (
            <div className="mt-2 border rounded-md bg-white ">
              {handleFilter.map((p) => (
                <div key={p} onClick={() => handleSelect(p)} className="text-black">
                  {p}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      
    </div>
  );
}
