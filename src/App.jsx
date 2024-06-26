import { useEffect, useState } from 'react';
import supabase from './supabase';
import Header from './components/Header';
import Loader from './components/Loader';
import NewFactForm from './components/NewFactForm';
import CategoryFilter from './components/CategoryFilter';
import FactsList from './components/FactsList';

import './styles.css';

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

      const { data: facts, error } = await query
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
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm && (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      )}
      <main className='main'>
        <CategoryFilter setCurrentCategory={setCurrentCategory} />

        {isLoading ? (
          <Loader />
        ) : (
          <FactsList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
};

export default App;
