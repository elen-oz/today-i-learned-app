import { useState } from 'react';
import supabase from '../supabase';

import { isValidHttpUrl } from '../utils';
import { CATEGORIES } from '../data';

const NewFactForm = ({ setFacts, setShowForm }) => {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const textLength = text.length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      const { data: newFact, error } = await supabase
        .from('facts')
        .insert([{ text, source, category }])
        .select();

      if (!error) {
        setFacts((facts) => [newFact[0], ...facts]);
      }

      setText('');
      setCategory('');
      setSource('');

      setShowForm(false);
    }
  };

  return (
    <form className='fact-form' onSubmit={handleSubmit}>
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
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value=''>Choose category:</option>
        {CATEGORIES.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className='btn btn-large'>Post</button>
    </form>
  );
};

export default NewFactForm;
