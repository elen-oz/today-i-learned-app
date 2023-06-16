import { useEffect, useState } from 'react';
import supabase from './supabase';
import './styles.css';

const initialFacts = [
  {
    id: 1,
    text: 'React is being developed by Meta (formerly facebook)',
    source: 'https://opensource.fb.com/',
    category: 'technology',
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: 'Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%',
    source: 'https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids',
    category: 'society',
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: 'Lisbon is the capital of Portugal',
    source: 'https://en.wikipedia.org/wiki/Lisbon',
    category: 'society',
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

const CATEGORIES = [
  { name: 'technology', color: '#3b82f6' },
  { name: 'science', color: '#16a34a' },
  { name: 'finance', color: '#ef4444' },
  { name: 'society', color: '#eab308' },
  { name: 'entertainment', color: '#db2777' },
  { name: 'health', color: '#14b8a6' },
  { name: 'history', color: '#f97316' },
  { name: 'news', color: '#8b5cf6' },
];

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <dib>
      <span style={{ fontSize: '40px' }}>{count}</span>
      <button
        onClick={() => setCount((c) => c + 1)}
        className='btn btn-large'
      >
        +1
      </button>
    </dib>
  );
};

const App = () => {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(() => {
    const getFacts = async () => {
      setIsLoading(true);

      let query = supabase.from('facts').select('*');

      if (currentCategory !== 'all') {
        query = query.eq('category', currentCategory);
      }

      let { data: facts, error } = await query
        .order('votesInteresting', { ascending: false })
        .limit(1000);

      if (!error) {
        setFacts(facts);
      } else {
        alert('There was a problem getting data');
      }

      setIsLoading(false);
    };

    getFacts();
  }, [currentCategory]);

  return (
    <>
      <Header
        showForm={showForm}
        setShowForm={setShowForm}
      />
      {showForm && (
        <NewFactForm
          setFacts={setFacts}
          setShowForm={setShowForm}
        />
      )}
      <main className='main'>
        <CategoryFilter setCurrentCategory={setCurrentCategory} />

        {isLoading ? <Loader /> : <FactsList facts={facts} />}
      </main>
    </>
  );
};

const Loader = () => {
  return <p className='message'>Loading...</p>;
};

const Header = ({ showForm, setShowForm }) => {
  return (
    <header className='header'>
      <div className='logo'>
        <img
          src='logo.png'
          height='68'
          width='68'
          alt='Today I Learned Logo'
        />
        <h1>Today I Learned</h1>
      </div>

      <button
        onClick={() => setShowForm((show) => !show)}
        className='btn btn-large btn-open'
      >
        {showForm ? 'close' : 'Share a fact'}
      </button>
    </header>
  );
};

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
};

const NewFactForm = ({ setFacts, setShowForm }) => {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const textLength = text.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(text, source, category);

    //2. Check if data is valid => create a new fact
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      console.log('there is data');
    }

    //3. Create a new object
    const newFact = {
      id: Math.round(Math.random() * 10000000),
      text: text,
      source: source,
      category: category,
      votesInteresting: 0,
      votesMindblowing: 0,
      votesFalse: 0,
      createdIn: new Date().getFullYear(),
    };

    //4. Add the new fact to the UI: add the fact to state
    setFacts((facts) => [newFact, ...facts]);

    //5. Reset input fields
    setText('');
    setCategory('');
    setSource('');

    //6. Close the form
    setShowForm(false);
  };

  return (
    <form
      className='fact-form'
      onSubmit={handleSubmit}
    >
      <input
        type='text'
        placeholder='Share a fact with the world...'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        type='text'
        placeholder='Trustworthy source...'
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value=''>Choose category:</option>
        {CATEGORIES.map((item) => (
          <option
            key={item.name}
            value={item.name}
          >
            {item.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className='btn btn-large'>Post</button>
    </form>
  );
};

const CategoryFilter = ({ setCurrentCategory }) => {
  return (
    <aside>
      <ul>
        <li className='category'>
          <button
            onClick={() => {
              setCurrentCategory('all');
            }}
            className='btn btn-all-categories'
          >
            All
          </button>
        </li>
        {CATEGORIES.map((item) => (
          <li
            key={item.name}
            className='category'
          >
            <button
              onClick={() => {
                setCurrentCategory(item.name);
              }}
              className='btn btn-category'
              style={{ backgroundColor: item.color }}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

const FactsList = ({ facts }) => {
  if (facts.length === 0) {
    return <p className='message'>No facts for this category yet. Create the first one!</p>;
  }
  return (
    <section>
      <ul className='facts-list'>
        {facts.map((fact) => (
          <Fact
            key={fact.id}
            fact={fact}
          />
        ))}
      </ul>
    </section>
  );
};

const Fact = ({ fact }) => {
  return (
    <li className='fact'>
      <p>
        {fact.text}
        <a
          className='source'
          href={fact.source}
          target='_blank'
          rel='noreferrer'
        >
          (Sourse)
        </a>
      </p>
      <span
        className='tag'
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category).color,
        }}
      >
        {fact.category}
      </span>
      <div className='vote-buttons'>
        <button>👍 {fact.votesInteresting}</button>
        <button>🤯 {fact.votesMindblowing}</button>
        <button>⛔️ {fact.votesFalse}</button>
      </div>
    </li>
  );
};

export default App;
